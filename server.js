const express = require('express');
const path = require('path');
const { initializeDatabase } = require('./database');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

initializeDatabase();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`StockAlert server running on port ${PORT}`);
});