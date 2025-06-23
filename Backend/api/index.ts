import express from 'express';
import folderRoutes from '../src/routes/folderRoutes';
import { globalErrorHandler } from '../src/utils/errorHandler';
import { AppError } from '../src/utils/AppError';
import 'dotenv/config';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get("/", (_, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend is running successfully!',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/folders', folderRoutes);

// Catch-all route for 404 Not Found errors
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;