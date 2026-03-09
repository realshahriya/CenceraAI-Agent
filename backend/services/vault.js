const { blockchainService } = require('./blockchain');
const { ethers } = require('ethers');

class VaultService {
    constructor() {
        // The Bot's Public Identity on BNB Chain
        this.botAddress = blockchainService.wallet?.address || "0x000... (Bot Wallet Not Set)";
    }

    /**
     * Check if a user has authorized the bot to act on their behalf on-chain.
     */
    async isAuthorized(userWalletAddress) {
        if (!blockchainService.contractAddress) return false;

        try {
            const contract = new ethers.Contract(
                blockchainService.contractAddress,
                blockchainService.abi,
                blockchainService.provider
            );

            return await contract.authorizedAgents(userWalletAddress, this.botAddress);
        } catch (error) {
            console.error("Vault check failed:", error);
            return false;
        }
    }

    /**
     * Get unique deposit/vault instructions for the user.
     * This creates a 'Virtual Safe' concept using the Smart Contract.
     */
    getVaultInstructions() {
        return {
            botPublicAddress: this.botAddress,
            contractAddress: blockchainService.contractAddress,
            network: "BNB Chain Testnet",
            steps: [
                "1. Connect your wallet to the Cencera Dashboard.",
                "2. Click 'Authorize Agent' and paste the Bot Address.",
                "3. This gives the AI permission to perform swaps for you without knowing your key.",
                "4. You can revoke this permission anytime."
            ]
        };
    }
}

module.exports = { vaultService: new VaultService() };
