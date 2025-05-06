const express = require('express');
const { db } = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
    db.all('SELECT * FROM stocks ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { symbol, name, price_target_high, price_target_low } = req.body;

    if (!symbol) {
        res.status(400).json({ error: 'Symbol is required' });
        return;
    }

    const stmt = db.prepare(`INSERT INTO stocks (symbol, name, price_target_high, price_target_low)
                             VALUES (?, ?, ?, ?)`);

    stmt.run([symbol.toUpperCase(), name, price_target_high, price_target_low], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        db.get('SELECT * FROM stocks WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json(row);
        });
    });

    stmt.finalize();
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM stocks WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }

        res.json({ message: 'Stock deleted successfully' });
    });
});

module.exports = router;