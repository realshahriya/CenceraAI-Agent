const { ethers } = require('ethers');

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545');
        // Placeholder: Need contract address and ABI after deployment
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.abi = [
            "function ownerOf(uint256 tokenId) view returns (address)", // Standard ERC721-like
            "function getAgent(uint256 _agentId) view returns (tuple(uint256 id, address owner, uint96 innovationScore, string memoryHash))"
        ];
    }

    async verifyOwnership(agentId, walletAddress) {
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

    async updateInnovationScore(agentId, scoreIncrement) {
        if (!this.contractAddress) {
            console.log(`[Dev Mode] Skipping on-chain score update for Agent ${agentId}. Increment: ${scoreIncrement}`);
            return;
        }

        try {
            // Placeholder for actual transaction signing
            // In a real app, this would use a relayer wallet or similar
            console.log(`[Blockchain] Updating innovation score for Agent ${agentId} by ${scoreIncrement}`);
            // const contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet);
            // await contract.updateMemory(agentId, "NEW_HASH"); // This actually updates score in contract
        } catch (error) {
            console.error("Failed to update innovation score:", error);
        }
    }
}

module.exports = { blockchainService: new BlockchainService() };
