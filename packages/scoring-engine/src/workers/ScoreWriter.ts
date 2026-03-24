import { db } from '../db/connection';
import { redis } from '../cache/redisClient';
// import { reviewQueue } from '../queue/reviewQueue'; // Mocker for now

export class ScoreWriter {
  static async write(entityId: string, score: any) {
    // Write to PostgreSQL scores table
    await db.query(`
      INSERT INTO entity_scores
        (entity_id, composite_score, confidence_level, zone, score_manifest, contribution, triggered_indicators, model_version)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
        entityId, score.compositeScore, score.confidence, score.zone,
        JSON.stringify(score.manifest), JSON.stringify(score.contribution),
        JSON.stringify(score.triggeredIndicators), score.modelVersion
    ]);

    // Update entity cache column for instant reads
    await db.query(`
      UPDATE entities SET score_cache = $1, last_scored_at = NOW() WHERE id = $2
    `, [JSON.stringify(score), entityId]);

    // Populate L2 Redis cache — TTL depends on entity activity level
    const ttl = score.zone === 3 ? 300 : score.confidence === 'high' ? 1800 : 900;
    await redis.set(`score:${entityId}`, JSON.stringify(score), 'EX', ttl);

    // Zone 3: Queue for human review
    if (score.zone === 3) {
      console.log(`[Review Queue] Adding entity ${entityId} to human review queue.`);
      // await reviewQueue.add({
      //   entityId,
      //   priority: score.tvlAdjacency > 1000000 ? 'critical' : 'standard',
      //   reason: 'zone3_unknown',
      //   slaDeadline: new Date(Date.now() + (score.tvlAdjacency > 1000000 ? 4 : 24) * 60 * 60 * 1000),
      // });
    }
  }
}
