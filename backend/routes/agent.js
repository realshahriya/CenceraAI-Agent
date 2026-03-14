const express = require('express');
const router = express.Router();
const { blockchainService } = require('../services/blockchain');

/**
 * GET /agent/status
 * Fetches live agent details from the blockchain (innovation score, memory hash, etc.)
 */
router.get('/status', async (req, res) => {
    try {
        // userIdentifier is required by getAgentDetails. 
        // For the dashboard, we use a default ID or chat ID if known, 
        // but blockchainService.getAgentDetails usually expects an identifier like a chatId.
        // We'll use a constant for the global agent state or allow passing one.
        const identifier = req.query.id || "CENCERA_GLOBAL"; 

        const details = await blockchainService.getAgentDetails(identifier);
        
        if (!details) {
            return res.status(404).json({ error: 'Agent status not found' });
        }

        res.json({
            agentId: details.id,
            owner: details.owner,
            innovationScore: details.score,
            memoryHash: details.memoryHash,
            status: "Online",
            chain: "BNB Chain Testnet"
        });
    } catch (error) {
        console.error('Failed to fetch agent status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
