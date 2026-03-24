import Bull from 'bull';

export const scoringQueue = new Bull('entity-scoring', {
  redis: { host: process.env.REDIS_HOST || 'localhost', port: 6379 },
  defaultJobOptions: {
    attempts: 3,              // Retry failed jobs 3 times
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,    // Keep last 100 completed jobs for debugging
    removeOnFail: 500,        // Keep failed jobs for investigation
  }
});

export interface ScoringJobData {
  entityId: string;
  address: string;
  chainId: number;
  entityType: string;
  priority: 'critical' | 'standard' | 'background';
  triggeredBy: 'api_request' | 'pre_warm' | 'cache_expired' | 'threat_update';
}

export async function queueEntityScore(data: ScoringJobData) {
  const priority = data.priority === 'critical' ? 1 : data.priority === 'standard' ? 5 : 10;
  return scoringQueue.add(data, { priority });
}
