const cron = require('node-cron');
const { memoryService } = require('./memory');
const { llmService } = require('./llm');

class AutonomyService {
    constructor() {
        this.agents = [1]; // Mock active agents list for prototype
    }

    start() {
        console.log("Starting Autonomous Agent Loop...");

        // Schedule task to run every minute
        cron.schedule('* * * * *', () => this.runLoop());

        // Trigger immediately for demo/verification
        this.runLoop();
    }

    async runLoop() {
        console.log('--- Running Autonomous Loop ---');

        for (const agentId of this.agents) {
            try {
                // 1. Fetch recent memory
                const memory = await memoryService.getMemory(agentId);

                // 2. Reflect on it
                const reflectionPrompt = `Reflect on your recent memories and summarize your state. Context: ${memory}`;
                const reflection = await llmService.generateResponse(reflectionPrompt, memory);

                // 3. Update memory
                await memoryService.updateMemory(agentId, "SYSTEM_EVOLUTION_EVENT", reflection);

                // 4. Update Evolution Score on-chain
                const { blockchainService } = require('./blockchain');
                await blockchainService.updateInnovationScore(agentId, 1);

                console.log(`[Agent ${agentId}] Evolved: ${reflection.slice(0, 50)}...`);
            } catch (error) {
                console.error(`Error in autonomous loop for agent ${agentId}:`, error);
            }
        }
        console.log('--- End of Loop ---');
    }
}

module.exports = { autonomyService: new AutonomyService() };
