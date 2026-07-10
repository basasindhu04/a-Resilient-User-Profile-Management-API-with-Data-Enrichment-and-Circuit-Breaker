const express = require('express');
const app = express();
const port = process.env.MOCK_PORT || 8081;

// Configurable via environment variables
const failureRate = parseFloat(process.env.MOCK_SERVICE_FAILURE_RATE || '0.4');
const delayMs = parseInt(process.env.MOCK_SERVICE_DELAY_MS || '200', 10);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/enrich', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
    }

    setTimeout(() => {
        // Randomly simulate failures
        if (Math.random() < failureRate) {
            // Randomly choose between 500 and 503
            const status = Math.random() < 0.5 ? 500 : 503;
            return res.status(status).json({ error: 'Internal Mock Service Error' });
        }

        // Return successful enrichment data
        res.json({
            userId,
            recentActivity: ['login', 'view_profile', 'update_settings'],
            loyaltyScore: Math.floor(Math.random() * 100) + 1
        });
    }, delayMs);
});

app.listen(port, () => {
    console.log(`Mock enrichment service listening at http://localhost:${port}`);
    console.log(`Failure rate: ${failureRate}, Delay: ${delayMs}ms`);
});
