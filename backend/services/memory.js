class MemoryService {
    constructor() {
        this.memories = new Map(); // In-memory storage for prototype
    }

    async getMemory(agentId) {
        return this.memories.get(agentId) || "You are an immutable AI agent.";
    }

    async updateMemory(agentId, userMessage, aiResponse) {
        const currentMemory = await this.getMemory(agentId);
        const newContext = `${currentMemory}\nUser: ${userMessage}\nAgent: ${aiResponse}`;

        // Keep memory size manageable for prototype
        const truncatedMemory = newContext.length > 2000 ? newContext.slice(-2000) : newContext;

        this.memories.set(agentId, truncatedMemory);
        console.log(`Updated memory for Agent ${agentId}`);
    }
}

module.exports = { memoryService: new MemoryService() };
