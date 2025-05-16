const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendDesktopNotification(title, message) {
    console.log(`💻 Desktop Notification: ${title}`);
    console.log(`   ${message}`);

}

async function sendEmailNotification(to, subject, message) {
    if (!process.env.EMAIL_USER) {
        console.log(`📧 Email would be sent to ${to}:`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Message: ${message}`);
        return;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message,
            html: `
                <h2>${subject}</h2>
                <p>${message}</p>
                <hr>
                <p><small>Sent by StockAlert</small></p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Email send failed:', error.message);
    }
}

function sendPriceAlert(stock, currentPrice, alertType) {
    const direction = alertType === 'high' ? 'above' : 'below';
    const target = alertType === 'high' ? stock.price_target_high : stock.price_target_low;

    const title = `${stock.symbol} Price Alert`;
    const message = `${stock.symbol} is now trading at $${currentPrice}, ${direction} your target of $${target}`;

    sendDesktopNotification(title, message);

    if (process.env.NOTIFICATION_EMAIL) {
        sendEmailNotification(
            process.env.NOTIFICATION_EMAIL,
            title,
            message
        );
    }
}

module.exports = {
    sendDesktopNotification,
    sendEmailNotification,
    sendPriceAlert
};