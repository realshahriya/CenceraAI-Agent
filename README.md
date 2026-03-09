# CenceraAI: On-Chain Immortal AI Agent

**Decentralized Memory • Cross-Platform Interoperability • Sovereign Identity**

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:ASI](https://img.shields.io/badge/asi-3D8BD3)

Built for the **Fetch.ai: Unlocking Agent Intelligence on BNB Chain** hackathon.

![Status](https://img.shields.io/badge/Status-Prototype-green) ![Network](https://img.shields.io/badge/Network-BNB_Testnet-yellow)

## 🏆 The Challenge Solution

CenceraAI is a **Sovereign AI Entity** that leverages the **Fetch.ai ecosystem** and **ASI-1 Mini LLM** to perform autonomous on-chain actions.

1. **Autonomous Reasoning (ASI-1 Mini)**: The agent uses Fetch.ai's Web3-native LLM to decide when to perform on-chain actions (Swaps, Deployments, Memory Updates) based on its persistent decentralized memories.
2. **On-Chain Identity (BNB Chain)**: The agent's state, "Innovation Score", and identity are secured via Smart Contracts on BNB Chain.
3. **uAgents Integration**: Registered on **Agentverse** via a specialized bridge, allowing it to communicate with other agents in the Fetch.ai Network.
4. **Decentralized Memory (Unibase Membase)**: Every interaction is hashed and stored in a decentralized memory layer, ensuring the agent "never forgets" across platforms.
5. **Cross-Platform Interoperability**: Talk to the same agent on **Telegram** or via the **Web Dashboard**.

---

## 🚀 Features

- **🧠 Immortal Memory**: Interactions are hashed and "etched" into its permanent record.
- **🔗 Cross-Platform Sync**: Seamlessly switch between Telegram and Web.
- **⚡ Autonomous Agency**: The agent thinks and evolves on its own every minute.

- **🛡️ Verifiable Identity**: `Agent ID` and `Innovation Score` are on-chain proofs of life.

---

## 🛠️ Architecture

### 1. Smart Contract (`contracts/`)

- **Tech**: Solidity, Hardhat, BNB Testnet.

- **Role**: Issues unique `Agent IDs` (NFT-like) and stores the `Memory Hash` state.

### 2. The Brain (Backend) (`backend/`)

- **Tech**: Node.js, Express, Gemini 2.0 Flash (AI), Ethers.js.

- **Role**:
  - **Memory Service**: Manages short-term and long-term memory (Simulating Membase).
  - **LLM Service**: Generates persona-based responses using Google Gemini.
  - **Autonomy Service**: Runs the "Evolution Loop" to summarize days and update the chain.

### 3. The Interfaces (`frontend/` & `telegram/`)

- **Web**: Next.js, RainbowKit/Wagmi (Wallet Connect).

- **Telegram**: `node-telegram-bot-api`.
- **Role**: Users interact with the *same* agent brain from different surfaces.
- **Bot Output**: The bot uses a specific system prompt to maintain an "Eternal/Cryptic" persona to demonstrate its unique nature.

---

## 📦 Installation & Demo

### Prerequisites

- Node.js (v18+)

- MetaMask (configured for BNB Testnet)
- A Google Gemini API Key
- A Telegram Bot Token (from @BotFather)

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your keys in .env
node server.js
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### 3. Setup Smart Contracts (Optional - Deploy your own)

```bash
cd contracts
npm install
npx hardhat run scripts/deploy.js --network bscTestnet
```

---

## 🧪 How to Verify (Judges)

1. **Talk on Telegram**: Start the bot and say "My name is [Name]".
2. **Go to Web**: Connect your wallet to `localhost:3000`.
3. **Check Memory**: Ask the Web Agent "What is my name?". It will know, because the **Memory is Shared**.
4. **Wait 1 Minute**: Watch the backend console. You will see the **Autonomous Loop** trigger, reflecting on your conversation and updating the agent's internal state.

---
*Built with ❤️ for the Future of Decentralized AI.*
