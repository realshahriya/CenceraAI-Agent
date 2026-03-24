-- Run this first before any table creation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgvector";    -- Vector similarity search
CREATE EXTENSION IF NOT EXISTS "timescaledb"; -- Time-series optimization

-- 2.2 Entity Table
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

CREATE INDEX idx_entities_address_chain ON entities (address, chain_id);
CREATE INDEX idx_entities_lifecycle ON entities (lifecycle_state);
CREATE INDEX idx_entities_last_scored ON entities (last_scored_at);

-- 2.3 Threat Library Table
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

CREATE INDEX idx_threat_vector ON threat_library USING ivfflat (bytecode_vector vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_threat_category ON threat_library (exploit_category);
CREATE INDEX idx_threat_chains ON threat_library USING GIN (affected_chains);

-- 2.4 Normal Activity Library Table
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

-- 2.5 Hot Layer — Signals Table (TimescaleDB)
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

SELECT create_hypertable('entity_signals', 'time');
SELECT set_chunk_time_interval('entity_signals', INTERVAL '1 week');

CREATE INDEX idx_signals_entity_time ON entity_signals (entity_id, time DESC);
CREATE INDEX idx_signals_domain_time ON entity_signals (signal_domain, time DESC);

ALTER TABLE entity_signals SET (timescaledb.compress, timescaledb.compress_segmentby = 'entity_id');
SELECT add_compression_policy('entity_signals', INTERVAL '90 days');

-- 2.6 Scores Table
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

SELECT create_hypertable('entity_scores', 'computed_at');
CREATE INDEX idx_scores_entity_time ON entity_scores (entity_id, computed_at DESC);

-- 2.7 Human Review Queue Table
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
