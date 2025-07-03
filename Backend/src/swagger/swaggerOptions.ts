// Swagger configuration

//you can add reusable components here
// to avoid duplication in the swagger definition
// like schemas, security schemes, etc.

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WebEngineering Flashcards API",
      version: "1.0.0",
      description: "A REST API for managing flashcards and folders",
      contact: {
        name: "API Support",
        email: "support@karteikarten-app.com",
      },
    },
    servers: [
      {
        url: "https://web-engineering-karteikarten.vercel.app",
        description: "Production server (Vercel)",
      },
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in format: Bearer <token>",
        },
      },
      schemas: {
        Card: {
          type: "object",
          required: ["title", "question", "answer", "folderId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique ID of the flashcard",
              example: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              description: "Title of the flashcard",
              example: "JavaScript Closures",
            },
            question: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
              description: "Question on the flashcard",
              example: "What is a closure in JavaScript?",
            },
            answer: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
              description: "Answer on the flashcard",
              example:
                "A closure is a function that has access to variables from its outer scope.",
            },
            currentLearningLevel: {
              type: "integer",
              minimum: 0,
              maximum: 5,
              description: "Current learning level (0-5)",
              example: 2,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
              example: "2024-05-01T08:00:00.000Z",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              nullable: true,
              description: "Tags for categorization",
              example: ["javascript", "frontend", "advanced"],
            },
            folderId: {
              type: "string",
              format: "uuid",
              description: "ID of the associated folder",
              example: "c6f8fb2b-a33f-46da-941d-9832b6212395",
            },
          },
        },
        Folder: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique ID of the folder",
              example: "c6f8fb2b-a33f-46da-941d-9832b6212395",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description: "Name of the folder",
              example: "JavaScript Basics",
            },
            parentId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "ID of the parent folder",
              example: "parent-folder-uuid",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
              example: "2024-05-01T08:00:00.000Z",
            },
            lastOpenedAt: {
              type: "string",
              format: "date-time",
              description: "Last opened date",
              example: "2024-05-15T14:30:00.000Z",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["fail", "error"],
              description:
                "Error status (fail = client error, error = server error)",
              example: "fail",
            },
            message: {
              type: "string",
              description: "Error message",
              example: "Something went wrong",
            },
          },
        },
      },
    },
  },
  // Route files to scan for @swagger comments
  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
};
