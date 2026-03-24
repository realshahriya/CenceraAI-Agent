export interface SignalSchema {
  time: string;
  address: string;
  chain_id: number;
  signal_domain: 'onchain' | 'market' | 'offchain' | 'ai_derived' | 'external_feed';
  signal_type: string;
  signal_value: number;
  signal_data: Record<string, any>;
  confidence?: number;
  source: string;
}

export interface ScoreObject {
  compositeScore: number;
  confidence: 'low' | 'medium' | 'high';
  zone: 1 | 2 | 3;
  manifest: Record<string, any>;
  contribution: Record<string, number>;
  triggeredIndicators: Array<Record<string, any>>;
  modelVersion: string;
  cacheAge?: number;
  computedAt?: string;
  tvlAdjacency?: number;
}
