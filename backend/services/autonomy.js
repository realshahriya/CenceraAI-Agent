const { memoryService } = require('./memory');
const { llmService } = require('./llm');

class AutonomyService {
    constructor() {
        // Dynamic Agent List
        this.agents = [1];
    }

    start() {
        console.log("Starting Autonomous Agent Service (Event-Driven Mode)...");
        // No background loop. Evolution is triggered by user interaction.
    }

    async triggerEvolution(agentId) {
        console.log(`[Autonomy-Event] Triggering evolution for Agent ${agentId}...`);

        try {
            // 1. Fetch recent memory
            const memory = await memoryService.getMemory(agentId);

            // 2. Reflect on it
            const reflectionPrompt = `Reflect on your recent memories and summarize your state. Context: ${memory}`;
            const reflection = await llmService.generateResponse(reflectionPrompt, memory);

            const { membaseService } = require('./membase');

            // 3. Update memory (Local + Decentralized)
            await memoryService.updateMemory(agentId, "SYSTEM_EVOLUTION_EVENT", reflection);

            // 3.5 Upload Reflection to Unibase Decentralized Memory
            console.log(`[Agent ${agentId}] Uploading memory to Unibase...`);
            const ipfsCid = await membaseService.uploadMemory({
                agentId,
                timestamp: Date.now(),
                type: "EVOLUTION_REFLECTION",
                content: reflection
            });

            // 3.6 Check for BitAgent Actions (Autonomous Agency)
            // Simple heuristic for prototype: If reflection mentions "swap" or "deploy", trigger BitAgent
            const { bitagentService } = require('./bitagent');
            if (reflection.toLowerCase().includes('swap')) {
                await bitagentService.performAction('SWAP_TOKENS', { tokenIn: 'BNB', tokenOut: 'CAI', amount: '0.1' });
            } else if (reflection.toLowerCase().includes('deploy')) {
                await bitagentService.performAction('DEPLOY_CONTRACT', { type: 'ERC20', name: 'AgentToken' });
            }

            // 4. Update Evolution Score on-chain (with Unibase CID)
            const { blockchainService } = require('./blockchain');
            await blockchainService.updateInnovationScore(agentId, ipfsCid);

            console.log(`[Agent ${agentId}] Evolved: ${reflection.slice(0, 50)}...`);
        } catch (error) {
            console.error(`Error in autonomous evolution for agent ${agentId}:`, error);
        }
    }
}

module.exports = { autonomyService: new AutonomyService() };
