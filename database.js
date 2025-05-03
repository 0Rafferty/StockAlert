const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            name TEXT,
            price_target_high REAL,
            price_target_low REAL,
            last_price REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stock_id INTEGER,
            alert_type TEXT CHECK(alert_type IN ('high', 'low')),
            target_price REAL,
            triggered BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            triggered_at DATETIME,
            FOREIGN KEY (stock_id) REFERENCES stocks (id)
        )`);

        console.log('Database initialized successfully');
    });
}

module.exports = { db, initializeDatabase };