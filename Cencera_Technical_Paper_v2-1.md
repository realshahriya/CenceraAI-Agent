
CENCERA
Technical Paper
A Computable Trust and Reputation Layer for Web3
How the System Works — From First Signal to Final Score



Version 2.0   |   cencera.xyz   |   founders@cencera.xyz
For Founders, Developers, and Integration Partners

For Founders
Read Section 1 through 4. Understand what the product does and why it is built this way. Skip the code blocks.	For Developers
Read the full document. Every section has code examples and technical detail. Section 5 onward is yours.	For Integration Partners
Read Section 1, 2, 7, and 8. Section 7 is your complete API reference.


Abstract

Web3 platforms currently have no reliable way to answer a simple question: is this wallet, contract, or token safe to interact with? Existing tools check static blacklists or scan individual transactions in isolation. They do not track behavioral history. They do not learn from new threats. They do not give platforms a standardized, machine-readable trust signal they can act on programmatically.

Cencera solves this by introducing a computable trust and reputation layer for Web3. The system continuously observes every blockchain entity across on-chain activity, market behavior, off-chain signals, and AI-derived pattern analysis. It stores this behavioral history in a Security Database of known threat patterns and normal activity patterns. A Scoring Engine compares every entity against this database and produces a trust score — a single number from 0 to 100 that represents how confidently the entity's behavior matches known-safe or known-malicious patterns.

Platforms integrate Cencera through a low-latency API. Wallet applications use it for pre-transaction warnings. DEXs use it to screen tokens and liquidity providers. Protocols use it to gate access and adjust risk parameters. The system is designed to serve 1,500 API requests per second at under 80 milliseconds response time, making it suitable for inline integration at the largest platforms in Web3.

This paper describes the complete system — how data flows from raw blockchain events through signal ingestion, behavioral analysis, pattern matching, and scoring, to a final API response. It is written for developers building the system and for integration partners consuming it.


1	The Problem
Why existing Web3 security tools are not enough

1.1 What Current Tools Do
Every major Web3 security tool today — Blockaid, Forta, Hexagate, and static blacklists — operates on the same fundamental model. They check whether an address or transaction matches a known bad pattern at the moment of the check. If the pattern is in their database, they flag it. If it is not, they pass it.

This works well for known threats. It fails entirely for anything new.

Tool Type	What It Checks	What It Misses	Core Limitation
Static Blacklist	Known malicious addresses	Any address not yet on the list	No behavioral analysis. No learning.
Transaction Screener	Current transaction against known patterns	Slow-burn exploits staged over weeks	Point-in-time only. No history.
Alert System	Anomalous on-chain events	Pre-exploit staging behavior	Reactive, not predictive.
Audit Report	Code correctness at audit time	Post-audit behavior changes	Static snapshot of one moment.

1.2 What Cencera Does Differently
Cencera does not check a transaction at the moment it happens. It maintains a continuous behavioral history for every entity it has ever observed. When a platform asks for a trust score, Cencera answers based on everything that entity has ever done — not just what it is doing right now.

The difference matters most in three real-world scenarios.

Where Cencera Catches What Others Miss
Slow-burn honeypot: A token that lets users buy freely for 30 days but blocks sells from day 31. Transaction screeners see normal activity. Cencera sees the gradual pattern shift in liquidity behavior and flags it before day 31.
Cross-chain attacker: A deployer builds a clean history on Ethereum then attacks on Base. Blacklists have no Base record. Cencera's cross-chain linkage connects the deployer identity and carries the risk context across chains.
Novel exploit variant: A new rug pull contract that is slightly different from any known pattern. Blacklists miss it entirely. Cencera's vector similarity matching detects 75 to 85% structural similarity to known exploits and flags it as suspicious.


2	System Overview
The five components and how they connect

Cencera is built from five components. Each component has one job. They connect in a specific order. Understanding this order is understanding the entire system.

1	Signal Ingestion Pipeline
Blockchain workers watch every chain in real time. When an entity does something — a transaction, a contract deployment, a token transfer — the worker extracts a signal and writes it to the event stream. This never stops running.

2	Security Database
The permanent store of everything Cencera knows. Section A holds threat patterns — the behavioral fingerprints of every confirmed exploit. Section B holds normal patterns — the behavioral fingerprints of verified safe entities. Every score is ultimately a comparison against this database.

3	Scoring Engine
A background job cluster that runs continuously. It pulls entities from a scoring queue, compares their behavioral signals against the Security Database, runs pattern matching and anomaly detection, and produces a trust score. It never runs on request — it always runs in the background.

4	Cache Layer
The pre-computed scores from the Scoring Engine are stored in a three-tier cache. When a platform calls the API, the answer comes from cache in under 15 milliseconds — not from live computation.

5	API Layer
The interface that integration partners consume. Platforms send an address and chain ID. They get back a structured score object. The API reads from cache. It never touches the Scoring Engine directly.

2.1 The Most Important Concept in This Paper
The Scoring Engine and the API Layer are completely separated. They never talk to each other directly. The Scoring Engine writes scores to the cache. The API reads scores from the cache. When a platform calls the API, the computation is already done. This is what makes sub-80 millisecond response times possible at any scale.

The Golden Rule
The Scoring Engine runs in the BACKGROUND — never on request.
The API reads from CACHE — never from live computation.
By the time MetaMask asks for a token score, that score is already computed and waiting.
Any architecture that makes the Scoring Engine run when an API call comes in is wrong.


3	Entity Model
What Cencera scores and how entities are identified

Everything Cencera scores is an entity. An entity is any identifiable actor or object on a blockchain that has a behavioral history worth tracking.

3.1 The Five Entity Types
Entity Type	What It Is	Primary Risk Signals	Example
EOA Wallet	Externally owned account. A user's wallet.	Transaction patterns, approval grants, exploit adjacency, counterparty history.	0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Smart Contract	Deployed contract code. The most high-risk entity type.	Bytecode similarity to exploits, upgrade history, admin key behavior, interaction patterns.	Uniswap v3 Pool contract
Token	ERC-20, ERC-721, or ERC-1155 asset.	Holder concentration, liquidity health, tax behavior, honeypot simulation, deployer trust.	Any ERC-20 token address
NFT Collection	A deployed NFT contract and its activity.	Wash trading, marketplace authenticity, deployer history, collection contract behavior.	Any ERC-721 collection
Protocol / DApp	Composite entity built from constituent contracts.	Weighted combination of all contract scores, TVL risk, governance structure, off-chain identity.	Aave, Uniswap, Compound

3.2 Entity Identification — The CPID
Every entity is assigned a Cencera Persistent Identifier (CPID) on first observation. This is a stable internal UUID that never changes, even if the underlying address changes due to proxy upgrades or contract migrations.

Cross-chain entities are handled with a linkage record. The same deployer address on Ethereum and on Base gets separate CPIDs by default, but a cross-chain linkage connects them. Negative signals propagate more strongly across linkages than positive signals — because the primary threat is an attacker who builds clean history on one chain and attacks on another.

3.3 Entity Lifecycle States
State	Condition	Score Type	Platform Impact
Nascent	First 72 hours or fewer than 50 meaningful interactions.	Limited Score — low confidence. Deployer inheritance only.	Platform must configure how it treats Limited Scores separately from full scores.
Active	Sufficient history for full scoring. Standard state.	Full Score — all signal domains active.	Normal API behavior. Score returned with full manifest.
Flagged	Triggered high-confidence anomaly detector or in human review.	Provisional reduced score with Flagged label.	Platform receives Flagged lifecycle state in response. Treat with elevated caution.
Archived	No activity for 180 days and below TVL threshold.	Last computed score, marked Stale.	Any new activity immediately moves entity back to Active and triggers full rescore.


4	The Security Database
The foundation of every trust score

The Security Database is the most important component in the system. It is not a log of addresses or transactions. It is a structured library of behavioral patterns — what malicious entities do before they attack, and what safe entities consistently do over time. Every trust score is ultimately a comparison against this database.

4.1 Section A — The Threat Library
The Threat Library stores the behavioral fingerprint of every confirmed exploit, scam, and malicious contract Cencera has ever observed or received from external sources. A record in the Threat Library is not just an address. It is a complete behavioral profile.

Each Threat Library record contains the following information.

Field	What It Stores	Why It Matters
Bytecode Hash	Exact SHA-256 hash of the malicious contract bytecode.	Catches exact copies of known exploit contracts immediately.
Bytecode Vector	A 1536-dimension embedding of the bytecode structure.	Enables fuzzy matching — catches obfuscated variants of known exploits that have different hashes but the same structural logic.
Function Selectors	The 4-byte function identifiers and their risk classification.	Identifies dangerous function patterns like hidden mint, ownership transfer, or drain functions.
Behavioral Sequence	The sequence of transactions in the 7 days before the exploit executed.	Trains the temporal risk analyzer to detect attack staging behavior before an attack happens.
Exploit Category	Classification: rug pull, drainer, honeypot, flash loan, reentrancy, governance, phishing.	Determines which signal weights apply during pattern matching for this threat type.
Confidence Score	How certain Cencera is about this classification (0 to 1).	Low-confidence entries carry less weight in scoring than high-confidence analyst-confirmed entries.
Affected Chains	Which blockchains this threat pattern has appeared on.	Enables cross-chain risk propagation for entities that appear on multiple chains.

4.2 Section B — The Normal Activity Library
The Normal Activity Library stores the behavioral fingerprints of verified safe entities. This is equally important to the Threat Library. Without a strong normal baseline, the system cannot reliably distinguish suspicious behavior from simply unusual behavior.

The Normal Activity Library grows from three sources. Verified protocols with years of clean history and formal audits. Analyst-confirmed safe entities after human review. Entities whose long-term behavioral consistency passes automated verification thresholds.

4.3 How the Database Grows
The Security Database is not static. It grows through four channels.

Confirmed exploits. When a new exploit is confirmed anywhere in Web3, Cencera's analyst team adds its behavioral fingerprint to the Threat Library. This triggers retroactive rescoring of all similar entities within 4 hours.
External feed ingestion. ScamSniffer, PhishFort, Chainabuse, CryptoScamDB, Certik, PeckShield, SlowMist, and BlockSec feeds are polled every 60 seconds. New threat signatures are validated and added automatically.
Human review resolutions. When an analyst reviews a Zone 3 entity and confirms it as a threat or confirms it as safe, the result is added to the appropriate library.
Community reports. Validated loss reports from API consumers — with mandatory transaction hash verification — enter the human review queue at elevated priority.


5	Signal Ingestion Pipeline
How raw blockchain data becomes structured signals

The ingestion pipeline is the data collection layer. It runs independently of the scoring engine and the API. Its only job is to continuously collect signals from every data source, normalize them into a standard schema, and write them to the event log. It never computes scores.

5.1 The Four Signal Domains
Cencera collects signals from four independent domains. The use of four independent domains is the core of the system's adversarial resilience. An attacker who can fake on-chain signals cannot simultaneously fake authentic off-chain identity, genuine market liquidity, and AI-evaluated behavioral consistency.

Domain	What It Collects	Weight (Contract)	Weight (Wallet)	Why This Domain
On-Chain	Transaction frequency and value, contract interactions, approval grants, liquidity movements, exploit adjacency, contract upgrade events.	40%	60%	Cryptographically verified. Cannot be fabricated. Highest reliability.
Market	Liquidity depth and volatility, token distribution concentration, honeypot simulation, price impact anomalies, supply manipulation patterns.	15%	5%	Detects economic manipulation that on-chain analysis alone misses.
Off-Chain / OSINT	Project metadata, domain age, social account authenticity, developer identity continuity, audit status, GitHub history.	15%	20%	Provides identity and legitimacy context that pure on-chain data cannot capture.
AI-Derived	Bytecode similarity clustering, behavioral anomaly scoring, exploit pattern recognition, temporal risk trend analysis.	30%	15%	Detects novel threats and complex patterns that rule-based systems miss.

5.2 How a Signal Is Created — Step by Step
Here is the exact journey of one on-chain signal from blockchain event to database record.

A new block is confirmed on Ethereum. The on-chain ingestion worker receives the block event via WebSocket subscription from Alchemy.
The worker iterates every transaction in the block. For each transaction, it extracts the sender address, receiver address, value, and calldata.
For each address involved, the worker checks if the address exists in the entity table. If it does not, a new entity record is created with Nascent lifecycle state.
The worker extracts one or more signals from the transaction. A single transaction can produce multiple signals — a tx_value signal, a contract_interaction signal, and an approval_grant signal all from the same transaction.
Each signal is normalized into the standard signal schema and published to the Kafka event stream. Kafka writes it to the immutable event log immediately.
A Kafka consumer reads from the event stream and batch-inserts signals into the TimescaleDB entity_signals table. Signals are never inserted one by one — always in batches of 500 to 1,000 for performance.
The entity's last_seen_at timestamp is updated. If the entity has not been scored recently, it is queued for re-scoring.

5.3 The Standard Signal Schema
Every signal from every domain uses the same schema. This normalization is what allows the scoring engine to process signals from 18 chains and 4 domains with a single unified pipeline.

// Every signal looks like this, regardless of source
{
  "time":          "2025-03-19T10:30:00Z",   // When this signal was observed
  "entity_id":     "uuid-of-the-entity",      // CPID of the entity this signal belongs to
  "signal_domain": "onchain",                 // onchain | market | offchain | ai_derived
  "signal_type":   "approval_grant",          // What kind of signal this is
  "signal_value":  115792089237316,           // Numeric value (approval amount in this case)
  "signal_data":   {                          // Full context payload
    "spender": "0xabc...",
    "token":   "0xdef...",
    "unlimited": true
  },
  "confidence":    0.99,                      // How reliable is this signal (1.0 = on-chain = certain)
  "source":        "alchemy_chain_1"          // Which provider gave us this data
}

5.4 Signal Storage Architecture
Signals are stored across three tiers based on age. This keeps query performance fast and storage costs low.

Tier	Storage	Age Range	Query Speed	Monthly Cost (est.)	Purpose
Hot	TimescaleDB	0 to 90 days	Under 20ms	$150 to $300	Live scoring engine reads from here.
Warm	ClickHouse	90 days to 2 years	Under 3 seconds	$50 to $100	Historical queries, model training exports.
Cold	AWS S3 + Parquet	Over 2 years	Minutes	$5 to $15	Regulatory audit, deep historical analysis.

TimescaleDB automatically compresses data older than 90 days at roughly 95% compression ratio. A signal record that takes 1KB fresh takes about 50 bytes compressed. One billion signals costs approximately $50 per month in compressed storage.


6	The Scoring Engine
How raw signals become a trust score

The Scoring Engine is the computational core of Cencera. It runs as a background job cluster, continuously processing entities from a scoring queue. It reads signals from the hot layer, compares them against the Security Database, and produces structured score objects that are written to the cache.

6.1 What a Score Actually Is
A trust score is not a single number. It is a structured object. The composite score from 0 to 100 is one field in that object. Consuming platforms must use the full object — not just the number — to make good decisions.

// Full score object structure
{
  "compositeScore":   73,          // 0-100. The main score.
  "confidenceLevel":  "high",      // low | medium | high
  "zone":             1,           // 1 = known safe | 2 = known threat | 3 = unknown
  "lifecycleState":   "active",    // nascent | active | flagged | archived

  "contribution": {               // How much each domain contributed
    "onchain":   42,
    "market":    18,
    "offchain":   9,
    "aiDerived":  4
  },

  "triggeredIndicators": [        // What risk patterns were detected
    { "category": "approval",   "risk": "medium", "detail": "Unlimited approval to unverified contract" },
    { "category": "deployment", "risk": "low",    "detail": "Contract deployed 12 days ago" }
  ],

  "scoreTrajectory":  [68, 70, 71, 72, 73],  // Last 5 scores — is it stable, rising, or falling?

  "scoreManifest": {             // Exactly how this score was computed
    "signalGroupsActive": ["onchain", "market", "offchain", "ai_derived"],
    "lookbackDays":       30,
    "modelVersion":       "v1.2.0",
    "computedAt":         "2025-03-19T10:30:00Z"
  },

  "cacheAge":  42,               // Seconds since this score was computed
  "disclaimer": "Score is probabilistic. Enforcement is the consuming platform's responsibility."
}

6.2 The Three Zones — The Core Classification Logic
Before computing a score, the engine classifies every entity into one of three zones. The zone determines the score range, the confidence level, and whether the entity is routed to human review.

Zone	Condition	Score Range	Action
Zone 1 — Known Safe	High similarity to Normal Library AND low similarity to Threat Library AND no behavioral anomalies.	60 to 95	Return score with high confidence. No review needed.
Zone 2 — Known Threat	Significant similarity to Threat Library OR behavioral signals matching known attack patterns.	0 to 35	Return score with warning. Platform should block or alert user.
Zone 3 — Unknown	Low similarity to BOTH libraries. Cannot be confidently classified. Unknown is NEVER treated as safe.	25 to 45 provisional	Return provisional cautious score with LOW CONFIDENCE label. Queue for human review immediately.

6.3 The Scoring Pipeline — Step by Step
Here is exactly what happens inside the scoring engine when it processes one entity. Steps marked PARALLEL run simultaneously to minimize total computation time.

Step	Duration	Parallel?	What Happens
1	0 to 10ms	No	Cache check. If a fresh score exists in Redis, return it immediately. This is a cache hit — no computation needed.
2	0 to 200ms	YES	RPC data fetch. Pull bytecode, transaction history, deployer wallet, and recent interactions from Alchemy. 15 to 50 RPC calls depending on entity type.
3	0 to 100ms	YES	Threat Library match. Vector similarity search against all threat patterns. Returns top 5 matches with similarity scores. Runs in parallel with Step 4.
4	0 to 100ms	YES	Normal Library match. Vector similarity search against verified safe patterns. Returns top 5 matches with similarity scores. Runs in parallel with Step 3.
5	0 to 150ms	YES	Off-chain signals. Pull cached OSINT data — social account age, domain age, audit status. Mostly cache hits so very fast.
6	0 to 120ms	YES	Market signals. Pull cached DEX data — liquidity depth, holder concentration, honeypot simulation result.
7	200 to 320ms	No	Behavioral anomaly scoring. Requires RPC data from Step 2 to complete first. Compares current behavior against entity's own historical baseline.
8	320 to 340ms	No	Zone classification. Apply threshold logic against all results from Steps 3 to 7. Determine Zone 1, 2, or 3.
9	340 to 400ms	No	Score object construction. Build full structured score object with all fields. Apply entity-type weight matrix to contribution breakdown.
10	400 to 450ms	No	Write and cache. Write score to TimescaleDB. Populate Redis L2 cache. Populate Cloudflare KV L1 edge cache. Trigger webhook if score delta exceeds platform threshold.

Total p50 target: 420ms for fresh score. Cached score: under 15ms. The parallel execution of Steps 2 through 6 is what makes the 420ms target achievable.

6.4 How Weights Are Applied
The four signal domains do not have equal weight for all entity types. Different entities have different risk profiles, so the scoring engine applies different weight matrices.

Entity Type	On-Chain	Market	Off-Chain	AI-Derived	Reasoning
EOA Wallet	60%	5%	20%	15%	Wallets are primarily behavioral. Market signals barely apply.
Smart Contract	40%	15%	15%	30%	Contracts need heavy AI analysis. Bytecode patterns are critical.
Token	30%	40%	20%	10%	Token risk is mostly economic. Market signals dominate.
Protocol / DApp	35%	30%	20%	15%	Balanced — protocols have both on-chain and market exposure.
NFT Collection	40%	30%	20%	10%	Wash trading and marketplace signals are key market indicators.

When a platform disables a signal domain, the remaining weights are renormalized proportionally so they always sum to 100%. A score produced with reduced signal groups is labeled with a lower confidence level.


7	API Reference
Complete integration guide for platform partners

This section is the complete API reference for integration partners. It covers authentication, all endpoints, response formats, error codes, and rate limits. Read this section if you are building a wallet, DEX, protocol, or security tool that consumes Cencera data.

7.1 Authentication
All API requests require an API key in the request header. API keys are issued per platform. Each key is associated with a tier that determines rate limits and response detail level.

// Include in every request header
x-api-key: your_api_key_here

// Example request
GET https://api.cencera.xyz/v1/trust/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/chain/1
Headers:
  x-api-key: ck_live_abc123xyz
  Content-Type: application/json

7.2 API Tiers
Tier	Authentication	Rate Limit	Response Detail	Use Case
Free	No key required	100 requests per hour per IP	Composite score + lifecycle state only	Developer evaluation. Not for production.
Standard	API key	10,000 requests per minute	Full score object including trajectory and triggered indicators	Production wallet and tooling integrations.
Enterprise	API key + contract	Custom	Signal-level detail, batch screening, webhooks, SLA guarantee	Uniswap-scale protocols and exchanges.

7.3 Core Endpoints

Entity Trust Query
Returns the current trust score for a single entity. This is the most called endpoint.

GET /v1/trust/{address}/chain/{chainId}

Parameters:
  address  — Blockchain address of the entity (0x format for EVM chains)
  chainId  — Chain ID integer (1=Ethereum, 56=BNB, 137=Polygon, 42161=Arbitrum, 8453=Base)

Response: 200 OK
{
  "compositeScore": 73,
  "confidenceLevel": "high",
  "zone": 1,
  "lifecycleState": "active",
  "entity": { "address": "0xd8dA...", "chainId": 1, "entityType": "eoa" },
  "contribution": { "onchain": 44, "market": 4, "offchain": 14, "aiDerived": 11 },
  "triggeredIndicators": [],
  "scoreTrajectory": [70, 71, 72, 72, 73],
  "scoreManifest": { "signalGroupsActive": ["onchain","market","offchain","ai_derived"], "lookbackDays": 30, "modelVersion": "v1.2.0" },
  "computedAt": "2025-03-19T10:30:00Z",
  "cacheAge": 42
}

Response Headers:
  X-Response-Time: 23ms
  X-Cache-Hit: true

Transaction Risk Context
Given a transaction about to be submitted, returns risk context for all entities involved. Designed for pre-transaction wallet warnings. Must return in under 200ms to avoid degrading wallet UX.

POST /v1/risk/transaction

Request Body:
{
  "chainId": 1,
  "from": "0xSenderAddress",
  "to": "0xContractAddress",
  "data": "0xCalldata",
  "value": "1000000000000000000"
}

Response: 200 OK
{
  "overallRisk": "medium",
  "entities": {
    "to": { "compositeScore": 41, "zone": 2, "lifecycleState": "active",
            "triggeredIndicators": [{ "category": "approval", "risk": "high", "detail": "Contract has drained 847 wallets in past 30 days" }] },
    "from": { "compositeScore": 78, "zone": 1, "lifecycleState": "active" }
  },
  "recommendation": "WARN",
  "responseTimeMs": 67
}

Batch Screening
Screen up to 500 entities in a single request. For protocols that want to periodically scan their active entity set rather than checking one by one.

POST /v1/trust/batch

Request Body:
{
  "entities": [
    { "address": "0xabc...", "chainId": 1 },
    { "address": "0xdef...", "chainId": 56 },
    // up to 500 entities per request
  ]
}

Response: 200 OK
{
  "results": [
    { "address": "0xabc...", "chainId": 1, "compositeScore": 82, "zone": 1, "confidenceLevel": "high" },
    { "address": "0xdef...", "chainId": 56, "compositeScore": 12, "zone": 2, "confidenceLevel": "high" }
  ],
  "processed": 2,
  "responseTimeMs": 340
}

Webhook Registration
Register a URL to receive proactive score updates. Cencera pushes to your webhook when a registered entity's score changes by more than your configured delta, or when an entity moves lifecycle states.

POST /v1/webhooks/register

Request Body:
{
  "url": "https://yourplatform.com/cencera-webhook",
  "entities": ["0xabc...", "0xdef..."],
  "triggers": {
    "scoreDeltaThreshold": 10,      // Push when score changes by 10+ points
    "lifecycleStateChange": true,    // Push when entity becomes Flagged or Archived
    "retroactiveRescore": true       // Push when entity is rescored after new exploit confirmed
  }
}

// Webhook payload pushed to your URL when triggered:
{
  "event": "score_delta",
  "entity": { "address": "0xabc...", "chainId": 1 },
  "previousScore": 72,
  "newScore": 31,
  "delta": -41,
  "reason": "entity_flagged_exploit_similarity",
  "timestamp": "2025-03-19T11:45:00Z"
}

7.4 Error Codes
HTTP Code	Error Code	Meaning	What To Do
400	INVALID_ADDRESS	Address format is not valid for the specified chain.	Check address format. EVM addresses must be 0x + 40 hex characters.
401	MISSING_API_KEY	No API key provided.	Include x-api-key header in every request.
401	INVALID_API_KEY	API key is invalid or revoked.	Contact support to verify or rotate your key.
404	ENTITY_NOT_FOUND	Entity has never been observed by Cencera on this chain.	Entity will be created and scored on next observed activity. Retry in 60 seconds.
409	SCORE_COMPUTING	Entity score is being computed for the first time.	Retry after the estimatedReadyMs value in the response body.
429	RATE_LIMIT_EXCEEDED	Too many requests in the current window.	Respect the X-RateLimit-Remaining header. Back off and retry.
503	SERVICE_DEGRADED	One or more signal domains temporarily unavailable.	Score returned may have lower confidence. Check X-Degraded-Domains header.

7.5 Response Time Guarantees
Endpoint	p50	p95	p99	Notes
Entity Trust Query (cached)	15 to 35ms	80ms	150ms	90%+ of calls. Score served from Cloudflare edge cache.
Entity Trust Query (fresh)	320 to 420ms	500ms	700ms	Under 10% of calls. New or stale entity requires fresh computation.
Transaction Risk Context	60 to 100ms	150ms	200ms	Inline wallet use. Must never degrade wallet signing experience.
Batch Screening (500 entities)	800ms	1.5s	2.5s	Mix of cache hits and fresh scores. Non-blocking for user.
Historical Reputation Query	1 to 2s	3s	5s	Non-critical path. Used for analytics and compliance.


8	Integration Guide
How to integrate Cencera into your platform

This section gives integration partners the exact implementation patterns for each platform type. Copy the pattern that matches your use case.

8.1 Wallet Integration — Pre-Transaction Warning
The most common integration pattern. Before a transaction is signed, call the Transaction Risk Context endpoint. Display a warning if the risk level is medium or high. Never block — always let the user override with explicit confirmation.

// Wallet integration — TypeScript example
async function checkTransactionRisk(tx: TransactionRequest): Promise<RiskResult> {
  const response = await fetch('https://api.cencera.xyz/v1/risk/transaction', {
    method: 'POST',
    headers: { 'x-api-key': CENCERA_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ chainId: tx.chainId, from: tx.from, to: tx.to, data: tx.data, value: tx.value })
  });

  const risk = await response.json();

  if (risk.overallRisk === 'high') {
    // Show blocking warning with explicit override required
    return showHighRiskWarning(risk.entities.to.triggeredIndicators);
  }
  if (risk.overallRisk === 'medium') {
    // Show non-blocking warning — user can proceed
    showMediumRiskBanner(risk.entities.to.compositeScore);
  }
  // Low risk — proceed silently
}

// Important: set a timeout. If Cencera does not respond in 200ms, proceed without warning.
// Never block a transaction on a third-party API response.
const riskCheck = await Promise.race([
  checkTransactionRisk(tx),
  new Promise(resolve => setTimeout(() => resolve({ overallRisk: 'unknown' }), 200))
]);

8.2 DEX / Protocol Integration — Entity Screening
Protocols should not rely solely on point-in-time queries. Use batch screening to periodically scan your entire active entity set, and use webhooks to receive proactive alerts when a score changes significantly.

// Protocol integration — periodic batch screening
// Run this every hour on your active liquidity providers and token contracts

async function screenActiveEntities(entities: { address: string, chainId: number }[]) {
  // Process in chunks of 500 (API limit per request)
  const chunks = chunkArray(entities, 500);

  for (const chunk of chunks) {
    const response = await fetch('https://api.cencera.xyz/v1/trust/batch', {
      method: 'POST',
      headers: { 'x-api-key': CENCERA_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ entities: chunk })
    });

    const result = await response.json();

    for (const entityScore of result.results) {
      if (entityScore.zone === 2) {
        // Zone 2 = known threat. Pause this entity's activity immediately.
        await pauseEntityActivity(entityScore.address);
        await notifyRiskTeam(entityScore);
      }
      if (entityScore.zone === 3) {
        // Zone 3 = unknown. Flag for manual review but do not auto-pause.
        await flagForReview(entityScore.address, entityScore.triggeredIndicators);
      }
    }
  }
}

8.3 What Platforms Must NOT Do
These integration mistakes will cause incorrect behavior and should be avoided.

Do not use the composite score number alone without checking the confidenceLevel field. A score of 65 with low confidence is very different from a score of 65 with high confidence.
Do not block transactions based on Cencera scores without an override mechanism. Cencera scores are probabilistic. False positives exist. Users must always be able to override with explicit confirmation.
Do not assume a high score means guaranteed safety. A score of 90 means the current evidence strongly suggests safe behavior. It does not mean the entity is safe. Novel attack types that have never been seen before will not be detected until they are confirmed.
Do not cache scores on your own side for more than 5 minutes. Score changes can be rapid — a new exploit confirmation can drop a score by 50 points in seconds. Use Cencera's webhook system for proactive updates instead of polling.
Do not compare scores across different confidence levels as if they are equivalent. A score of 75 with full four-domain computation is not the same as a score of 75 with two domains disabled.


9	The Learning System
How Cencera gets smarter over time

A scoring system that cannot learn is a system that attackers can eventually defeat by studying its patterns. Cencera has three feedback channels that continuously update the Security Database and improve scoring accuracy.

9.1 Channel 1 — Confirmed Exploit Ingestion
When any exploit is confirmed anywhere in Web3, the following sequence happens automatically within 4 hours.

The analyst team receives an alert from external feeds or internal monitoring. A draft Threat Library record is auto-created.
An analyst reviews the entity's full behavioral history, documents the exploit category, and confirms the record with multi-party authorization.
The new threat record is written to the Threat Library. The exploit signature library is write-protected — no API compromise can poison it.
The retroactive rescore pipeline identifies all entities with behavioral overlap to the new threat and queues them for immediate rescore.
Webhooks are sent to all platforms that have registered interest in affected entity types. Score changes propagate globally within 60 seconds.

9.2 Channel 2 — Zone 3 Human Review
Every Zone 3 entity — entities whose behavior cannot be confidently classified — enters the human review queue. The queue has defined SLA targets based on severity.

Priority	Trigger	SLA	Resolution Action
Critical	Zone 3 entity with TVL adjacency above $1M	4 hours	Analyst reviews full signal history. Confirms threat or safe. Updates database.
Standard	Zone 3 entity with normal activity level	24 hours	Analyst reviews. Updates database. Entity moves to Zone 1 or Zone 2.
Low	Zone 3 entity with minimal activity	72 hours	Batch reviewed. Patterns added to training data for next model update.

9.3 Channel 3 — Loss Reports
Any platform or user can submit a loss report through the API. Reports are never automatically trusted — they enter the human review queue at elevated priority after on-chain verification.

POST /v1/reports/loss

Request Body:
{
  "reporterAddress":   "0xVictimWallet",
  "exploitedAddress":  "0xMaliciousContract",
  "chainId":           1,
  "transactionHash":   "0xProofOfLoss",    // REQUIRED — must be a real on-chain tx
  "lossAmountUsd":     15000,
  "description":       "Approved contract and all tokens were drained within 3 blocks"
}

// Reports without a valid transactionHash are rejected automatically.
// Reports with a valid transactionHash elevate the entity in the human review queue.
// Reports NEVER directly modify scores.

9.4 Model Retraining Schedule
Update Type	Frequency	Trigger	What Changes
Minor Update	Every 2 weeks	Scheduled	Latest confirmed exploit data incorporated. Signature library updated.
Major Update	Quarterly	Scheduled	Full model retraining on all accumulated labeled data. Weight matrix reviewed.
Emergency Update	As needed	Accuracy drop below threshold	Auto-triggered if false positive rate exceeds 15% or Zone 2 F1 drops below 0.80.


10	Adversarial Resilience
How the system defends against manipulation attempts

Cencera operates in an adversarial environment. Sophisticated attackers will actively attempt to manipulate scores — either to make malicious entities appear safe, or to make safe entities appear malicious. The system is designed with these attack vectors explicitly in mind.

Attack Vector	What the Attacker Does	How Cencera Defends
Score farming	Generates artificial safe-looking on-chain transactions to build a high trust score before attacking.	Multi-signal correlation. Faking on-chain signals does not simultaneously fake off-chain identity, market liquidity, and AI-evaluated behavioral consistency.
Sybil attack	Creates many fresh wallets all connected through the same deployer to simulate independent clean history.	Graph-based anomaly detection. Star-topology interaction patterns from a single deployer are a direct sybil indicator.
API probing	Makes many API queries to reverse-engineer which specific signals drive score changes.	Tiered explainability. Signal-level detail is only available to verified enterprise partners under contractual controls. Public API only returns category-level indicators.
Exploit variant	Modifies a known exploit contract's bytecode to avoid exact hash matching.	Vector similarity matching. Fuzzy bytecode matching detects structural similarity even when exact hash does not match. Detects variants with 75 to 85% structural similarity.
Behavioral mimicry	Mimics safe entities closely during a staging period before attacking.	Temporal risk trend analysis. Even a clean-looking staging phase involves shifts in approval patterns, counterparty selection, and fund routing that are characteristic of attack preparation.
Data source poisoning	Compromises an external feed or RPC provider to inject false signals.	Multi-provider cross-validation. Signals appearing in only one provider are quarantined. The Threat Library is write-protected and requires multi-party authorization for any writes.


11	Explicit Limitations
What Cencera does not do and cannot guarantee

Honesty about limitations is a security requirement, not a weakness. A consuming platform that misunderstands what Cencera can and cannot do is a platform that will make bad decisions based on incorrect assumptions.

What Cencera Does NOT Do
Cencera does not prevent transaction execution. It produces scores. Enforcement is always the consuming platform's responsibility.
Cencera does not replace smart contract audits. Audits assess code correctness. Cencera assesses behavioral risk. They answer different questions.
Cencera does not guarantee that a high-scoring entity is safe. Novel attack types never seen before will not be detected until confirmed and added to the training data.
Cencera does not eliminate MEV, frontrunning, or oracle manipulation. These are execution-layer phenomena outside Cencera's scope.
Cencera scores are probabilistic estimates, not absolute judgments. A score of 85 means the current evidence strongly suggests safe behavior — not that the entity is safe.

There is an inherent gap between the moment a novel exploit first appears and the moment Cencera's model has been updated to detect it. The Zone 3 classification and human review system reduce this gap but do not eliminate it. Platforms should treat Zone 3 entities with elevated caution and not treat them as equivalently safe to Zone 1 entities.


12	Planned Extensions
What comes after the Base Model launches

Feature	Description	Target Phase
Self-Learning Agentic Model	The full continuous learning loop from Architecture v2. Retroactive rescore pipeline, novel behavior flagging, and automated model updates without human intervention.	Post Series A
Cross-Chain Trust Unification	Single unified trust score for entities that operate across multiple chains, with asymmetric negative signal propagation.	Q3 post-launch
Zero-Knowledge Trust Proofs	Allows entities to prove their trust score meets a threshold without revealing the underlying score or signals. Enables privacy-preserving gating.	Post Series A
On-Chain Trust Attestations	Publishing score attestations to a smart contract layer so protocols can reference Cencera scores in their own contract logic without an API call.	Post Series A
Security Database Licensing	Opening the Security Database to other security companies under the data reciprocity model. Companies that use the database to train their models must share novel threat data back.	Post $1M ARR
Community Signal Contributions	Governed mechanism for verified community members to contribute signal data with economic incentives for accuracy and penalties for false reports.	Post Series A



CENCERA Technical Paper v2.0
Computable Trust and Reputation Layer for Web3
founders@cencera.xyz   |   www.cencera.xyz   |   app.cencera.xyz