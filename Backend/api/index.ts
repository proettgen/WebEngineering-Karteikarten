import express from 'express';
import folderRoutes from '../src/routes/folderRoutes';
import cardRoutes from '../src/routes/cardRoutes';
import { globalErrorHandler } from '../src/utils/errorHandler';
import { AppError } from '../src/utils/AppError';
import 'dotenv/config';

const app = express();

// CORS middleware - MUST be before other routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    
    next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger Documentation
// JSON-Endpunkt für Swagger-Spec (funktioniert auf Vercel)
import fs from 'fs';
import path from 'path';
import { staticSwaggerSpec } from '../src/config/staticSwagger.js';

// ...existing code...

app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Try to load generated swagger file (created by build script)
    const generatedSwaggerPath = path.join(__dirname, '../src/config/generated-swagger.json');
    
    try {
        if (fs.existsSync(generatedSwaggerPath)) {
            const generatedSwagger = fs.readFileSync(generatedSwaggerPath, 'utf8');
            const parsedSwagger = JSON.parse(generatedSwagger) as Record<string, unknown>;
            console.log('📄 Serving generated Swagger documentation');
            res.json(parsedSwagger);
            return;
        }
    } catch (error) {
        console.warn('⚠️  Failed to load generated swagger file:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Fallback to static spec if generated file doesn't exist or can't be parsed
    console.log('📄 Serving static Swagger documentation (fallback)');
    res.json(staticSwaggerSpec);
});

// Swagger UI Redirect (für externe Swagger UI)
app.get('/api-docs', (req, res) => {
    const swaggerUrl = `https://petstore.swagger.io/?url=${encodeURIComponent('https://web-engineering-karteikarten.vercel.app/api-docs/swagger.json')}`;
    res.redirect(swaggerUrl);
});

// Fallback: Swagger UI mit CDN (falls swagger-ui-express nicht funktioniert)
app.get('/api-docs/ui', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Karteikarten API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
        <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {
                SwaggerUIBundle({
                    url: '/api-docs/swagger.json',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout"
                });
            };
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

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
app.use('/api/cards', cardRoutes);

// Catch-all route for 404 Not Found errors
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start the server (only when not in Vercel environment)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}

export default app;