const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not set in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct listModels on genAI instance in some versions, 
        // but let's try to infer or use the model endpoint if possible.
        // Actually, the SDK might not expose listModels directly on the main class in this version.
        // Let's try to just run a generation with a very basic model name 'gemini-pro' 
        // and catch the error to see if it lists models in the error message (it often does).

        // Alternatively, we can use the model 'gemini-1.0-pro' which is often the canonical name.
        console.log("Testing model: gemini-1.0-pro");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.0-pro");
        console.log(result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.0-pro:", error.message);
    }

    try {
        console.log("Testing model: gemini-1.5-flash-latest");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash-latest");
    } catch (error) {
        console.error("Error with gemini-1.5-flash-latest:", error.message);
    }
}

listModels();
