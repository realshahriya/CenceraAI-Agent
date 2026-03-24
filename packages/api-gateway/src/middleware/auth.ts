import { Request, Response, NextFunction } from 'express';
import { redis } from '../cache/redisClient';

export interface AuthRequest extends Request {
  platformId?: string;
  tier?: 'free' | 'standard' | 'enterprise';
}

export async function verifyApiKey(req: AuthRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) return res.status(401).json({ error: 'API key required' });

  const keyData = await redis.get(`apikey:${apiKey}`);
  if (!keyData) return res.status(401).json({ error: 'Invalid API key' });

  const key = JSON.parse(keyData);
  req.platformId = key.platformId;
  req.tier = key.tier; 
  next();
}

export async function checkRateLimit(req: AuthRequest, res: Response, next: NextFunction) {
  const limits = { free: 100, standard: 10000, enterprise: 999999 };
  const windowKey = `ratelimit:${req.platformId}:${Math.floor(Date.now() / 60000)}`;

  const currentStr = await redis.incr(windowKey);
  const current = typeof currentStr === 'number' ? currentStr : parseInt(currentStr, 10);
  
  if (current === 1) await redis.expire(windowKey, 60);

  const limit = limits[req.tier!] || limits.free;
  if (current > limit) {
    return res.status(429).json({ error: 'Rate limit exceeded', resetIn: '60 seconds' });
  }

  res.setHeader('X-RateLimit-Remaining', limit - current);
  next();
}
