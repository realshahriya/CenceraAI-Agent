import { db } from '../db/connection';

export class PatternMatcher {
  static async match(entityId: string, address: string, chainId: number) {
    // Stub definition for retrieving bytecode
    const bytecode = "0xMockBytecode"; 
    
    // Stub generation for embeddings
    const embeddingStr = "[0.0, 0.1, 0.2]"; // Using mock vector based on generated hash

    // Run BOTH searches in parallel
    const [threatMatches, normalMatches] = await Promise.all([
      db.query(`
        SELECT id, exploit_category, confidence_score,
               1 - (bytecode_vector <=> $1::vector) AS similarity
        FROM threat_library
        WHERE 1 - (bytecode_vector <=> $1::vector) > 0.15
        ORDER BY bytecode_vector <=> $1::vector
        LIMIT 5
      `, [embeddingStr]).catch(() => ({ rows: [] })),
      db.query(`
        SELECT id, activity_type, confidence_score,
               1 - (bytecode_vector <=> $1::vector) AS similarity
        FROM normal_activity_library
        WHERE 1 - (bytecode_vector <=> $1::vector) > 0.20
        ORDER BY bytecode_vector <=> $1::vector
        LIMIT 5
      `, [embeddingStr]).catch(() => ({ rows: [] })),
    ]);

    const topThreatSimilarity = threatMatches?.rows[0]?.similarity || 0;
    const topNormalSimilarity = normalMatches?.rows[0]?.similarity || 0;

    return {
      threatSimilarity: topThreatSimilarity,
      normalSimilarity: topNormalSimilarity,
      topThreatMatches: threatMatches?.rows || [],
      topNormalMatches: normalMatches?.rows || [],
      hasHistory: true
    };
  }
}
