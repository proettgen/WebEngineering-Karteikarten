import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'WebEngineering Karteikarten API',
        version: '1.0.0',
        description: 'Eine REST API für die Verwaltung von Karteikarten und Ordnern',
        contact: {
            name: 'API Support',
            email: 'support@karteikarten-app.com',
        },
        },
        servers: [
        {
            url: 'https://web-engineering-karteikarten.vercel.app',
            description: 'Production server (Vercel)',
        },
        {
            url: 'http://localhost:3001',
            description: 'Development server',
        },
        ],
        components: {
        schemas: {
            Card: {
            type: 'object',
            required: ['title', 'question', 'answer', 'folderId'],
            properties: {
                id: {
                type: 'string',
                format: 'uuid',
                description: 'Eindeutige ID der Karteikarte',
                example: '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a',
                },
                title: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                description: 'Titel der Karteikarte',
                example: 'JavaScript Closures',
                },
                question: {
                type: 'string',
                minLength: 1,
                maxLength: 2000,
                description: 'Frage der Karteikarte',
                example: 'Was ist eine Closure in JavaScript?',
                },
                answer: {
                type: 'string',
                minLength: 1,
                maxLength: 2000,
                description: 'Antwort der Karteikarte',
                example: 'Eine Closure ist eine Funktion, die Zugriff auf Variablen aus ihrem äußeren Scope hat.',
                },
                currentLearningLevel: {
                type: 'integer',
                minimum: 0,
                maximum: 5,
                description: 'Aktueller Lernlevel (0-5)',
                example: 2,
                },
                createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Erstellungsdatum',
                example: '2024-05-01T08:00:00.000Z',
                },
                tags: {
                type: 'array',
                items: {
                    type: 'string',
                },
                nullable: true,
                description: 'Tags zur Kategorisierung',
                example: ['javascript', 'frontend', 'advanced'],
                },
                folderId: {
                type: 'string',
                format: 'uuid',
                description: 'ID des zugehörigen Ordners',
                example: 'c6f8fb2b-a33f-46da-941d-9832b6212395',
                },
            },
            },
            Folder: {
            type: 'object',
            required: ['name'],
            properties: {
                id: {
                type: 'string',
                format: 'uuid',
                description: 'Eindeutige ID des Ordners',
                example: 'c6f8fb2b-a33f-46da-941d-9832b6212395',
                },
                name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                description: 'Name des Ordners',
                example: 'JavaScript Grundlagen',
                },
                parentId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'ID des übergeordneten Ordners',
                example: 'parent-folder-uuid',
                },
                createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Erstellungsdatum',
                example: '2024-05-01T08:00:00.000Z',
                },
                lastOpenedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Letztes Öffnungsdatum',
                example: '2024-05-15T14:30:00.000Z',
                },
            },
            },
            Error: {
            type: 'object',
            properties: {
                status: {
                type: 'string',
                example: 'error',
                },
                message: {
                type: 'string',
                example: 'Validation failed',
                },
                errors: {
                type: 'array',
                items: {
                    type: 'string',
                },
                example: ['Title must not be empty'],
                },
            },
            },
        },
        },
    },
    apis: [
        './src/routes/*.ts', // Entwicklungsumgebung
        './dist/src/routes/*.js', // Produktionsumgebung (Vercel)
        'src/routes/*.ts', // Alternative für Vercel
    ],
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const specs = swaggerJsdoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Karteikarten API Docs',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
    },
};
