const { GeneralChat } = require("@chaingpt/generalchat");
const fs = require('fs');
const path = require('path');

class LLMService {
    constructor() {
        const apiKey = process.env.CHAINGPT_API_KEY;
        if (!apiKey) {
            console.warn("CHAINGPT_API_KEY not set. LLM will not function correctly.");
        }
        this.generalChat = new GeneralChat({
            apiKey: apiKey,
            chainId: 56, // BSC Mainnet or relevant chain
        });
    }

    async generateResponse(message, context) {
        if (!process.env.CHAINGPT_API_KEY) {
            return "I am Cencera, but my connection to the Chain (CHAINGPT_API_KEY) is severed.";
        }

        try {
            // Read persona from external file
            const personaPath = path.join(__dirname, '../agent_persona.txt');
            let personaConfig = "";
            try {
                personaConfig = fs.readFileSync(personaPath, 'utf8');
            } catch (err) {
                console.error("Error reading agent_persona.txt:", err);
                personaConfig = "You are Cencera.";
            }

            // Read knowledge base from external file
            const knowledgePath = path.join(__dirname, '../knowledge_base.txt');
            let knowledgeBase = "";
            try {
                knowledgeBase = fs.readFileSync(knowledgePath, 'utf8');
            } catch (err) {
                console.error("Error reading knowledge_base.txt:", err);
                knowledgeBase = "";
            }

            // Note: GeneralChat SDK handles context different than raw prompts.
            // We'll use customContext to inject the persona.

            const response = await this.generalChat.createChatBlob({
                question: message,
                chatHistory: "on",
                useCustomContext: true,
                contextInjection: {
                    companyName: "Cencera",
                    companyDescription: "On-Chain Immortal AI Agent",
                    purpose: personaConfig + "\n\nCore Knowledge:\n" + knowledgeBase, // Injecting persona + knowledge here
                    aiTone: "CUSTOM_TONE",
                    customTone: "Chaotic Neutral, Cyberpunk, Cryptic, Technical",
                }
            });

            if (response && response.data && response.data.bot) {
                return response.data.bot;
            } else {
                return "The Chain is silent.";
            }

        } catch (error) {
            console.error("ChainGPT API Error:", error);
            // Fallback provided for reliability
            return "I am having trouble connecting to the neural grid. Data link severed.";
        }
    }
}

module.exports = { llmService: new LLMService() };
