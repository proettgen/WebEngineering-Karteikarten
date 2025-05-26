import { Response, ErrorRequestHandler } from 'express';
import { AppError } from './AppError';

// Helper function to send operational error responses
const handleOperationalError = (err: AppError, res: Response): void => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

// Global error handler middleware
// Explicitly typed with ErrorRequestHandler and ensuring a void return type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // Ensure 'err' can be an instance of AppError or a generic Error
    const error = err instanceof AppError ? err : new AppError( (err as Error).message || 'An unexpected error occurred', 500);

    if (error.isOperational) {
        handleOperationalError(error, res);
    } else {
        // For non-operational errors, log them (especially in development)
        // and send a generic message to the client.
        console.error('UNEXPECTED ERROR 💥:', err); // Log the original error for server-side inspection

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong on the server!',
        });
    }
    // No explicit return is needed as res.json() sends the response and ends the cycle.
    // The function implicitly returns void.
};