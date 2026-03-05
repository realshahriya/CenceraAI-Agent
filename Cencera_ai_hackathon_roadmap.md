# CenceraAI – On-Chain Immortal AI Agent

Hackathon Roadmap & Builder Guide

---

## 🎯 Project Overview

**CenceraAI** is an on-chain AI identity agent built on BNB Chain with decentralized memory and cross-platform interoperability.

Core Features:

* On-chain agent identity (smart contract)
* Decentralized memory storage (Utilizing **Unibase's Membase**)
* AI logic layer (LLM integration)
* Cross-platform support (Web + Telegram)
* Autonomous evolution & Action Execution (via **BitAgent Launchpad**)
* Wallet-based ownership

Goal:
Build a clean, technically solid prototype that demonstrates sovereignty, persistence, and interoperability.

---

# 🧱 Architecture Overview

```flow
User (Web / Telegram)
        ↓
Smart Contract (BNB Chain)
        ↓
Backend (Node.js AI Logic)
        ↓
Membase (Decentralized Memory)
        ↓
LLM (AI Model)
```

---

# 🛠 Tech Stack

## Blockchain

* Solidity ^0.8.20
* Hardhat
* BNB Chain Testnet
* MetaMask

## Backend

* Node.js
* Express
* Ethers.js
* OpenAI (or open-source LLM)
* **Membase** (Unibase Decentralized Memory Layer)
* **BitAgent** (AI Agent Launchpad & Execution)

## Frontend

* Next.js or React
* Wallet connection (MetaMask)

## Cross-Platform

* Telegram Bot (node-telegram-bot-api)

---

# 📜 Smart Contract Template (Solidity)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CenceraAgent {
    // Custom Errors for Gas Optimization
    error NotOwner();
    error AgentDoesNotExist();

    struct Agent {
        uint256 id;
        address owner;          // 20 bytes
        uint96 innovationScore; // 12 bytes (Packed with owner: 20+12 = 32 bytes = 1 slot)
        string memoryHash;
    }

    uint256 private _agentIdCounter;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerToAgentIds;

    event AgentCreated(uint256 indexed agentId, address indexed owner, string memoryHash);
    event MemoryUpdated(uint256 indexed agentId, string newMemoryHash);

    constructor() {
        _agentIdCounter = 0;
    }

    function createAgent(string calldata _initialMemoryHash) external returns (uint256) {
        _agentIdCounter++;
        uint256 newAgentId = _agentIdCounter;

        agents[newAgentId] = Agent({
            id: newAgentId,
            owner: msg.sender,
            innovationScore: 0,
            memoryHash: _initialMemoryHash
        });

        ownerToAgentIds[msg.sender].push(newAgentId);

        emit AgentCreated(newAgentId, msg.sender, _initialMemoryHash);

        return newAgentId;
    }

    function updateMemory(uint256 _agentId, string calldata _newMemoryHash) external {
        Agent storage agent = agents[_agentId];
        
        if (agent.owner != msg.sender) {
            revert NotOwner();
        }

        agent.memoryHash = _newMemoryHash;
        
        // Increment score (Safe from overflow on uint96 for realistic use cases)
        unchecked {
            agent.innovationScore++;
        }

        emit MemoryUpdated(_agentId, _newMemoryHash);
    }

    function getAgent(uint256 _agentId) external view returns (Agent memory) {
        if (agents[_agentId].id == 0) {
            revert AgentDoesNotExist();
        }
        return agents[_agentId];
    }

    function getAgentsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerToAgentIds[_owner];
    }
}
```

**Notes:**

* `memoryHash` stores a reference to Membase memory.
* Ownership is wallet-based.
* Minimal, secure, and upgradeable design possible.

---

# 🤖 X/Twitter Agent Capabilities

**Step 1:**
Find crypto projects. Use these keywords: Crypto, Blockchain, Cryptocurrency, RWA, Defi, DePin, TGE, token generation event, mainnet launch, testnet, whitepaper, protocol, audit, smart contract, zk, layer 1, layer 2, wallet, dex, swap, token, tokenomics, coin, airdrop

**Step 2:**
Check the account is verified or not (blue or yellow tick)

**Step 3:**
Read the bio of the account to ensure the account is a crypto project, not a user account

**Step 4:**
The account should be projects account not users account

**Step 5:**
The followers should be >300 to <36000

**Step 6:**
There should be a post or retweet in past 1 week from today's data

**Step 7:**
Ensure that the project should not be a NFT project, If its a NFT project skip

**Step 8:**
Copy the project website link

**Step 9:**
Add the project details (Name, website link, X account link, category) into my Google sheet named "Agent X Sheet"

*Note: Use [docs.twitterapi.io](https://docs.twitterapi.io/introduction) for Twitter-related works!*

---

# 📅 30-Day Roadmap

## PHASE 1: Smart Contract Foundation (Days 1–5)

* Deploy above contract on BNB Testnet
* Test agent creation, memory update, and retrieval

## PHASE 2: Backend + Memory Integration (Days 6–12)

* Build Express server
* Integrate Membase API
* Connect LLM
* Endpoint: POST /chat

## PHASE 3: BitAgent + Autonomy (Days 13–18)

* Register agent via BitAgent
* Add daily autonomous summary job

## PHASE 4: Frontend + Telegram (Days 19–24)

* Simple web UI with wallet connection
* Telegram bot using same backend

## PHASE 5: Polish & Submission (Days 25–30)

* GitHub cleanup, documentation, demo video

---

# 🧠 Builder Prompt Instructions

* Smart Contract prompt
* Backend prompt
* Autonomous evolution prompt

---

# 🎬 Demo Video Script Outline

* Show deployment
* Agent creation
* Chat interaction
* Memory persistence
* Telegram integration
* Evolution score update

---

# ⚠️ Rules for Success

* Focus scope
* Reliable integration
* Understand each part
* Polish documentation

---

# 🚀 Final Goal

* **Unibase Ecosystem Integration:** Complete Membase & BitAgent workflows.
* **On-chain Identity:** BNB Chain Smart Contract.
* **Decentralized Memory:** Persistent, sovereign data.
* **Cross-platform:** Seamless Telegram <-> Web interaction.
* **Autonomous Evolution:** Agents that grow and act without user prompting.

> **Target:** Win part of the $500K Liquidity Funding & Unibase Ecosystem Support.
