const TelegramBot = require('node-telegram-bot-api');
const { memoryService } = require('../services/memory');
const { llmService } = require('../services/llm');

class TelegramService {
    constructor() {
        // Default to polling if token exists, otherwise do nothing
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (token) {
            this.bot = new TelegramBot(token, { polling: true });
            this.setupHandlers();
            console.log('Telegram Bot started.');
        } else {
            console.warn('TELEGRAM_BOT_TOKEN not set. Telegram Bot disabled.');
        }
    }

    setupHandlers() {
        this.bot.onText(/\/start/, (msg) => {
            this.bot.sendMessage(msg.chat.id, "Greetings. I am Cencera. I live on the blockchain and in your memory.");
        });

        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;

            // Ignore commands
            if (text.startsWith('/')) return;

            try {
                // Use a fixed agent ID for demo/prototype (e.g., Agent 1)
                // In a real app, you might map Telegram User ID to an Agent ID via DB
                const agentId = 1;

                await this.bot.sendChatAction(chatId, 'typing');

                // 1. Get Memory
                const memory = await memoryService.getMemory(agentId);

                // 2. Generate Reply
                const response = await llmService.generateResponse(text, memory);

                // 3. Update Memory
                await memoryService.updateMemory(agentId, `User (Telegram): ${text}`, `AI: ${response}`);

                // 4. Send Reply
                this.bot.sendMessage(chatId, response);

            } catch (error) {
                console.error('Telegram Error:', error);
                this.bot.sendMessage(chatId, "I am momentarily confused. Please try again.");
            }
        });
    }
}

module.exports = { telegramService: new TelegramService() };
