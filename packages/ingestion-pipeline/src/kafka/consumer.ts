import { Kafka } from 'kafkajs';
import { db } from '../db/connection';

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'signal-writer' });

export async function startSignalWriter() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'raw-signals', fromBeginning: false });

  await consumer.run({
    eachBatch: async ({ batch }) => {
      const signals = batch.messages.map(m => JSON.parse(m.value!.toString()));

      // Batch insert for performance — never insert one by one
      await db.query(`
        INSERT INTO entity_signals (time, entity_id, signal_domain, signal_type, signal_value, signal_data, source)
        SELECT s.time, e.id, s.signal_domain, s.signal_type, s.signal_value, s.signal_data, s.source
        FROM jsonb_to_recordset($1::jsonb) AS s(
          time timestamptz, address text, chain_id int,
          signal_domain text, signal_type text, signal_value float,
          signal_data jsonb, source text
        )
        JOIN entities e ON e.address = s.address AND e.chain_id = s.chain_id
        ON CONFLICT DO NOTHING
      `, [JSON.stringify(signals)]);
    }
  });
}
