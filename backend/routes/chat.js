const express = require('express');
const router = express.Router();
const { memoryService } = require('../services/memory');
const { llmService } = require('../services/llm');
const { blockchainService } = require('../services/blockchain');

router.post('/', async (req, res) => {
    try {
        const { message, agentId, walletAddress } = req.body;

        if (!message || !agentId || !walletAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Verify ownership
        const isOwner = await blockchainService.verifyOwnership(agentId, walletAddress);
        if (!isOwner) {
            return res.status(403).json({ error: 'Unauthorized: Wallet does not own this agent' });
        }

        // 2. Retrieve memory
        const memory = await memoryService.getMemory(agentId);

        // 3. Generate response
        const response = await llmService.generateResponse(message, memory);

        // 4. Update memory (async)
        await memoryService.updateMemory(agentId, message, response);

        res.json({ reply: response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
