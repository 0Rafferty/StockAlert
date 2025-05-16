# StockAlert

Personal stock price monitoring and alert system.

## Features

- Add stocks to monitor with custom price targets
- Real-time price checking every 5 minutes
- Desktop and email notifications when price targets are hit
- Simple web interface for stock management
- SQLite database for persistence

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment template:
```bash
cp .env.example .env
```

3. Configure your API keys and email settings in `.env`

4. Start the server:
```bash
npm start
```

5. Open http://localhost:3000 in your browser

## Configuration

- Get a free API key from Alpha Vantage for real stock prices
- Configure Gmail app password for email notifications
- Set your notification email address

## Usage

1. Add stocks with price targets via the web interface
2. The system will check prices every 5 minutes
3. You'll receive notifications when targets are hit
4. Monitor your portfolio through the web dashboard