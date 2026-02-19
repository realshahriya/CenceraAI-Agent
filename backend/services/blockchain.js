const { ethers } = require('ethers');

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545');
        this.contractAddress = process.env.CONTRACT_ADDRESS;

        // Initialize Wallet
        const privateKey = process.env.PRIVATE_KEY;
        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey, this.provider);
        } else {
            console.warn("PRIVATE_KEY not set. Blockchain transactions will fail.");
        }

        this.abi = [
            "function ownerOf(uint256 tokenId) view returns (address)",
            "function getAgent(uint256 _agentId) view returns (tuple(uint256 id, address owner, uint96 innovationScore, string memoryHash))",
            "function updateMemory(uint256 _agentId, string calldata _newMemoryHash) external",
            "function createAgent(string calldata _initialMemoryHash) external returns (uint256)",
            "function getAgentsByOwner(address _owner) external view returns (uint256[])"
        ];
    }

    async verifyOwnership(agentId, walletAddress) { // ... existing code ... 
        if (!this.contractAddress) {
            console.warn("Contract address not set. Skipping on-chain verification (Dev Mode).");
            return true; // Dev mode: always allow
        }

        try {
            const contract = new ethers.Contract(this.contractAddress, this.abi, this.provider);
            const agent = await contract.getAgent(agentId);
            return agent.owner.toLowerCase() === walletAddress.toLowerCase();
        } catch (error) {
            console.error("Blockchain verification failed:", error);
            return false;
        }
    }

    async ensureAgentOnChain(userIdentifier) {
        if (!this.contractAddress || !this.wallet) return 1; // Dev mode fallback

        // simple in-memory mapping for prototype (User ID -> Chain ID)
        if (!this.agentMapping) this.agentMapping = new Map();

        // Return existing if found
        if (this.agentMapping.has(userIdentifier)) {
            return this.agentMapping.get(userIdentifier);
        }

        try {
            console.log(`[Blockchain] Creating new On-Chain Agent for User ${userIdentifier}...`);
            const contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet);

            const tx = await contract.createAgent("Genesis: User Subagent");
            await tx.wait();

            // Fetch agents to find the new one (simplified for prototype)
            const agentIds = await contract.getAgentsByOwner(this.wallet.address);
            const newAgentId = agentIds[agentIds.length - 1]; // Assume latest is ours

            console.log(`[Blockchain] Created Agent ${newAgentId} for User ${userIdentifier}`);
            this.agentMapping.set(userIdentifier, newAgentId);
            return newAgentId;

        } catch (error) {
            console.error("Failed to create agent on-chain:", error);
            return 1; // Fallback to Agent 1
        }
    }

    async updateInnovationScore(userIdentifier, memoryHash) {
        if (!this.contractAddress || !this.wallet) return;

        // Resolve Chain ID (Mint new agent if needed)
        const chainId = await this.ensureAgentOnChain(userIdentifier);

        try {
            console.log(`[Blockchain] Updating memory for Chain Agent ${chainId} (User ${userIdentifier})...`);
            const contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet);

            // Use the IPFS CID or a default string
            const hashString = typeof memoryHash === 'string' ? memoryHash : "Evolved";

            const tx = await contract.updateMemory(chainId, hashString);

            console.log(`[Blockchain] Tx sent: ${tx.hash}`);
            await tx.wait();
            console.log(`[Blockchain] Confirmed. Agent ${chainId} evolved.`);
        } catch (error) {
            console.error("Failed to execute on-chain transaction:", error);
        }
    }
    async getAgentDetails(userIdentifier) {
        if (!this.contractAddress || !this.wallet) return null;

        const chainId = await this.ensureAgentOnChain(userIdentifier);

        try {
            const contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet);
            const agent = await contract.getAgent(chainId);
            return {
                id: agent.id.toString(),
                owner: agent.owner,
                score: agent.innovationScore.toString(),
                memoryHash: agent.memoryHash
            };
        } catch (error) {
            console.error("Failed to fetch agent details:", error);
            return null;
        }
    }
}

module.exports = { blockchainService: new BlockchainService() };
