
CENCERA
Developer Reference Document
How to Build Cencera — From Zero to Production
Stack: TypeScript + Python | AWS | PostgreSQL + TimescaleDB | Redis | Kafka
Confidential — Internal Engineering Document
Language	Cloud	Primary DB	Cache	Queue	CDN
TypeScript + Python	AWS (Activate)	PostgreSQL + TimescaleDB	Redis Cluster	AWS SQS + Bull	Cloudflare Workers



This document tells you exactly how to build Cencera. Every section has the real code, the real SQL, the real API contracts, and the real commands. Read the product context section first so you understand why each technical decision was made. Then follow the sprint sequence in order. Do not skip sprints.


0. What You Are Building and Why

Before writing a single line of code, every developer must understand what Cencera is, what it is not, and why the architecture is designed the way it is. This section is not optional reading.

0.1 The Problem We Solve
Every time a user interacts with a wallet, DEX, or DApp on Web3, they are potentially interacting with a malicious contract, a rug pull token, or a wallet drainer. Current security tools check whether an address is on a known blacklist. That is it. If the attacker uses a fresh contract that nobody has seen before, the blacklist misses it completely.

Cencera solves this differently. Instead of just checking a blacklist, we maintain a behavioral history for every blockchain entity — wallets, contracts, tokens, protocols, NFTs — across 18 chains. We score each entity based on how its behavior compares to known-safe and known-malicious patterns. A brand new contract with zero history gets a low confidence score, not a false safe score. An entity whose behavior is gradually shifting toward known attack patterns gets flagged before the attack executes.

0.2 What We Actually Build
We build three things, in this order.

A Security Database that stores every known exploit pattern, every verified safe pattern, and the behavioral signals of every entity we have ever observed.
A Scoring Engine that runs in the background, continuously comparing entities against the database and producing trust scores.
An API that platforms call to get those scores. The API reads from a cache. It never touches the scoring engine directly.

The Most Important Concept in This Entire Document
The scoring engine NEVER runs when an API call comes in.
The scoring engine runs in the BACKGROUND, continuously, pre-computing scores before they are requested.
When MetaMask calls our API asking for the score of a token, the answer is already computed and sitting in cache.
If you build anything that makes the scoring engine run on-demand per API request, you have built it wrong.

0.3 The Three Zones — How We Classify Everything
Every entity we score ends up in one of three zones. This is the core logic that drives the entire product.

Zone	Condition	Score Returned	Action
Zone 1	High similarity to Normal Library. Low similarity to Threat Library.	High trust score (60-100)	Platform allows interaction with confidence label.
Zone 2	Significant similarity to Threat Library patterns.	Low trust score (0-40)	Platform warns user or blocks interaction.
Zone 3	Low similarity to both libraries. Behavior is unknown.	Provisional score (30-50) with LOW CONFIDENCE label	Human review queue. Never treated as safe.

0.4 Tech Stack Decisions — Why We Chose These
Technology	What We Use It For	Why Not Something Else
TypeScript	API layer, job queue workers, ingestion workers	Type safety at scale. Best ecosystem for Node.js async workloads. Your whole team can read it.
Python	ML model training, data analysis, scoring model	Best ML ecosystem. scikit-learn, PyTorch, pandas. No real competitor here.
PostgreSQL + pgvector	Security Database, entity records, vector search	Battle-tested. pgvector handles vector similarity search inside Postgres. One DB system to learn.
TimescaleDB	Hot layer — time-series signal data	TimescaleDB is a Postgres extension. Same connection, same queries, optimized for time-series writes.
Redis	L2 cache, job queue (Bull), session data	Sub-millisecond reads. Bull queue is built on Redis. One tool for two jobs.
AWS SQS	Job queue for fresh scoring requests	Managed, never loses a message, scales automatically. No ops overhead at launch.
Cloudflare Workers	L1 edge cache, API gateway, DDoS protection	300+ edge locations globally. Free tier generous. Sub-5ms response from anywhere on Earth.
Apache Kafka	Immutable event log, signal streaming	Append-only, replay-capable, handles 1M+ events/sec. Your audit trail and retraining data source.
Docker + Kubernetes	Container orchestration, auto-scaling workers	Standard. Every cloud supports it. Horizontal scaling is just changing a number.


1. Repository Structure and Project Setup

Set up the monorepo first. Everything lives in one repository. Each service is a separate package. This makes it easy to share types and utilities across services without publishing npm packages.

1.1 Monorepo Structure
cencera/
  packages/
    api-gateway/          # TypeScript — Cloudflare Worker
    scoring-engine/       # TypeScript — background job workers
    ingestion-pipeline/   # TypeScript — on-chain + off-chain workers
    security-db/          # TypeScript — database models and migrations
    ml-pipeline/          # Python — model training and inference
    shared/               # TypeScript — shared types, utils, constants
  infrastructure/
    docker/               # Dockerfiles for each service
    kubernetes/           # K8s manifests for deployment
    terraform/            # AWS infrastructure as code
  scripts/
    db-migrate.sh         # Run database migrations
    seed-threat-db.sh     # Seed initial threat library
    load-test.sh          # Run load tests before any production deploy
  docker-compose.yml      # Local development environment
  package.json            # Workspace root

1.2 Local Development Environment
Every developer runs the same local environment using Docker Compose. No 'works on my machine' issues.

# docker-compose.yml
version: '3.9'
services:
  postgres:
    image: timescale/timescaledb-ha:pg16
    environment:
      POSTGRES_DB: cencera_dev
      POSTGRES_USER: cencera
      POSTGRES_PASSWORD: dev_password_change_in_prod
    ports: ['5432:5432']
    volumes: ['postgres_data:/var/lib/postgresql/data']

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports: ['9092:9092']
    depends_on: [zookeeper]

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

volumes:
  postgres_data:

# Start local environment
docker-compose up -d

# Run database migrations
npm run db:migrate

# Verify everything is running
docker-compose ps


2. Sprint 1 — Security Database Schema

Build this first. Everything else depends on it. If the schema is wrong, everything built on top of it is wrong. Do not start Sprint 2 until the schema is finalized and migrations are running.

S1	Sprint 1 — Security Database
Weeks 1 to 2. Owner: Taku. Deliverable: All tables created, migrations running, seed data loaded.

2.1 Enable Extensions
-- Run this first before any table creation
CREATE EXTENSION IF NOT EXISTS 'uuid-ossp';   -- UUID generation
CREATE EXTENSION IF NOT EXISTS 'pgvector';    -- Vector similarity search
CREATE EXTENSION IF NOT EXISTS 'timescaledb'; -- Time-series optimization

2.2 Entity Table
Every wallet, contract, token, NFT, and protocol we have ever observed gets one row in this table.
CREATE TABLE entities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address         VARCHAR(66) NOT NULL,
  chain_id        INTEGER NOT NULL,
  entity_type     VARCHAR(20) NOT NULL CHECK (entity_type IN ('eoa','contract','token','nft','protocol')),
  lifecycle_state VARCHAR(20) NOT NULL DEFAULT 'nascent' CHECK (lifecycle_state IN ('nascent','active','flagged','archived')),
  first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_scored_at  TIMESTAMPTZ,
  score_cache     JSONB,           -- Latest full score object stored here
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (address, chain_id)
);

-- Index for fast lookups by address + chain
CREATE INDEX idx_entities_address_chain ON entities (address, chain_id);
CREATE INDEX idx_entities_lifecycle ON entities (lifecycle_state);
CREATE INDEX idx_entities_last_scored ON entities (last_scored_at);

2.3 Threat Library Table
Every confirmed exploit and malicious pattern. This is the most sensitive table. Write access requires multi-party authorization. The API layer has zero write access to this table.
CREATE TABLE threat_library (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bytecode_hash        VARCHAR(66),
  bytecode_vector      vector(1536),    -- pgvector embedding for fuzzy match
  function_selectors   JSONB,           -- [{ selector: '0x12345678', risk: 'high', name: 'drain' }]
  exploit_category     VARCHAR(30) NOT NULL CHECK (exploit_category IN (
    'rug_pull','drainer','honeypot','flash_loan','reentrancy','governance','phishing','other'
  )),
  behavioral_sequence  JSONB,           -- tx sequence in 7 days before exploit
  affected_entity_types VARCHAR(20)[],
  affected_chains      INTEGER[],
  first_observed_at    TIMESTAMPTZ NOT NULL,
  confirmed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_by         UUID NOT NULL,   -- analyst user id — required
  confidence_score     FLOAT NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  false_positive_count INTEGER NOT NULL DEFAULT 0,
  source               VARCHAR(30) NOT NULL CHECK (source IN (
    'analyst_confirmed','external_feed','community_report','ai_flagged'
  )),
  related_threat_ids   UUID[],
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vector similarity index for fuzzy bytecode matching
CREATE INDEX idx_threat_vector ON threat_library USING ivfflat (bytecode_vector vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_threat_category ON threat_library (exploit_category);
CREATE INDEX idx_threat_chains ON threat_library USING GIN (affected_chains);

2.4 Normal Activity Library Table
CREATE TABLE normal_activity_library (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id        UUID REFERENCES entities(id),
  bytecode_hash    VARCHAR(66),
  bytecode_vector  vector(1536),
  activity_type    VARCHAR(30) NOT NULL,  -- 'defi_protocol','bridge','nft_marketplace' etc
  behavioral_fingerprint JSONB,
  verified_by      VARCHAR(30) NOT NULL CHECK (verified_by IN (
    'audit_report','analyst_confirmed','protocol_verified','longevity'
  )),
  confidence_score FLOAT NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_normal_vector ON normal_activity_library USING ivfflat (bytecode_vector vector_cosine_ops)
  WITH (lists = 100);

2.5 Hot Layer — Signals Table (TimescaleDB)
This is where every signal for every entity lives. TimescaleDB automatically partitions this by time, making queries fast even with billions of rows.
CREATE TABLE entity_signals (
  time             TIMESTAMPTZ NOT NULL,
  entity_id        UUID NOT NULL REFERENCES entities(id),
  signal_domain    VARCHAR(20) NOT NULL CHECK (signal_domain IN (
    'onchain','market','offchain','ai_derived','external_feed'
  )),
  signal_type      VARCHAR(50) NOT NULL,  -- 'tx_frequency','approval_grant','liquidity_change' etc
  signal_value     FLOAT,
  signal_data      JSONB,                 -- full signal payload
  confidence       FLOAT DEFAULT 1.0,
  source           VARCHAR(100)           -- which provider/feed this came from
);

-- Convert to TimescaleDB hypertable — CRITICAL for performance
SELECT create_hypertable('entity_signals', 'time');

-- Partition by 1 week chunks
SELECT set_chunk_time_interval('entity_signals', INTERVAL '1 week');

-- Indexes for fast signal queries
CREATE INDEX idx_signals_entity_time ON entity_signals (entity_id, time DESC);
CREATE INDEX idx_signals_domain_time ON entity_signals (signal_domain, time DESC);

-- Auto-compression for data older than 90 days
ALTER TABLE entity_signals SET (timescaledb.compress, timescaledb.compress_segmentby = 'entity_id');
SELECT add_compression_policy('entity_signals', INTERVAL '90 days');

2.6 Scores Table
CREATE TABLE entity_scores (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id         UUID NOT NULL REFERENCES entities(id),
  composite_score   FLOAT NOT NULL CHECK (composite_score BETWEEN 0 AND 100),
  confidence_level  VARCHAR(10) NOT NULL CHECK (confidence_level IN ('low','medium','high')),
  zone              INTEGER NOT NULL CHECK (zone IN (1, 2, 3)),
  score_manifest    JSONB NOT NULL,  -- which signal groups were active and their weights
  contribution      JSONB NOT NULL,  -- per-domain contribution breakdown
  triggered_indicators JSONB,        -- category-level risk indicators
  model_version     VARCHAR(20) NOT NULL,
  computed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lookback_days     INTEGER NOT NULL DEFAULT 30
);

-- Convert to hypertable for time-series queries on score history
SELECT create_hypertable('entity_scores', 'computed_at');
CREATE INDEX idx_scores_entity_time ON entity_scores (entity_id, computed_at DESC);

2.7 Human Review Queue Table
CREATE TABLE review_queue (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id       UUID NOT NULL REFERENCES entities(id),
  priority        VARCHAR(10) NOT NULL CHECK (priority IN ('critical','standard','low')),
  reason          VARCHAR(50) NOT NULL,  -- 'zone3_unknown','novel_behavior','user_report'
  trigger_data    JSONB,
  assigned_to     UUID,                 -- analyst user id
  status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','in_review','resolved_threat','resolved_safe','escalated'
  )),
  resolution      JSONB,
  sla_deadline    TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_review_status_priority ON review_queue (status, priority, sla_deadline);


3. Sprint 2 — Signal Ingestion Pipeline

S2	Sprint 2 — Signal Ingestion
Weeks 2 to 4. Owner: Alexis. Deliverable: On-chain signals flowing into entity_signals table for all 18 chains.

3.1 How the Ingestion Pipeline Works
Each blockchain has one dedicated ingestion worker. The worker watches for new blocks, decodes transaction data, extracts signals, and writes them to the entity_signals table via Kafka. Workers are stateless — you can run 10 workers for one chain and they will not duplicate work because they use a distributed lock on block numbers.

3.2 On-Chain Worker — TypeScript
// packages/ingestion-pipeline/src/workers/OnChainWorker.ts
import { ethers } from 'ethers';
import { KafkaProducer } from '../kafka/producer';
import { SignalSchema } from '@cencera/shared/types';

export class OnChainWorker {
  private provider: ethers.JsonRpcProvider;
  private backupProvider: ethers.JsonRpcProvider;
  private producer: KafkaProducer;
  private chainId: number;

  constructor(chainId: number) {
    this.chainId = chainId;
    // Primary: Alchemy. Backup: QuickNode. Auto-failover on error.
    this.provider = new ethers.JsonRpcProvider(process.env[`ALCHEMY_RPC_${chainId}`]);
    this.backupProvider = new ethers.JsonRpcProvider(process.env[`QUICKNODE_RPC_${chainId}`]);
    this.producer = new KafkaProducer('raw-signals');
  }

  async start() {
    console.log(`Starting on-chain worker for chain ${this.chainId}`);
    this.provider.on('block', async (blockNumber) => {
      await this.processBlock(blockNumber);
    });
  }

  private async processBlock(blockNumber: number) {
    try {
      const block = await this.provider.getBlock(blockNumber, true);
      if (!block || !block.transactions) return;

      for (const tx of block.transactions) {
        const signals = await this.extractSignals(tx as ethers.TransactionResponse);
        for (const signal of signals) {
          await this.producer.send(signal);
        }
      }
    } catch (err) {
      // Failover to backup provider
      console.error(`Primary RPC failed for block ${blockNumber}, trying backup`);
      await this.processBlockWithBackup(blockNumber);
    }
  }

  private async extractSignals(tx: ethers.TransactionResponse): Promise<SignalSchema[]> {
    const signals: SignalSchema[] = [];

    // Signal 1: Transaction frequency and value
    signals.push({
      time: new Date().toISOString(),
      address: tx.from,
      chain_id: this.chainId,
      signal_domain: 'onchain',
      signal_type: 'tx_value',
      signal_value: parseFloat(ethers.formatEther(tx.value)),
      signal_data: { hash: tx.hash, to: tx.to, gas_used: tx.gasLimit.toString() },
      source: `alchemy_chain_${this.chainId}`
    });

    // Signal 2: Contract interaction
    if (tx.to && tx.data && tx.data !== '0x') {
      signals.push({
        time: new Date().toISOString(),
        address: tx.to,
        chain_id: this.chainId,
        signal_domain: 'onchain',
        signal_type: 'contract_interaction',
        signal_value: 1,
        signal_data: { from: tx.from, selector: tx.data.slice(0, 10) },
        source: `alchemy_chain_${this.chainId}`
      });
    }

    return signals;
  }
}

3.3 Kafka Signal Writer
All signals go through Kafka before hitting the database. This means you can replay signals for model retraining, and you never lose data even if the database is temporarily down.
// packages/ingestion-pipeline/src/kafka/consumer.ts
// This consumer reads from Kafka and writes to PostgreSQL
import { Kafka } from 'kafkajs';
import { db } from '../db/connection';

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER!] });
const consumer = kafka.consumer({ groupId: 'signal-writer' });

export async function startSignalWriter() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'raw-signals', fromBeginning: false });

  await consumer.run({
    eachBatch: async ({ batch }) => {
      const signals = batch.messages.map(m => JSON.parse(m.value!.toString()));

      // Batch insert for performance — never insert one by one
      await db.query(`
        INSERT INTO entity_signals (time, entity_id, signal_domain, signal_type, signal_value, signal_data, source)
        SELECT s.time, e.id, s.signal_domain, s.signal_type, s.signal_value, s.signal_data, s.source
        FROM jsonb_to_recordset($1::jsonb) AS s(
          time timestamptz, address text, chain_id int,
          signal_domain text, signal_type text, signal_value float,
          signal_data jsonb, source text
        )
        JOIN entities e ON e.address = s.address AND e.chain_id = s.chain_id
        ON CONFLICT DO NOTHING
      `, [JSON.stringify(signals)]);
    }
  });
}


4. Sprint 3 — Scoring Engine v1

S3	Sprint 3 — Scoring Engine v1
Weeks 3 to 5. Owner: Taku. Deliverable: Rule-based scoring running as background job, writing scores to entity_scores table.

4.1 The Job Queue
Every scoring request goes into a Bull queue backed by Redis. Workers pull from the queue. This is what allows auto-scaling — more workers means faster queue processing.
// packages/scoring-engine/src/queue/scoringQueue.ts
import Bull from 'bull';

export const scoringQueue = new Bull('entity-scoring', {
  redis: { host: process.env.REDIS_HOST, port: 6379 },
  defaultJobOptions: {
    attempts: 3,              // Retry failed jobs 3 times
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,    // Keep last 100 completed jobs for debugging
    removeOnFail: 500,        // Keep failed jobs for investigation
  }
});

// Job types
export interface ScoringJobData {
  entityId: string;
  address: string;
  chainId: number;
  entityType: string;
  priority: 'critical' | 'standard' | 'background';
  triggeredBy: 'api_request' | 'pre_warm' | 'cache_expired' | 'threat_update';
}

// Add a scoring job — called by pre-warmer and cache miss handler
export async function queueEntityScore(data: ScoringJobData) {
  const priority = data.priority === 'critical' ? 1 : data.priority === 'standard' ? 5 : 10;
  return scoringQueue.add(data, { priority });
}

4.2 The Scoring Worker
// packages/scoring-engine/src/workers/ScoringWorker.ts
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
      const zone = ZoneClassifier.classify(patternResult, signals);

      // Step 3: Build score object
      const score = buildScoreObject(patternResult, signals, zone, data);

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

4.3 Pattern Matcher
The pattern matcher runs two vector similarity searches simultaneously — one against the Threat Library, one against the Normal Activity Library. This is the core of Zone classification.
// packages/scoring-engine/src/workers/PatternMatcher.ts
import { db } from '../db/connection';
import { generateBytecodeEmbedding } from '../ml/embeddings';

export class PatternMatcher {
  static async match(entityId: string, address: string, chainId: number) {
    // Get bytecode for contracts
    const bytecode = await getBytecode(address, chainId);
    if (!bytecode) {
      return { threatSimilarity: 0, normalSimilarity: 0, topThreatMatches: [], hasHistory: false };
    }

    // Generate embedding vector for this bytecode
    const embedding = await generateBytecodeEmbedding(bytecode);
    const embeddingStr = `[${embedding.join(',')}]`;

    // Run BOTH searches in parallel using Promise.all
    const [threatMatches, normalMatches] = await Promise.all([
      db.query(`
        SELECT id, exploit_category, confidence_score,
               1 - (bytecode_vector <=> $1::vector) AS similarity
        FROM threat_library
        WHERE 1 - (bytecode_vector <=> $1::vector) > 0.15
        ORDER BY bytecode_vector <=> $1::vector
        LIMIT 5
      `, [embeddingStr]),
      db.query(`
        SELECT id, activity_type, confidence_score,
               1 - (bytecode_vector <=> $1::vector) AS similarity
        FROM normal_activity_library
        WHERE 1 - (bytecode_vector <=> $1::vector) > 0.20
        ORDER BY bytecode_vector <=> $1::vector
        LIMIT 5
      `, [embeddingStr]),
    ]);

    const topThreatSimilarity = threatMatches.rows[0]?.similarity || 0;
    const topNormalSimilarity = normalMatches.rows[0]?.similarity || 0;

    return {
      threatSimilarity: topThreatSimilarity,
      normalSimilarity: topNormalSimilarity,
      topThreatMatches: threatMatches.rows,
      topNormalMatches: normalMatches.rows,
    };
  }
}

4.4 Zone Classifier
// packages/scoring-engine/src/workers/ZoneClassifier.ts
export class ZoneClassifier {
  static classify(pattern: PatternResult, signals: AggregatedSignals): ZoneResult {

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
    // Always returns low confidence and triggers human review
    return {
      zone: 3,
      compositeScore: 35,  // Provisional cautious score
      confidence: 'low',
      requiresReview: true,
    };
  }
}

4.5 Score Writer + Cache Population
// packages/scoring-engine/src/workers/ScoreWriter.ts
import { db } from '../db/connection';
import { redis } from '../cache/redisClient';
import { reviewQueue } from '../queue/reviewQueue';

export class ScoreWriter {
  static async write(entityId: string, score: ScoreObject) {
    // Write to PostgreSQL scores table
    await db.query(`
      INSERT INTO entity_scores
        (entity_id, composite_score, confidence_level, zone, score_manifest, contribution, triggered_indicators, model_version)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [entityId, score.compositeScore, score.confidence, score.zone,
        JSON.stringify(score.manifest), JSON.stringify(score.contribution),
        JSON.stringify(score.triggeredIndicators), score.modelVersion]);

    // Update entity cache column for instant reads
    await db.query(`
      UPDATE entities SET score_cache = $1, last_scored_at = NOW() WHERE id = $2
    `, [JSON.stringify(score), entityId]);

    // Populate L2 Redis cache — TTL depends on entity activity level
    const ttl = score.zone === 3 ? 300 : score.confidence === 'high' ? 1800 : 900;
    await redis.setex(`score:${entityId}`, ttl, JSON.stringify(score));

    // Zone 3: Queue for human review
    if (score.zone === 3) {
      await reviewQueue.add({
        entityId,
        priority: score.tvlAdjacency > 1000000 ? 'critical' : 'standard',
        reason: 'zone3_unknown',
        slaDeadline: new Date(Date.now() + (score.tvlAdjacency > 1000000 ? 4 : 24) * 60 * 60 * 1000),
      });
    }
  }
}


5. Sprints 4 and 5 — Cache Layer and API Gateway

S4+S5	Sprints 4 and 5 — Cache + API
Weeks 4 to 7. Owner: Both. Deliverable: API live, DeshiChain integration possible.

5.1 Redis Cache Layer
// packages/api-gateway/src/cache/cacheManager.ts
import { redis } from './redisClient';

export class CacheManager {
  // L2 Redis cache lookup
  static async getScore(entityId: string): Promise<ScoreObject | null> {
    const cached = await redis.get(`score:${entityId}`);
    if (cached) {
      const score = JSON.parse(cached);
      // Always include staleness age so platforms know how fresh this is
      score.cacheAge = Math.floor((Date.now() - new Date(score.computedAt).getTime()) / 1000);
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
      // Repopulate Redis so next call is a cache hit
      await redis.setex(`score:${entityId}`, 900, JSON.stringify(result.rows[0].score_cache));
      return result.rows[0].score_cache;
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

5.2 Core API Endpoint — Entity Trust Query
This is the most called endpoint. It must return in under 80ms for cached entities. The flow is: check Redis, check DB cache, queue fresh score if missing. Never block the response on computation.
// packages/api-gateway/src/routes/trustQuery.ts
import { Request, Response } from 'express';
import { CacheManager } from '../cache/cacheManager';
import { EntityResolver } from '../services/EntityResolver';
import { queueEntityScore } from '../queue/scoringQueue';
import { verifyApiKey, checkRateLimit } from '../middleware/auth';

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
      entityId: entity.id, address, chainId: parseInt(chainId),
      entityType: entity.entity_type,
      priority: 'standard', triggeredBy: 'api_request'
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
  const ageMinutes = score.cacheAge / 60;
  if (ageMinutes > 5) {
    queueEntityScore({ ...entity, priority: 'background', triggeredBy: 'cache_expired' });
  }

  const responseTime = Date.now() - startTime;
  res.setHeader('X-Response-Time', `${responseTime}ms`);
  res.setHeader('X-Cache-Hit', score.cacheAge < 60 ? 'true' : 'stale');

  return res.json(score);
}

5.3 API Response Format
Every API response has the same structure. Platforms must not need to make additional calls to interpret a response. Everything they need is in one payload.
// Standard score response format
{
  "compositeScore": 73,
  "confidenceLevel": "high",
  "zone": 1,
  "lifecycleState": "active",
  "entity": {
    "address": "0xabc...123",
    "chainId": 1,
    "entityType": "contract"
  },
  "contribution": {
    "onchain": 42,
    "market": 18,
    "offchain": 9,
    "aiDerived": 4
  },
  "triggeredIndicators": [
    { "category": "deployment", "risk": "low", "detail": "Contract deployed 47 days ago" },
    { "category": "liquidity",  "risk": "low", "detail": "Stable liquidity depth" }
  ],
  "scoreTrajectory": [71, 72, 71, 73, 73],
  "scoreManifest": {
    "signalGroupsActive": ["onchain","market","offchain","ai_derived"],
    "lookbackDays": 30,
    "modelVersion": "v1.2.0"
  },
  "computedAt": "2025-03-19T10:30:00Z",
  "cacheAge": 42,
  "meta": {
    "disclaimer": "Score is probabilistic, not absolute. Consuming platform is responsible for enforcement."
  }
}

5.4 Authentication and Rate Limiting
// packages/api-gateway/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { redis } from '../cache/redisClient';

export async function verifyApiKey(req: Request, res: Response, next: Function) {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) return res.status(401).json({ error: 'API key required' });

  const keyData = await redis.get(`apikey:${apiKey}`);
  if (!keyData) return res.status(401).json({ error: 'Invalid API key' });

  const key = JSON.parse(keyData);
  req.platformId = key.platformId;
  req.tier = key.tier;  // 'free' | 'standard' | 'enterprise'
  next();
}

export async function checkRateLimit(req: Request, res: Response, next: Function) {
  const limits = { free: 100, standard: 10000, enterprise: 999999 };
  const windowKey = `ratelimit:${req.platformId}:${Math.floor(Date.now() / 60000)}`;

  const current = await redis.incr(windowKey);
  if (current === 1) await redis.expire(windowKey, 60);

  const limit = limits[req.tier as keyof typeof limits];
  if (current > limit) {
    return res.status(429).json({ error: 'Rate limit exceeded', resetIn: '60 seconds' });
  }

  res.setHeader('X-RateLimit-Remaining', limit - current);
  next();
}


6. Sprint 6 — Pre-Warmer and Auto-Scaling

S6	Sprint 6 — Pre-Warmer + Auto-Scaling
Weeks 6 to 8. Owner: Taku. Deliverable: 90%+ cache hit rate. Worker pool scales with queue depth.

6.1 The Pre-Warmer Service
The pre-warmer runs every 30 minutes and queues scoring jobs for every entity that any integrated platform might query. This is what achieves 90%+ cache hit rate.
// packages/scoring-engine/src/services/PreWarmer.ts
import { queueEntityScore } from '../queue/scoringQueue';
import { db } from '../db/connection';

export class PreWarmer {
  static async run() {
    console.log('Pre-warmer starting...');

    // Batch 1: Entities queried in last 7 days — highest priority
    const recentlyQueried = await db.query(`
      SELECT id, address, chain_id, entity_type
      FROM entities
      WHERE last_seen_at > NOW() - INTERVAL '7 days'
        AND (last_scored_at IS NULL OR last_scored_at < NOW() - INTERVAL '4 hours')
      ORDER BY last_seen_at DESC
      LIMIT 50000
    `);

    // Batch 2: High-TVL entities — must be fresh every 30 minutes
    const highTvl = await db.query(`
      SELECT id, address, chain_id, entity_type
      FROM entities
      WHERE (metadata->>'tvl')::float > 1000000
        AND (last_scored_at IS NULL OR last_scored_at < NOW() - INTERVAL '30 minutes')
    `);

    // Batch 3: Flagged entities — always keep fresh
    const flagged = await db.query(`
      SELECT id, address, chain_id, entity_type
      FROM entities WHERE lifecycle_state = 'flagged'
    `);

    const all = [...recentlyQueried.rows, ...highTvl.rows, ...flagged.rows];
    console.log(`Pre-warming ${all.length} entities`);

    // Queue in batches to avoid queue flood
    for (const entity of all) {
      await queueEntityScore({
        entityId: entity.id,
        address: entity.address,
        chainId: entity.chain_id,
        entityType: entity.entity_type,
        priority: 'background',
        triggeredBy: 'pre_warm'
      });
    }
  }
}

// Run every 30 minutes via cron
setInterval(() => PreWarmer.run(), 30 * 60 * 1000);

6.2 Kubernetes Auto-Scaling Config
This HorizontalPodAutoscaler tells Kubernetes to add more scoring workers when the queue gets deep. Your team never manually scales workers.
# infrastructure/kubernetes/scoring-worker-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: scoring-worker-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: scoring-worker
  minReplicas: 3      # Always at least 3 workers running
  maxReplicas: 150    # Scale up to 150 under extreme load
  metrics:
  - type: External
    external:
      metric:
        name: redis_queue_depth
        selector:
          matchLabels:
            queue: entity-scoring
      target:
        type: AverageValue
        averageValue: '50'  # Scale when queue depth exceeds 50 jobs per worker
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30   # React fast to spikes
      policies:
      - type: Percent
        value: 100                       # Double workers every 30 seconds
        periodSeconds: 30
    scaleDown:
      stabilizationWindowSeconds: 300  # Scale down slowly to avoid thrashing


7. Sprint 8 — Base Model Training (Python)

S8	Sprint 8 — Base Model
Weeks 10 to 14. Owner: Taku (ML lead). Deliverable: Trained model serving predictions, replacing rule-based scorer.

Do not start this sprint until Sprint 2 has been running for at least 8 weeks. The model trains on real signal data. If you train on less than 8 weeks of data, the model will not have seen enough behavioral patterns to be accurate.

7.1 Feature Engineering
# packages/ml-pipeline/src/features/feature_extractor.py
import pandas as pd
import numpy as np
from sqlalchemy import create_engine

def extract_entity_features(entity_id: str, lookback_days: int = 30) -> dict:
    engine = create_engine(os.environ['DATABASE_URL'])

    # Pull signals from TimescaleDB for this entity
    query = '''
        SELECT signal_domain, signal_type, signal_value, signal_data, time
        FROM entity_signals
        WHERE entity_id = %(entity_id)s
          AND time > NOW() - INTERVAL %(lookback)s
        ORDER BY time DESC
    '''
    signals = pd.read_sql(query, engine, params={
        'entity_id': entity_id,
        'lookback': f'{lookback_days} days'
    })

    features = {}

    # On-chain features
    onchain = signals[signals['signal_domain'] == 'onchain']
    features['tx_count_30d'] = len(onchain[onchain['signal_type'] == 'tx_value'])
    features['avg_tx_value'] = onchain[onchain['signal_type'] == 'tx_value']['signal_value'].mean() or 0
    features['tx_value_std'] = onchain[onchain['signal_type'] == 'tx_value']['signal_value'].std() or 0
    features['unique_counterparties'] = onchain['signal_data'].apply(
        lambda x: x.get('to') if isinstance(x, dict) else None
    ).nunique()
    features['has_exploit_adjacency'] = int(any(
        onchain['signal_type'] == 'exploit_adjacency'
    ))

    # Market features
    market = signals[signals['signal_domain'] == 'market']
    features['liquidity_volatility'] = market[market['signal_type'] == 'liquidity_change']['signal_value'].std() or 0
    features['price_impact_anomalies'] = len(market[
        (market['signal_type'] == 'price_impact') & (market['signal_value'] > 0.1)
    ])

    # Behavioral anomaly
    features['days_since_first_seen'] = (pd.Timestamp.now() - signals['time'].min()).days if len(signals) > 0 else 0
    features['activity_recency_score'] = min(len(onchain) / 100, 1.0)  # Normalized 0-1

    return features

7.2 Model Training
# packages/ml-pipeline/src/training/train_base_model.py
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
import joblib
import mlflow

def train_model(training_data_path: str):
    df = pd.read_parquet(training_data_path)

    feature_cols = [c for c in df.columns if c not in ['entity_id','label','zone']]
    X = df[feature_cols].fillna(0)
    y = df['zone']  # 1, 2, or 3

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    with mlflow.start_run():
        model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
        )
        model.fit(X_train, y_train)

        # Evaluate — DO NOT deploy if f1_score < 0.80 on Zone 2 (threat detection)
        y_pred = model.predict(X_test)
        report = classification_report(y_test, y_pred, target_names=['Zone1','Zone2','Zone3'])
        zone2_f1 = f1_score(y_test, y_pred, labels=[2], average='macro')

        print(report)
        mlflow.log_metric('zone2_f1', zone2_f1)

        if zone2_f1 < 0.80:
            raise ValueError(f'Zone 2 F1 score {zone2_f1:.2f} below threshold 0.80. Do not deploy.')

        # Save model with version tag
        model_path = f'models/base_model_v{get_next_version()}.pkl'
        joblib.dump(model, model_path)
        mlflow.log_artifact(model_path)
        print(f'Model saved to {model_path}')

        return model


8. Environment Variables and Deployment

8.1 Required Environment Variables
# .env.example — copy to .env and fill in values
# Database
DATABASE_URL=postgresql://cencera:password@localhost:5432/cencera_dev
DATABASE_POOL_SIZE=20

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKER=localhost:9092

# RPC Providers — one per chain
ALCHEMY_RPC_1=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY     # Ethereum
ALCHEMY_RPC_56=https://bnb-mainnet.g.alchemy.com/v2/YOUR_KEY    # BNB Chain
ALCHEMY_RPC_137=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_RPC_42161=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY # Arbitrum
ALCHEMY_RPC_8453=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY # Base
QUICKNODE_RPC_56=https://your-bnb-endpoint.quiknode.pro/YOUR_KEY # BNB backup

# External threat feeds
SCAMSNIFFER_API_KEY=your_key
CHAINABUSE_API_KEY=your_key
CERTIK_API_KEY=your_key

# API
API_PORT=3000
JWT_SECRET=change_this_to_random_256_bit_string_in_production

# ML
MODEL_PATH=models/base_model_v1.pkl
MODEL_VERSION=v1.0.0

# AWS
AWS_REGION=us-east-1
AWS_SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/...

8.2 AWS Startup Grant — How to Apply
Apply for AWS Activate Founders tier at activate.aws.amazon.com. Gives up to $1,000 in free credits immediately.
Apply for AWS Activate Portfolio tier through your investors or accelerator. Gives up to $100,000 in credits.
Use credits for: RDS PostgreSQL (TimescaleDB), ElastiCache Redis, EKS Kubernetes, SQS, S3 for cold storage.
Google Cloud equivalent: cloud.google.com/startup gives up to $200,000. Apply to both and use whichever gives more.

8.3 Load Testing — Mandatory Before Every Production Deploy
Never deploy to production without running a load test. This is not optional. Use k6 for load testing.
# scripts/load-test.sh
# Install k6: brew install k6

k6 run --vus 100 --duration 60s - <<EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const res = http.get('http://localhost:3000/v1/trust/0xabc123/chain/1', {
    headers: { 'x-api-key': 'test_key' }
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 80ms for cached': (r) => r.timings.duration < 80,
  });

  sleep(0.01);
}
EOF

# Pass criteria: p95 < 80ms for cached calls, p95 < 500ms for fresh scores
# If either fails, do NOT deploy. Fix the bottleneck first.


9. Sprint Checklist — Definition of Done

A sprint is not done until every item in its checklist is checked. No exceptions. No 'we will fix it later'.

Sprint	Must Pass Before Moving On
S1	All tables created. Migrations run clean. pgvector queries return results. TimescaleDB hypertable confirmed. Seed threat data loaded.
S2	On-chain signals flowing into entity_signals for at least 3 chains. Kafka consumer writing batches. No duplicate signals. Worker restarts without data loss.
S3	Scoring worker processes 100 jobs per minute minimum. Zone 1/2/3 classification tested against known examples. Score written to DB and Redis.
S4	Redis cache returns scores in under 5ms. Cache miss correctly falls back to DB. Cache invalidation tested and confirmed.
S5	API returns cached score in under 80ms at p95. Load test at 200 RPS passes. DeshiChain can make a real API call and get a real score.
S6	Pre-warmer runs on schedule. Cache hit rate above 85% after 48 hours of operation. Worker auto-scaling tested: spike to 1,000 queue depth and confirm workers scale up.
S7	Market signals and off-chain signals flowing. Score accuracy visibly improves on known-safe and known-threat test entities.
S8	Model trained. Zone 2 F1 score above 0.80. Model deployed. Load test confirms no latency regression from rule-based version.
S9	Cloudflare Workers deployed. Edge cache returning scores from nearest region. Multi-region DB replication confirmed with zero data loss.
S10	Human review queue operational. Zone 3 entities routing correctly. SLA alerts firing. Test review completes and updates score.
S11	Enterprise tier API keys working. Batch screening endpoint tested at 500 entities. Webhook fires on score delta. First paid customer invoice generated.

CENCERA — Developer Reference v1.0 — Confidential — Not for external distribution
founders@cencera.xyz | www.cencera.xyz | app.cencera.xyz