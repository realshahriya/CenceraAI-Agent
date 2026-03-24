export class ZoneClassifier {
  static classify(pattern: any, signals: any) {
    // ZONE 2: Known Threat — strong match against threat library
    if (pattern.threatSimilarity >= 0.75) {
      return { zone: 2, compositeScore: Math.round(pattern.threatSimilarity * 30), confidence: 'high' };
    }

    // ZONE 2: Behavioral threat signals
    if (signals.anomalyScore > 0.8 || signals.hasExploitAdjacency) {
      return { zone: 2, compositeScore: 25, confidence: 'medium' };
    }

    // ZONE 1: Known Safe — strong normal match, low threat similarity
    if (pattern.normalSimilarity >= 0.70 && pattern.threatSimilarity < 0.20) {
      const score = 60 + Math.round(pattern.normalSimilarity * 40);
      return { zone: 1, compositeScore: Math.min(score, 95), confidence: 'high' };
    }

    // ZONE 3: Unknown — cannot classify confidently
    // CRITICAL: Unknown is NEVER treated as safe
    return {
      zone: 3,
      compositeScore: 35,  // Provisional cautious score
      confidence: 'low',
      requiresReview: true,
    };
  }
}
