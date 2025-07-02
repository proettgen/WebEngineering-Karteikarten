// generateSwagger.ts
// Swagger Documentation Generator for Team Usage

// This script generates API documentation from JSDoc comments in route files.
// It solves the Vercel serverless deployment issue while keeping docs in source code.

// GOALS:
// - Keep API documentation synchronized with code
// - Generate static files compatible with Vercel
// - Enable team-friendly documentation workflow
// - Provide always up-to-date API docs for frontend team

// WORKFLOW:

// STEP 1: Write JSDoc comments in route files
// - Location: src/routes/cardRoutes.ts, src/routes/folderRoutes.ts
// - Format: /** @swagger ... */ directly above each route definition
// - Use YAML syntax for OpenAPI specification

// STEP 2: Generate documentation
// - Command: npm run generate-swagger
// - This creates: src/config/generated-swagger.json
// - Run this BEFORE every commit and deployment!

// STEP 3: Commit and deploy
// - Always commit the generated swagger.json file
// - Vercel automatically serves it at /api/api-docs/swagger.json
// - Team can view docs at: https://petstore.swagger.io/?url=https://your-vercel-url.vercel.app/api/api-docs/swagger.json

// JSDoc EXAMPLE (copy this format for new endpoints):

/*
Example route documentation:

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new flashcard
 *     description: Creates a new flashcard and assigns it to a folder
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, question, answer, folderId]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: "JavaScript Closures"
 *               question:
 *                 type: string
 *                 example: "What is a closure in JavaScript?"
 *               answer:
 *                 type: string
 *                 example: "A closure is a function that has access to variables from its outer scope"
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 example: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "closures", "advanced"]
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     card:
 *                       $ref: '#/components/schemas/Card'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /
router.post('/cards', cardController.createCard);
*/

//IMPORTANT RULES:

// 1. JSDoc placement: ALWAYS write /** @swagger ... */ directly above the route definition
//    NOT above the controller function!

// 2. YAML syntax: Pay attention to indentation (use spaces, not tabs)
//    Wrong: tabs or mixed indentation
//    Right: consistent 2-space indentation

// 3. Required fields: Always specify required fields in request bodies

// 4. Examples: Provide realistic examples for all properties

// 5. Error responses: Document common error cases (400, 404, 500)

// 6. Tags: Use consistent tags to group related endpoints ([Cards], [Folders])

// TROUBLESHOOTING:

// Problem: Script fails with syntax error
// Solution: Check YAML indentation in JSDoc comments (spaces only!)

// Problem: Documentation not updating
// Solution: Run npm run generate-swagger before deployment

// Problem: Endpoints missing from docs
// Solution: Ensure @swagger JSDoc is directly above route definition

// Problem: Vercel doesn't serve updated docs
// Solution: Commit generated-swagger.json file and redeploy

// IMPORTANT FILES:
// - src/routes/*.ts → Write JSDoc comments here
// - src/config/generated-swagger.json → Generated file (commit this!)
// - src/config/staticSwagger.ts → Fallback if generation fails
// - api/index.ts → Serves documentation at /api/api-docs/swagger.json

//  DEPLOYMENT CHECKLIST:
// □ Updated JSDoc comments for changed/new endpoints
// □ Ran npm run generate-swagger
// □ Committed generated-swagger.json
// □ Tested locally at http://localhost:3001/api/docs
// □ Pushed to repository
// □ Verified docs at production URL

// JSDoc Example for new endpoints:
/*
/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, question, answer, folderId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "JavaScript Closures"
 *     responses:
 *       201:
 *         description: Card created successfully
 * /
*/

// IMPORTANT: Always run this script before deploying to Vercel!
// View docs at: https://petstore.swagger.io/?url=https://your-vercel-url.vercel.app/api/api-docs/swagger.json

import swaggerJsdoc from 'swagger-jsdoc';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Swagger configuration - matches the original dynamic setup
const swaggerOptions = {
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
    // Route files to scan for @swagger comments
    apis: [
        './src/routes/*.ts',
        './src/routes/**/*.ts',
    ],
};

/**
 * Generate static swagger.json file
 * This function creates a swagger.json that works with Vercel's serverless environment
 */
function generateSwaggerJson(): void {
    try {
        console.log(' Generating Swagger documentation...');
        
        // Generate OpenAPI specification from JSDoc comments
        const specs = swaggerJsdoc(swaggerOptions);
        
        // Write to static file that Vercel can serve
        const outputPath = join(__dirname, '../src/config/generated-swagger.json');
        writeFileSync(outputPath, JSON.stringify(specs, null, 2));
        
        console.log(' Swagger documentation generated successfully!');
        console.log(` Output: ${outputPath}`);
        console.log(' Ready for Vercel deployment!');
        
        // Log some stats for team visibility
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        const specsAny = specs as any;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const pathCount = Object.keys(specsAny.paths || {}).length;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const schemaCount = Object.keys(specsAny.components?.schemas || {}).length;
        console.log(` Generated ${pathCount} API endpoints and ${schemaCount} schemas`);
        
    } catch (error) {
        console.error(' Error generating Swagger documentation:');
        console.error(error);
        process.exit(1);
    }
}

/**
 * CLI execution
 * Run this script directly with: npm run generate-swagger
 */
if (require.main === module) {
    generateSwaggerJson();
}

export { generateSwaggerJson };
