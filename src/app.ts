import 'reflect-metadata';
import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { initDatabase } from './config/database';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint for docker/k8s
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Error handling middleware
app.use(errorHandler);

// Database Initialization and Server Start
if (process.env.NODE_ENV !== 'test') {
    initDatabase().then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }).catch(err => {
        console.error('Failed to initialize database', err);
        process.exit(1);
    });
}

export default app; // Export for testing
