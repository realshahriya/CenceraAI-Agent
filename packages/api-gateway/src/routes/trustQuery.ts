import { Request, Response } from 'express';
import { CacheManager } from '../cache/cacheManager';
import { EntityResolver } from '../services/EntityResolver';
// Using generic reference to the scoring queue stub since api-gateway depends on scoring queue conceptually
// In a monolith this would just be imported, but we'll adapt it for the monorepo API gateway scope
import { queueEntityScore } from '@cencera/scoring-engine';

export async function handleTrustQuery(req: Request, res: Response) {
  const { address, chainId } = req.params;
  const startTime = Date.now();

  // Step 1: Resolve entity
  const entity = await EntityResolver.getOrCreate(address, parseInt(chainId));

  // Step 2: Try L2 Redis cache first
  let score = await CacheManager.getScore(entity.id);

  // Step 3: Try DB cache if Redis misses
  if (!score) {
    score = await CacheManager.getScoreFromDb(entity.id);
  }

  // Step 4: If still no score, queue fresh computation
  // Return a provisional response immediately — do NOT wait for computation
  if (!score) {
    await queueEntityScore({
      entityId: entity.id, 
      address, 
      chainId: parseInt(chainId),
      entityType: entity.entity_type,
      priority: 'standard', 
      triggeredBy: 'api_request'
    });

    return res.json({
      status: 'computing',
      message: 'Score is being computed. Retry in 500ms.',
      entity: { address, chainId, entityType: entity.entity_type },
      lifecycleState: entity.lifecycle_state,
      estimatedReadyMs: 500,
    });
  }

  // Step 5: If score is old, queue background refresh but return current score
  const ageMinutes = (score.cacheAge || 0) / 60;
  if (ageMinutes > 5) {
    queueEntityScore({ 
      entityId: entity.id, address, chainId: parseInt(chainId),
      entityType: entity.entity_type, 
      priority: 'background', triggeredBy: 'cache_expired' 
    });
  }

  const responseTime = Date.now() - startTime;
  res.setHeader('X-Response-Time', `${responseTime}ms`);
  res.setHeader('X-Cache-Hit', (score.cacheAge || 0) < 60 ? 'true' : 'stale');

  return res.json(score);
}
