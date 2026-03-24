import { redis } from './redisClient';
import { db } from '../db/connection';
import { ScoreObject } from '@cencera/shared';

export class CacheManager {
  // L2 Redis cache lookup
  static async getScore(entityId: string): Promise<ScoreObject | null> {
    const cached = await redis.get(`score:${entityId}`);
    if (cached) {
      const score = JSON.parse(cached);
      // Always include staleness age so platforms know how fresh this is
      if (score.computedAt) {
        score.cacheAge = Math.floor((Date.now() - new Date(score.computedAt).getTime()) / 1000);
      }
      return score;
    }
    return null;
  }

  // Fallback to database if Redis misses
  static async getScoreFromDb(entityId: string): Promise<ScoreObject | null> {
    const result = await db.query(`
      SELECT score_cache FROM entities WHERE id = $1
    `, [entityId]);
    
    if (result.rows[0]?.score_cache) {
      const score = result.rows[0].score_cache;
      // Repopulate Redis so next call is a cache hit
      await redis.set(`score:${entityId}`, JSON.stringify(score), 'EX', 900);
      return score;
    }
    return null;
  }

  // Invalidate — called when new threat confirmed or entity flagged
  static async invalidate(entityId: string) {
    await redis.del(`score:${entityId}`);
    // Also clear from entity table so DB fallback also misses
    await db.query(`UPDATE entities SET score_cache = NULL WHERE id = $1`, [entityId]);
  }
}
