
CENCERA
Production-Grade Scalable Architecture
Designed for 10M+ API Calls Per Day From Day One
Engineer Reference Document — Confidential
Target Latency	Peak Throughput	Availability	Scale Model
< 80ms cached	10,000+ RPS	99.99% uptime	Horizontal — infinite



This document defines the complete production architecture for Cencera. Every component is designed to handle mass adoption from day one — including simultaneous integration by MetaMask, TrustWallet, Uniswap, Aave, and PancakeSwap. Engineers build to this specification from the first commit. Nothing needs to be replaced when volume grows. It only needs to be scaled.


1. Traffic Reality — What We Are Actually Building For

These are real production numbers for target platforms. Every architecture decision is made against these numbers.

Platform	Daily Txns	Avg RPS	Peak RPS	Architecture Implication
MetaMask	~2M	23	400+	Multi-region mandatory. CDN edge scoring required.
Phantom	~2.3M	27	500+	Solana + EVM. Highest single-platform peak load.
TrustWallet	~1M	12	200+	Mobile-first. Sub-80ms or UX breaks.
Uniswap	~69K	1	20	Token-heavy. 90%+ cache hit rate expected.
Aave	~30K	<1	10	High-value entities. Enterprise SLA required.
PancakeSwap	~300K	4	60	BNB Chain heavy. New token volume is high.
PumpFun	~500K tokens/day	6	200+	Every call fresh score. Hardest scaling case.
ALL COMBINED	~6M+	75	1,500+	Design target: sustain 1,500 RPS peak.

The Design Target
Sustain 1,500 requests per second at peak without degradation.
Serve 95th percentile cached response under 80ms from any region on Earth.
Serve 95th percentile fresh score under 500ms.
Zero single points of failure. Any component can die without taking down the system.


2. The One Rule That Makes Everything Work

THE GOLDEN RULE
Never compute what you can cache. Never cache what you can pre-warm.
90%+ of production calls must return a pre-computed cached score under 80ms. The scoring engine only runs in the background — never on request.

The scoring engine runs continuously as a background job processor. When a platform calls your API, the API reads from cache. It never asks the scoring engine to compute anything on-demand. The scoring engine pre-warms the cache before any request arrives.


3. Full System Architecture — Seven Layers

The system has seven layers. Each layer has exactly one responsibility and can be scaled independently without touching any other layer.

1
LAYER	GLOBAL API GATEWAY
The only entry point. Handles routing, auth, rate limiting. Never scores.
2
LAYER	CACHE LAYER
Serves 90%+ of all requests. Never touches the scoring engine.
3
LAYER	SCORING ENGINE CLUSTER
Background only. Pre-computes scores before they are requested.
4
LAYER	SIGNAL INGESTION PIPELINE
Continuously collects data from all sources across all chains.
5
LAYER	SECURITY DATABASE
Single source of truth for all threat patterns and behavioral history.
6
LAYER	LEARNING AND REVIEW SYSTEM
Human and AI feedback loop. Updates database with new threats.
7
LAYER	INFRASTRUCTURE AND OPERATIONS
Multi-region deployment, monitoring, disaster recovery.


4. Layer 1 — Global API Gateway

Every API call enters through the Global API Gateway. This layer never computes scores. Its only jobs are routing, authentication, rate limiting, and connecting clients to the nearest regional cache.

Components — Global API Gateway
Cloudflare Workers	Cloudflare Workers	Deployed globally across 300+ edge locations. Sub-5ms routing. Terminates TLS at edge.
API Key Auth	JWT + HMAC-SHA256	Validates every request. Identifies platform tier. Enforces rate limits per key.
Rate Limiter	Cloudflare Rate Limiting	Per-API-key limits. Standard: 10K req/min. Enterprise: custom. Probing patterns auto-blocked.
Load Balancer	AWS ALB / Cloudflare LB	Routes to nearest healthy regional cluster. Health checks every 10 seconds.
DDoS Protection	Cloudflare Magic Transit	Absorbs volumetric attacks before they reach the application layer.
Request Router	Custom routing logic	Determines: cache lookup (90%+ of calls) vs fresh score queue vs batch job vs webhook.

4.1 Request Routing Decision Tree

Request Type	Decision	Outcome
Entity in hot cache under 5 min old	Return cached score	< 15ms. No computation. 90%+ of all calls.
Entity in hot cache 5 to 30 min old	Return cached + trigger background refresh	< 15ms response. Score refreshed async.
Entity not in cache	Queue fresh score job + return estimated wait	< 50ms acknowledgment. Score ready < 500ms.
Batch request up to 500 entities	Fan out to batch processor	< 2s for full 500-entity batch.
Historical reputation query	Route to warm/cold layer reader	< 5s. Non-critical path.
Invalid API key or rate limit exceeded	Reject at gateway	< 5ms. Never reaches application layer.


5. Layer 2 — The Cache Layer

The cache layer is the most important performance component in the system. It is what allows 1,500 requests per second without 1,500 concurrent scoring computations.

Cache Architecture — Three Tiers
L1 Edge Cache	Cloudflare KV (global edge)	Score objects cached at 300+ Cloudflare edge locations. First lookup for every request. Sub-5ms globally. TTL: 3 minutes for active entities.
L2 Regional Cache	Redis Cluster (per region)	Master cache per region. Holds last 24 hours of scores. L1 misses hit L2 before touching the database. TTL: 30 minutes.
L3 Hot Layer DB	TimescaleDB	Persistent hot layer. Holds 90 days of scores. Write-optimized for high-throughput score updates. Source of truth for cache population.

5.1 Pre-Warming — The Most Critical Engineering Task

Pre-warming means the background scoring pipeline scores every entity that any integrated platform might query — before they query it. The cache is never cold for active entities.

Every entity queried in the last 7 days is re-scored every 4 hours by the background pipeline
When a new platform partner integrates, their full entity set is pre-scored before their first live API call
High-TVL entities above M are re-scored every 30 minutes regardless of query frequency
New contract deployments are detected via mempool monitoring and cold-start scored within 60 seconds of deployment
Entities that appear in external threat feeds are immediately invalidated from cache and re-scored

5.2 Cache Invalidation Rules

Invalidation Trigger	Priority	Action
New exploit confirmed in Security Database	IMMEDIATE	Invalidate all similar entities across all cache tiers. Rescore within 4 hours.
Entity moves to Flagged lifecycle state	IMMEDIATE	Remove from all cache tiers. Fresh score served with Flagged label.
External threat feed match	HIGH	Invalidate L1 and L2. Rescore queued at top priority.
Contract upgrade event detected on-chain	HIGH	Immediate invalidation. Full rescore including new bytecode analysis.
Score older than 30 minutes on high-TVL entity	HIGH	Background refresh triggered. Stale score served with staleness label.
Score older than 4 hours on active entity	STANDARD	Background refresh triggered. No user impact.
Platform manually requests fresh score	STANDARD	Queue fresh score job. Return stale score with staleness age while computing.


6. Layer 3 — Scoring Engine Cluster

The scoring engine never handles live API requests. It runs as a background job cluster, continuously processing entities from the scoring queue and writing results to the hot layer. The API reads from the hot layer. They never talk to each other directly.

Scoring Engine Components
Job Queue	Redis Bull / AWS SQS	All scoring jobs enter via queue. Workers pull jobs. Queue depth triggers auto-scaling. Never loses a job even under extreme load.
Worker Pool	Node.js workers on Kubernetes	Auto-scaling pool. Min 3 workers at launch. Scales to 150 workers under load. Stateless — any worker can process any job.
Pattern Matcher	Custom + Pinecone/Weaviate	Compares entity against Threat Library and Normal Library simultaneously. Vector similarity search sub-100ms.
Signal Aggregator	Custom scoring logic	Pulls pre-aggregated signals from hot layer. Applies entity-type weight matrix. Produces composite score.
Zone Classifier	Rule engine	Classifies into Zone 1 (known safe), Zone 2 (known threat), Zone 3 (unknown). Zone 3 triggers human review queue.
Score Writer	Async DB writer	Writes completed score to hot layer and populates L2 and L1 cache. Sends webhook if score delta exceeds platform threshold.

6.1 Auto-Scaling Rules

Queue Depth	Worker Count	Scale Action	Platform Context
0 to 50 jobs	3 workers	Minimum pool — always on	Launch phase: pilot partners
50 to 200 jobs	5 to 10 workers	Scale up within 60 seconds	Mid-size DEX or wallet integration
200 to 1,000 jobs	10 to 30 workers	Scale up within 60 seconds	Multiple active integrations
1,000 to 5,000 jobs	30 to 75 workers	Scale up within 30 seconds	PumpFun-level new token spike
5,000+ jobs	75 to 150 workers	Emergency scale — all available	Phantom plus MetaMask simultaneous peak
Queue emptying	Scale down after 5 min	Gradual scale down	Cost optimization

6.2 Scoring Job Time Budget

Step	Start (ms)	End (ms)	Notes
RPC data fetch — bytecode, tx history, deployer	0	200	PARALLEL. 30 to 50 RPC calls via connection pool.
Threat Library pattern match — vector search	0	100	PARALLEL. Pinecone/Weaviate sub-100ms fuzzy match.
Normal Library pattern match — vector search	0	100	PARALLEL. Same thread as threat match.
Off-chain OSINT signals	0	150	PARALLEL. Mostly cache hits from OSINT cache layer.
Market signal fetch	0	120	PARALLEL. DEX data cached at 5-min intervals.
Behavioral anomaly scoring	200	320	Sequential — requires RPC data to complete first.
Zone classification 1 / 2 / 3	320	340	Near-instant threshold logic.
Score object construction	340	370	Assembles full structured score response.
Write to hot layer and populate cache	370	420	Async write — does not block score delivery.
TOTAL — p50 target	0	420	All parallel threads complete by ~320ms.


7. Layer 4 — Signal Ingestion Pipeline

The ingestion pipeline runs independently from everything else. It continuously collects signals and writes them to the hot layer. The scoring engine reads pre-aggregated signals — it never calls external sources directly during scoring.

Ingestion Workers — One Per Data Source
On-Chain Worker	ethers.js + Web3.py	One worker per chain. Alchemy primary, QuickNode backup. Detects transactions, contract deployments, approval events in real time.
Market Signal Worker	DEX subgraphs + oracles	Polls Uniswap, PancakeSwap, and other DEX subgraphs every 5 minutes. Writes liquidity snapshots and price data.
OSINT Worker	Puppeteer + custom scrapers	Collects project metadata, social signals, GitHub activity. Runs on 24-hour cycle per entity.
External Feed Worker	REST API consumers	Polls ScamSniffer, PhishFort, Chainabuse, CryptoScamDB, Certik, PeckShield every 60 seconds. Immediate cache invalidation on new threat.
Mempool Monitor	WebSocket subscriptions	Watches pending transactions for new contract deployments and known drainer patterns. Triggers pre-emptive scoring.
Event Stream Writer	Apache Kafka	All signals written to immutable event log before processing. Enables replay, audit, and model retraining from historical data.

7.1 RPC Provider Strategy
Primary: Alchemy Growth plan for all EVM chains. Best uptime. Archive node access. Predictable pricing.
Secondary: QuickNode for BNB Chain and Solana. Better performance on non-Ethereum chains.
Connection pooling: Maintain 50 persistent RPC connections per chain. Never open a new connection per request.
Self-hosted archival nodes: Evaluate at Month 9 if fresh score volume exceeds 5M per month. Cuts RPC cost by 80%.
Cross-validation: Signals appearing in only one provider are quarantined until confirmed by a second source.


8. Layer 5 — Security Database

The Security Database is the foundation of the entire system and your competitive moat. It is the hardest component to replicate. Every scoring decision ultimately derives from this database.

Database Architecture
Threat Library	PostgreSQL + Pinecone	Confirmed exploits and malicious contracts. Vector embeddings for fuzzy matching. Write-protected from API layer.
Normal Activity Library	PostgreSQL + Pinecone	Verified safe contracts and behavioral patterns. Used as baseline for anomaly detection.
Hot Layer	TimescaleDB	Last 90 days of signals for all active entities. Write-optimized. Must handle 10,000+ writes per second at scale.
Warm Layer	ClickHouse (columnar)	90 days to 2 years of signals. Optimized for range scans and model training exports.
Cold Layer	AWS S3 + Parquet	All signals older than 2 years. Compressed archival. Primarily for regulatory audit.
Immutable Event Log	Apache Kafka + S3	Append-only record of every signal write and score computation. Cryptographic hash chain. Cannot be modified.

8.1 Threat Library — One Record Schema
This is the exact field definition every engineer must know before building any component that reads or writes to this database.

Field	Type	Description
threat_id	UUID	Unique identifier. Referenced in score objects as triggered indicator.
bytecode_hash	SHA-256	Exact bytecode hash of the malicious contract.
bytecode_vector	float[1536]	Embedding vector for fuzzy similarity matching. Detects obfuscated variants.
function_selectors	JSONB	Array of 4-byte selectors with risk classification per function.
exploit_category	ENUM	rug_pull, drainer, honeypot, flash_loan, reentrancy, governance, other.
behavioral_sequence	JSONB	Transaction sequence in the 7 days before exploit executed. Training data.
affected_entity_types	ENUM[]	Which entity types this threat targets: EOA, contract, token, NFT, protocol.
affected_chains	VARCHAR[]	Chain IDs where this pattern has been observed.
first_observed	TIMESTAMP	When Cencera or an external feed first detected this threat.
confirmed_at	TIMESTAMP	When human analyst confirmed and added to database.
confidence_score	FLOAT 0-1	How confident is the classification. Affects weight in scoring engine.
false_positive_count	INTEGER	Number of false positives triggered. Used to decay weight over time.
source	ENUM	analyst_confirmed, external_feed, community_report, or ai_flagged.
related_threat_ids	UUID[]	Other threat records sharing behavioral patterns with this one.


9. Layer 6 — Learning and Review System

Every confirmed exploit, every human review decision, and every user report feeds back into the Security Database and improves every future score. This is what separates Cencera from static blacklists.

Learning System Components
Human Review Queue	Custom queue + dashboard	Prioritized list of Zone 3 entities requiring analyst review. SLA: 4 hours critical, 24 hours standard, 72 hours low priority.
AI Pre-Classifier	Fine-tuned classification model	Pre-classifies Zone 3 entities before human review to reduce analyst workload. Humans confirm or override.
Exploit Ingestion Pipeline	Automated parsers	Monitors DeFi incident reports and on-chain exploit events. Auto-creates draft Threat Library records for analyst review.
Retroactive Rescore Engine	Background job	When new threat confirmed, finds all similar entities and queues them for rescore. Must complete within 4 hours.
Community Report Handler	API endpoint + validator	Accepts loss reports with mandatory transaction hash. Validates on-chain. Routes to human review at elevated priority.
Model Retraining Trigger	Automated pipeline	Minor retrain every 2 weeks. Major retrain quarterly. Auto-triggered if accuracy drops below thresholds.


10. Layer 7 — Infrastructure and Operations

The infrastructure layer is what makes 99.99% uptime possible. Every component must have a defined failure behavior. Nothing can be a single point of failure.

10.1 Multi-Region Deployment
Region	Cloud Location	Primary Platforms Served	Role
Region 1 (Primary)	AWS us-east-1	MetaMask, Aave, Uniswap	Full stack. DB primary. Redis primary. Scoring cluster.
Region 2	AWS eu-west-1	European DeFi platforms	Full stack. DB replica. Redis replica. Read-write capable.
Region 3	AWS ap-southeast-1	Phantom, PancakeSwap, TrustWallet	Full stack. DB replica. Redis replica. Read-write capable.

10.2 Failure Mode Definitions
Component	Failure Behavior	Recovery Target
L1 Edge Cache (Cloudflare KV)	Fall through to L2 Regional Redis	Transparent to user. Slight latency increase to 30 to 60ms.
L2 Regional Redis	Fall through to L3 Hot Layer DB	L2 auto-repopulates on recovery. No data loss.
Hot Layer DB (one AZ fails)	Synchronous replica in second AZ takes over	Zero data loss. RTO 30 seconds. RPO 0.
Scoring Engine Worker dies	Jobs redistributed to remaining workers	Auto-scaler spins replacement within 60 seconds.
RPC Provider goes down	Failover to QuickNode backup automatically	No scoring interruption. Alert triggered immediately.
Entire Region fails	Global LB routes to nearest healthy region	Under 30 second DNS propagation. Other regions handle full load.
Human Review Queue backlog	AI pre-classifier takes over	Provisional AI scores served with pending review label.

10.3 Infrastructure Cost at Each Scale Stage
Stage	Monthly API Calls	Infra Cost Per Month	What Changes
Launch — pilot partners	< 5M	00 to 00	3 workers, single region, Alchemy RPC, Redis single node
Growth — 10 to 20 integrations	5M to 50M	,500 to ,000	Auto-scaling pool, Redis cluster, CDN edge cache live
Scale — major DEX or wallet	50M to 200M	,000 to ,000	Multi-region, 20 to 50 workers, RPC node evaluation
Top-Tier — Phantom or MetaMask	200M to 1B	2,000 to 0,000	Full multi-region, 75 to 150 workers, self-hosted nodes
Mass Adoption — all platforms	1B+	5,000 to 0,000	Revenue from one top-tier contract covers this entirely


11. Build Sequence — What Gets Built in What Order

This is the exact order in which components are built. Nothing in this sequence is optional. Building out of order creates dependencies that do not exist yet.

Sprint	Weeks	Component	Why This Order
S1	1 to 2	Security Database schema + hot layer	Everything reads from and writes to this. Must exist first.
S2	2 to 4	Signal Ingestion Pipeline — on-chain only	Start collecting real data immediately. Other layers feed from this.
S3	3 to 5	Scoring Engine v1 — rule-based, no ML yet	Can score with pattern matching before Base Model is trained.
S4	4 to 6	Redis L2 Cache + Cache Writer	Required before any external API call goes live.
S5	5 to 7	API Gateway + Core Endpoints	DeshiChain integration goes live after this sprint.
S6	6 to 8	Job Queue + Auto-Scaling Worker Pool	Must exist before any high-volume partner integration.
S7	8 to 10	Market and Off-chain signal workers	Expands scoring accuracy. Adds second and third signal domains.
S8	10 to 14	Base Model training + ML pattern matcher	Requires 8 to 10 weeks of real signal data from S2.
S9	14 to 16	Cloudflare L1 Edge Cache + multi-region	Required before approaching top-tier platform partners.
S10	16 to 18	Human Review Queue + learning feedback loop	Activates the self-improvement system. Required for enterprise SLA.
S11	18 to 20	Enterprise API tier + webhooks + batch screening	Revenue activation. Convert free integrations to paid.
S12	Ongoing	Monitoring, alerting, auto-scaling refinement	Never finished. Continuous improvement as volume grows.

The Non-Negotiable Rule for Every Sprint
The architecture must support 1,500 RPS peak from the moment the first component is deployed.
This means: job queue before workers, cache before API, schema before data, connection pools before RPC calls.
Never build a component that cannot be horizontally scaled by adding a second instance without rewriting it.
Every sprint deliverable must pass a load test at 10x its expected launch volume before merging to production.

CENCERA — Production Architecture v1.0 — Confidential — Engineer Reference Document
founders@cencera.xyz | www.cencera.xyz | app.cencera.xyz