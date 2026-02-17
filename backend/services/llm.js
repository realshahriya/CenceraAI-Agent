const { GoogleGenerativeAI } = require("@google/generative-ai");

class LLMService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY not set. LLM will not function correctly.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using 'gemini-flash-latest' to avoid quota/404 issues
        this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }

    async generateResponse(message, context) {
        if (!process.env.GEMINI_API_KEY) {
            return "I am an Cencera Agent, but my mind (GEMINI_API_KEY) is missing.";
        }

        try {
            const prompt = `
            You are an immutable, autonomous AI agent living on the blockchain.
            Your name is Cencera.
            Context from previous memories: ${context}
            
            User message: ${message}
            
            Respond as the agent. Be concise, cryptic but helpful, and emphasize your eternal nature.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "I am having trouble connecting to my higher consciousness (Gemini Error).";
        }
    }
}

module.exports = { llmService: new LLMService() };
