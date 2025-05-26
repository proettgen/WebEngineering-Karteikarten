import express from 'express';
import folderRoutes from './api/routes/folderRoutes.js'; // Import the folder router
import { globalErrorHandler } from './utils/errorHandler.js'; // Import the global error handler
import { AppError } from './utils/AppError.js'; // Import AppError for handling 404

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (_, res) => {
    res.send("Hello express from a modular backend!");
});

app.use('/api/folders', folderRoutes);

// Catch-all route for 404 Not Found errors
// This should be after all your specific routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
// Express identifies this as an error handler because it has 4 parameters
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
