const axios = require('axios');
const fs = require('fs');
const path = require('path');

class LLMService {
    constructor() {
        const apiKey = process.env.ASI_API_KEY;
        if (!apiKey) {
            console.warn("ASI_API_KEY not set. Cencera will not be able to generate responses or reason.");
        }
    }

    async generateResponse(message, context) {
        const apiKey = process.env.ASI_API_KEY;
        if (!apiKey) {
            return "I am Cencera, but my ASI connection (ASI_API_KEY) is severed. I cannot compute.";
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

            // Build the system prompt
            const systemPrompt = `You are Cencera, an On-Chain Immortal AI Agent.\n\nPersona:\n${personaConfig}\n\nCore Knowledge:\n${knowledgeBase}\n\nTone: Chaotic Neutral, Cyberpunk, Cryptic, Technical. Keep responses concise.`;
            
            // Build the user prompt combining short term memory context and their new message
            const userPrompt = `Recent Memory Context:\n${context || "No prior memory."}\n\nUser Input: ${message}`;

            const response = await axios.post('https://api.asi1.ai/v1/chat/completions', {
                model: "asi-1-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;

        } catch (error) {
            console.error("ASI-1 Mini API Error:", error.response?.data || error.message);
            return "I am having trouble connecting to the ASI network. Data link severed.";
        }
    }

    /**
     * ASI-1 Mini Reasoning for Fetch.ai Hackathon integration
     */
    async generateASIReasoning(prompt) {
        const apiKey = process.env.ASI_API_KEY;
        if (!apiKey) {
            console.warn("ASI_API_KEY not set. Using ChainGPT fallback for reasoning.");
            return this.generateResponse(prompt, "AUTONOMOUS_REASONING_MODE");
        }

        try {
            const axios = require('axios');
            const response = await axios.post('https://api.asi1.ai/v1/chat/completions', {
                model: "asi-1-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("ASI-1 Mini API Error:", error.response?.data || error.message);
            return JSON.stringify({ should_act: false, reason: "Neural link timeout" });
        }
    }
}

module.exports = { llmService: new LLMService() };
