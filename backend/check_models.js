const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// We can't use the SDK to list models easily if the method isn't obvious.
// Let's use standard fetch to the API endpoint.

async function check() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("No key"); return; }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models returned. Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
check();
