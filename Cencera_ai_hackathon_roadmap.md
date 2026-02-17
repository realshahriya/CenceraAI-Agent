# CenceraAI – On-Chain Immortal AI Agent

Hackathon Roadmap & Builder Guide

---

## 🎯 Project Overview

**CenceraAI** is an on-chain AI identity agent built on BNB Chain with decentralized memory and cross-platform interoperability.

Core Features:

* On-chain agent identity (smart contract)
* Decentralized memory storage (Membase)
* AI logic layer (LLM integration)
* Cross-platform support (Web + Telegram)
* Autonomous evolution system
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
* Membase API / SDK
* BitAgent SDK

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

* On-chain identity
* Decentralized memory
* Cross-platform interaction
* Autonomous evolution
