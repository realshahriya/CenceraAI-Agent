export class SignalAggregator {
  static async aggregate(entityId: string, entityType: string) {
    // Collect signals from TimescaleDB entity_signals table
    // For now, return a synthesized mock based on the schema and papers.
    return {
      anomalyScore: 0.1,
      hasExploitAdjacency: false,
      tvlAdjacency: 50000
    };
  }
}
