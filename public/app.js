document.addEventListener('DOMContentLoaded', function() {
    const stockForm = document.getElementById('stockForm');
    const stocksList = document.getElementById('stocksList');

    loadStocks();

    stockForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            symbol: document.getElementById('symbol').value,
            name: document.getElementById('name').value,
            price_target_high: parseFloat(document.getElementById('highTarget').value) || null,
            price_target_low: parseFloat(document.getElementById('lowTarget').value) || null
        };

        try {
            const response = await fetch('/api/stocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                stockForm.reset();
                loadStocks();
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            alert('Network error: ' + error.message);
        }
    });

    async function loadStocks() {
        try {
            const response = await fetch('/api/stocks');
            const stocks = await response.json();

            if (stocks.length === 0) {
                stocksList.innerHTML = '<p>No stocks being monitored yet.</p>';
                return;
            }

            stocksList.innerHTML = stocks.map(stock => `
                <div class="stock-item">
                    <div class="stock-info">
                        <div class="stock-symbol">${stock.symbol}</div>
                        ${stock.name ? `<div class="stock-name">${stock.name}</div>` : ''}
                        <div class="stock-targets">
                            ${stock.price_target_high ? `High: $${stock.price_target_high}` : ''}
                            ${stock.price_target_high && stock.price_target_low ? ' | ' : ''}
                            ${stock.price_target_low ? `Low: $${stock.price_target_low}` : ''}
                        </div>
                    </div>
                    <button class="delete-btn" onclick="deleteStock(${stock.id})">Delete</button>
                </div>
            `).join('');
        } catch (error) {
            stocksList.innerHTML = '<p>Error loading stocks: ' + error.message + '</p>';
        }
    }

    window.deleteStock = async function(id) {
        if (!confirm('Are you sure you want to delete this stock?')) {
            return;
        }

        try {
            const response = await fetch(`/api/stocks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadStocks();
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            alert('Network error: ' + error.message);
        }
    };
});