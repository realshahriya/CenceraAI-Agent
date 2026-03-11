const { membaseService } = require('./membase');

class MemoryService {
    constructor() {
        // Simple short-term memory store (agentId -> array of messages)
        // Keeps the immediate conversation context fast and cheap.
        this.cache = new Map();
    }

    async getMemory(agentId) {
        if (!this.cache.has(agentId)) {
            // In a production system, you might fetch recent history from a DB here.
            this.cache.set(agentId, []);
        }
        
        const history = this.cache.get(agentId);
        
        if (history.length === 0) {
            return "No previous memories.";
        }

        // Format history nicely for the LLM
        return history.map(msg => msg).join('\n');
    }

    async updateMemory(agentId, userMessage, aiResponse) {
        if (!this.cache.has(agentId)) {
            this.cache.set(agentId, []);
        }

        // 1. Update Short-Term Cache
        const history = this.cache.get(agentId);
        history.push(`User: ${userMessage}`);
        history.push(`Agent: ${aiResponse}`);

        // Keep cache manageable (e.g., last 20 messages)
        if (history.length > 40) {
            this.cache.set(agentId, history.slice(history.length - 40));
        }

        // 2. Persist to Unibase Membase
        try {
            console.log(`[MemoryService] Archiving conversation to Membase for Agent ${agentId}...`);
            // We combine the interaction into one payload for the bridge
            const payload = {
                agentId: agentId,
                timestamp: Date.now(),
                type: "CONVERSATION_HISTORY",
                content: `User: ${userMessage}\nAgent: ${aiResponse}`
            };

            // Async trigger membase upload, don't await so we don't block user response
            membaseService.uploadMemory(payload).catch(err => {
                console.error(`[Membase] Background upload failed: ${err.message}`);
            });

        } catch (err) {
            console.error("[MemoryService] Membase update error:", err);
        }
    }

    async getKnownAgents() {
        return Array.from(this.cache.keys());
    }
}

module.exports = { memoryService: new MemoryService() };
