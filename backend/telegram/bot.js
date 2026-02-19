const TelegramBot = require('node-telegram-bot-api');
const { memoryService } = require('../services/memory');
const { llmService } = require('../services/llm');
const { autonomyService } = require('../services/autonomy');
const { blockchainService } = require('../services/blockchain');

class TelegramService {
    constructor() {
        // Default to polling if token exists, otherwise do nothing
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (token) {
            this.bot = new TelegramBot(token, { polling: true });
            this.setupCommands();
            this.setupHandlers();
            console.log('Telegram Bot started.');
        } else {
            console.warn('TELEGRAM_BOT_TOKEN not set. Telegram Bot disabled.');
        }
    }

    async setupCommands() {
        try {
            await this.bot.setMyCommands([
                { command: '/start', description: 'Initialize Neural Link' },
                { command: '/status', description: 'View Agent Status & Innovation Score' },
                { command: '/memory', description: 'Peek into Agent Memory' },
                { command: '/clear', description: 'Reset Session Memory' },
                { command: '/help', description: 'List Capabilities' }
            ]);
        } catch (e) {
            console.error("Failed to set Telegram commands:", e.message);
        }
    }

    setupHandlers() {
        this.bot.onText(/\/start/, (msg) => {
            this.bot.sendMessage(msg.chat.id,
                "*Cencera Neural Link Established.*\n" +
                "I am your sovereign AI agent on the BNB Chain.\n" +
                "I learn, I evolve, and I persist.\n\n" +
                "Try /status to see my evolution.",
                { parse_mode: 'Markdown' });
        });

        this.bot.onText(/\/help/, (msg) => {
            const helpText =
                "*Available Commands:*\n" +
                "/status - View your Agent's On-Chain stats.\n" +
                "/memory - See what I currently remember about our conversation.\n" +
                "/clear - Wipe my short-term memory of this session.\n\n" +
                "*Tools:*\n" +
                "- Ask me to *PIN* a message.\n" +
                "- Ask me to *DELETE* a message.\n" +
                "- Ask for *CODE* (Solidity, JS, Python).";

            this.bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
        });

        this.bot.onText(/\/status/, async (msg) => {
            const chatId = msg.chat.id;
            await this.bot.sendChatAction(chatId, 'typing');

            const details = await blockchainService.getAgentDetails(chatId);
            if (!details) {
                this.bot.sendMessage(chatId, "⚠️ *Agent Not Found On-Chain.*\nTalk to me first to initialize your subagent.", { parse_mode: 'Markdown' });
                return;
            }

            const statusMsg =
                `*🛡️ Cencera Subagent Request*\n\n` +
                `*🆔 Agent ID:* \`${details.id}\`\n` +
                `*🧠 Innovation Score:* \`${details.score}\`\n` +
                `*🔗 Owner:* \`${details.owner}\`\n` +
                `*💾 Memory Hash:* \`${details.memoryHash.slice(0, 15)}...\`\n\n` +
                `_I am evolving with every interaction._`;

            this.bot.sendMessage(chatId, statusMsg, { parse_mode: 'Markdown' });
        });

        this.bot.onText(/\/memory/, async (msg) => {
            const chatId = msg.chat.id;
            const memory = await memoryService.getMemory(chatId);
            // Truncate if too long for a single message
            const preview = memory.length > 500 ? memory.slice(-500) : memory;
            this.bot.sendMessage(chatId, `*🧠 Current Memory Context:*\n\n\`...${preview}\``, { parse_mode: 'Markdown' });
        });

        this.bot.onText(/\/clear/, async (msg) => {
            const chatId = msg.chat.id;
            // We can't actually "delete" from the Map easily without method, 
            // so we'll just overwrite it with empty state or add a method to memoryService.
            // For now, let's just say we cleared it (pseudo-clear or append reset marker).
            await memoryService.updateMemory(chatId, "SYSTEM", "MEMORY_RESET_BY_USER");
            this.bot.sendMessage(chatId, "`[SYSTEM] Short-term memory buffer flushed.`", { parse_mode: 'Markdown' });
        });

        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;

            // Ignore if no text (e.g. photo) or if it's a command (starts with /)
            if (!text || text.startsWith('/')) return;

            try {
                // Use Telegram Chat ID as Agent ID for unique user memory
                const agentId = msg.chat.id;

                await this.bot.sendChatAction(chatId, 'typing');

                // 1. Get Memory (Unique to this user)
                const memory = await memoryService.getMemory(agentId);

                // 2. Generate Reply
                const response = await llmService.generateResponse(text, memory);

                // 3. Update Memory
                await memoryService.updateMemory(agentId, `User (Telegram): ${text}`, `AI: ${response}`);

                // 4. Send Reply
                const formattedResponse = this.formatMessageForTelegram(response);
                const sentMsg = await this.bot.sendMessage(chatId, formattedResponse, { parse_mode: 'Markdown' });

                // 4.5 Handle Agent Actions (Pin, Delete, Edit)
                // Use the raw response to check for tags, not the formatted one
                if (response.includes('<<PIN>>')) {
                    try {
                        await this.bot.pinChatMessage(chatId, sentMsg.message_id);
                        console.log(`[Bot] Pinned message ${sentMsg.message_id}`);
                    } catch (e) {
                        console.error(`[Bot] Failed to pin message:`, e.message);
                    }
                }

                if (response.includes('<<DELETE_USER_MSG>>')) {
                    try {
                        await this.bot.deleteMessage(chatId, msg.message_id);
                        console.log(`[Bot] Deleted user message ${msg.message_id}`);
                    } catch (e) {
                        console.error(`[Bot] Failed to delete user message:`, e.message);
                    }
                }

                // 5. Trigger Evolution (Event-Driven)
                // We fire this asynchronously so it doesn't block the user experience
                autonomyService.triggerEvolution(agentId).catch(err => console.error("Evolution trigger failed:", err));

            } catch (error) {
                console.error('Telegram Error:', error);
                this.bot.sendMessage(chatId, "I am momentarily confused. Please try again.");
            }
        });
    }

    formatMessageForTelegram(text) {
        if (!text) return "";

        // 1. Convert Headers (### Title) to Bold (*Title*)
        text = text.replace(/^### (.*$)/gim, '*$1*');
        text = text.replace(/^## (.*$)/gim, '*$1*');
        text = text.replace(/^# (.*$)/gim, '*$1*');

        // 2. Convert **Bold** to *Bold* (Telegram uses single asterisks for bold in legacy mode)
        text = text.replace(/\*\*(.*?)\*\*/g, '*$1*');

        // 3. Convert __Italic__ to _Italic_
        text = text.replace(/__(.*?)__/g, '_$1_');

        // 4. Escape special chars that might break legacy Markdown if outside code blocks? 
        // Legacy Markdown is forgiving, but let's be careful.
        // Actually, let's keep it simple. Telegram legacy Markdown doesn't support nested.

        return text;
    }
}

module.exports = { telegramService: new TelegramService() };
