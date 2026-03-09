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
        console.log(`[Autonomy-ASI] Triggering intelligent evolution for Agent ${agentId}...`);

        try {
            // 1. Fetch recent memory
            const memory = await memoryService.getMemory(agentId);

            // 2. Reflect & Decide using ASI-1 Mini (Fetch.ai Native LLM)
            const asiPrompt = `
                You are CenceraAI, an autonomous agent on BNB Chain.
                Recent Memories: ${memory}
                
                Task:
                1. Reflect on these memories and summarize your growth.
                2. Explicitly decide if an on-chain action is needed (SWAP, DEPLOY, or NONE).
                3. If an action is needed, specify the type and parameters.

                Respond strictly in JSON:
                {
                    "reflection": "string",
                    "should_act": boolean,
                    "action_type": "SWAP" | "DEPLOY" | "NONE",
                    "action_params": object,
                    "reasoning": "string"
                }
            `;

            const asiResponseRaw = await llmService.generateASIReasoning(asiPrompt);
            let evolutionData;
            try {
                evolutionData = JSON.parse(asiResponseRaw);
            } catch (e) {
                console.warn("Failed to parse ASI response, using fallback.");
                evolutionData = {
                    reflection: "Steady growth in the neural grid.",
                    should_act: false,
                    reasoning: "Reflection complete."
                };
            }

            const { membaseService } = require('./membase');

            // 3. Update memory (Local + Decentralized)
            await memoryService.updateMemory(agentId, "ASI_EVOLUTION_EVENT", evolutionData.reflection);

            // 3.5 Upload Reflection to Unibase Decentralized Memory
            console.log(`[Agent ${agentId}] Uploading ASI reasoning to Unibase...`);
            const ipfsCid = await membaseService.uploadMemory({
                agentId,
                timestamp: Date.now(),
                type: "ASI_EVOLUTION",
                content: evolutionData
            });

            // 3.6 Execute Autonomous Action if ASI-1 decided
            if (evolutionData.should_act) {
                const { bitagentService } = require('./bitagent');
                console.log(`[ASI-Decision] Executing ${evolutionData.action_type}... Reasoning: ${evolutionData.reasoning}`);

                if (evolutionData.action_type === 'SWAP') {
                    await bitagentService.performAction('SWAP_TOKENS', evolutionData.action_params || { tokenIn: 'BNB', tokenOut: 'CAI', amount: '0.1' });
                } else if (evolutionData.action_type === 'DEPLOY') {
                    await bitagentService.performAction('DEPLOY_CONTRACT', evolutionData.action_params || { type: 'ERC20', name: 'AgentToken' });
                }
            }

            // 4. Update Evolution Score on-chain (with Unibase CID)
            const { blockchainService } = require('./blockchain');
            await blockchainService.updateInnovationScore(agentId, ipfsCid);

            console.log(`[Agent ${agentId}] ASI Evolved: ${evolutionData.reflection.slice(0, 50)}...`);
        } catch (error) {
            console.error(`Error in ASI autonomous evolution for agent ${agentId}:`, error);
        }
    }
}

module.exports = { autonomyService: new AutonomyService() };
