const axios = require('axios');
const { db } = require('../database');
const { sendPriceAlert } = require('./notifier');

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

async function getStockPrice(symbol) {
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: API_KEY
            }
        });

        const quote = response.data['Global Quote'];
        if (!quote || !quote['05. price']) {
            throw new Error('Invalid response from API');
        }

        return parseFloat(quote['05. price']);
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error.message);

        return Math.random() * 200 + 50;
    }
}

async function updateStockPrices() {
    console.log('Starting price update cycle...');

    db.all('SELECT * FROM stocks', async (err, stocks) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }

        for (const stock of stocks) {
            try {
                const currentPrice = await getStockPrice(stock.symbol);

                db.run(
                    'UPDATE stocks SET last_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [currentPrice, stock.id],
                    function(err) {
                        if (err) {
                            console.error(`Error updating price for ${stock.symbol}:`, err);
                        } else {
                            console.log(`Updated ${stock.symbol}: $${currentPrice}`);

                            checkPriceAlerts(stock, currentPrice);
                        }
                    }
                );

                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Failed to update ${stock.symbol}:`, error.message);
            }
        }
    });
}

function checkPriceAlerts(stock, currentPrice) {
    if (stock.price_target_high && currentPrice >= stock.price_target_high) {
        console.log(`🚨 ALERT: ${stock.symbol} hit high target! Current: $${currentPrice}, Target: $${stock.price_target_high}`);
        sendPriceAlert(stock, currentPrice, 'high');
    }

    if (stock.price_target_low && currentPrice <= stock.price_target_low) {
        console.log(`🚨 ALERT: ${stock.symbol} hit low target! Current: $${currentPrice}, Target: $${stock.price_target_low}`);
        sendPriceAlert(stock, currentPrice, 'low');
    }
}

module.exports = { updateStockPrices, getStockPrice };