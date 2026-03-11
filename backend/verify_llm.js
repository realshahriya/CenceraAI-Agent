require('dotenv').config();
const { llmService } = require('./services/llm');

async function testASI() {
    console.log("Testing ASI-1 Mini Integration...");
    try {
        const response = await llmService.generateResponse("Hello Cencera, who are you?", "The user just arrived.");
        console.log("\n--- ASI Response ---");
        console.log(response);
        console.log("--------------------\n");
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testASI();
