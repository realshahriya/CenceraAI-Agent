import { Kafka } from 'kafkajs';

export class KafkaProducer {
  private producer;

  constructor(private topic: string) {
    const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
    this.producer = kafka.producer();
  }

  async send(message: any) {
    await this.producer.connect();
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
