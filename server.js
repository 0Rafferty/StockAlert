const express = require('express');
const path = require('path');
const cron = require('node-cron');
const { initializeDatabase } = require('./database');
const stocksRouter = require('./routes/stocks');
const { updateStockPrices } = require('./services/priceChecker');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

initializeDatabase();

app.use('/api/stocks', stocksRouter);

cron.schedule('*/5 * * * *', () => {
    updateStockPrices();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`StockAlert server running on port ${PORT}`);
    console.log('Price monitoring scheduled every 5 minutes');
});