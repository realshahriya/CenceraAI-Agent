require('dotenv').config();
// Trigger restart for .env update
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3001;
const chatRoute = require('./routes/chat');
const agentRoute = require('./routes/agent');

app.use(cors());
app.use(express.json());

app.use('/chat', chatRoute);
app.use('/agent', agentRoute);

app.get('/', (req, res) => {
    res.send('// Cencera Backend Services running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start autonomous loop
    const { autonomyService } = require('./services/autonomy');
    autonomyService.start();

    // Start Twitter Agent schedule (Run once a day at 9:00 AM)
    const { twitterAgentService } = require('./services/twitter_agent');
    cron.schedule('0 9 * * *', () => {
        console.log("Running scheduled Twitter Agent task...");
        twitterAgentService.start();
    });

    // Start Telegram Bot
    require('./telegram/bot');
});
