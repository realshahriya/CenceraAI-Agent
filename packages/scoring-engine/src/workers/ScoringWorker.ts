import { scoringQueue, ScoringJobData } from '../queue/scoringQueue';
import { PatternMatcher } from './PatternMatcher';
import { SignalAggregator } from './SignalAggregator';
import { ZoneClassifier } from './ZoneClassifier';
import { ScoreWriter } from './ScoreWriter';

export function startScoringWorker(concurrency: number = 5) {
  scoringQueue.process(concurrency, async (job) => {
    const data: ScoringJobData = job.data;
    const startTime = Date.now();

    try {
      // Step 1: Run pattern matching and signal aggregation in PARALLEL
      const [patternResult, signals] = await Promise.all([
        PatternMatcher.match(data.entityId, data.address, data.chainId),
        SignalAggregator.aggregate(data.entityId, data.entityType),
      ]);

      // Step 2: Classify into zone
      const zoneResult = ZoneClassifier.classify(patternResult, signals);

      // Step 3: Build score object
      const score = {
        compositeScore: zoneResult.compositeScore,
        confidence: zoneResult.confidence,
        zone: zoneResult.zone,
        manifest: { signalGroupsActive: ['onchain'], lookbackDays: 30, modelVersion: 'v1.0.0' },
        contribution: { onchain: zoneResult.compositeScore },
        triggeredIndicators: [],
        modelVersion: 'v1.0.0',
        computedAt: new Date().toISOString(),
        tvlAdjacency: signals.tvlAdjacency || 0
      };

      // Step 4: Write to database and populate cache
      await ScoreWriter.write(data.entityId, score);

      const duration = Date.now() - startTime;
      console.log(`Scored ${data.address} on chain ${data.chainId} in ${duration}ms`);

      return score;
    } catch (err) {
      console.error(`Failed to score ${data.address}:`, err);
      throw err; // Bull will retry based on defaultJobOptions
    }
  });
}
