require('dotenv').config();
// Trigger restart for .env update
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const chatRoute = require('./routes/chat');

app.use(cors());
app.use(express.json());

app.use('/chat', chatRoute);

app.get('/', (req, res) => {
    res.send('// Cencera Backend Services running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start autonomous loop
    const { autonomyService } = require('./services/autonomy');
    autonomyService.start();

    // Start Telegram Bot
    require('./telegram/bot');
});
