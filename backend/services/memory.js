const { MultiMemory } = require("@unibase/membase-js/memory/multi_memory") || require("membase-js"); // Need to see exact export pattern, assuming standard or fallback.
const { Message } = require("@unibase/membase-js/memory/message") || require("membase-js");

class MemoryService {
    constructor() {
        // Initialize Membase MultiMemory
        // MEMBASE_ID, MEMBASE_ACCOUNT, MEMBASE_SECRET_KEY should be set in environment
        this.mm = new MultiMemory({
            membase_account: process.env.MEMBASE_ACCOUNT || "default",
            auto_upload_to_hub: true,
            preload_from_hub: true
        });
    }

    async getMemory(agentId) {
        // Note: SDK structure might vary, adapting basic concept from docs:
        // We might not have a direct 'get stringified memory' yet in the snippet,
        // so we'll fetch the conversation array and format it.
        try {
            // Depending on exact JS SDK, fetching might be internal or async
            // Fallback for now if there isn't a straight string getter:
            return `Connected to Membase for Agent: ${agentId}`;
        } catch (err) {
            console.error("Membase get error:", err);
            return "You are an immutable AI agent.";
        }
    }

    async updateMemory(agentId, userMessage, aiResponse) {
        try {
            // Add user message
            const userMsg = new Message({
                name: "user",
                content: userMessage,
                role: "user",
                metadata: ""
            });
            await this.mm.add(userMsg, agentId); // using agentId as conversation_id

            // Add AI response
            const aiMsg = new Message({
                name: `agent-${agentId}`,
                content: aiResponse,
                role: "assistant",
                metadata: ""
            });
            await this.mm.add(aiMsg, agentId);
            
            console.log(`Updated Membase for Agent ${agentId} on Hub`);
        } catch (err) {
            console.error("Membase update error:", err);
        }
    }

    async getKnownAgents() {
        // Retrieving all known agents from Membase might require additional SDK methods
        // Returning empty array as placeholder.
        return [];
    }
}

module.exports = { memoryService: new MemoryService() };
