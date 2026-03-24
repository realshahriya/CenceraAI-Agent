import { db } from '../db/connection';

export class EntityResolver {
  static async getOrCreate(address: string, chainId: number) {
    const result = await db.query(`SELECT * FROM entities WHERE address = $1 AND chain_id = $2`, [address, chainId]);
    
    if (result.rows.length > 0) return result.rows[0];

    // Lazy initialization for nascent entities
    const inserted = await db.query(`
      INSERT INTO entities (address, chain_id, entity_type, lifecycle_state)
      VALUES ($1, $2, 'eoa', 'nascent') RETURNING *
    `, [address, chainId]);
    
    return inserted.rows[0];
  }
}
