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
        // =============================================================================
        // AUTHENTICATION SCHEMAS
        // =============================================================================
        User: {
          type: "object",
          required: ["id", "username", "created_at", "updated_at"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique ID of the user",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            username: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "Username",
              example: "johndoe",
            },
            email: {
              type: "string",
              format: "email",
              nullable: true,
              description: "Email address (optional)",
              example: "john@example.com",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Account creation date",
              example: "2024-05-01T08:00:00.000Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update date",
              example: "2024-05-15T14:30:00.000Z",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["usernameOrEmail", "password"],
          properties: {
            usernameOrEmail: {
              type: "string",
              description: "Username or email address",
              example: "johndoe",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Password",
              example: "password123",
            },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "Username",
              example: "johndoe",
            },
            email: {
              type: "string",
              format: "email",
              nullable: true,
              description: "Email address (optional)",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Password",
              example: "password123",
            },
          },
        },
        ProfileUpdateInput: {
          type: "object",
          required: ["currentPassword"],
          properties: {
            username: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "New username",
              example: "newusername",
            },
            email: {
              type: "string",
              format: "email",
              nullable: true,
              description: "New email address",
              example: "new@example.com",
            },
            newPassword: {
              type: "string",
              minLength: 6,
              description: "New password",
              example: "newpassword123",
            },
            currentPassword: {
              type: "string",
              description: "Current password for verification",
              example: "currentpassword123",
            },
          },
        },
        
        // =============================================================================
        // CARD SCHEMAS
        // =============================================================================
        Card: {
          type: "object",
          required: ["id", "title", "question", "answer", "folderId", "createdAt"],
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
              example: "A closure is a function that has access to variables from its outer scope.",
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
        CardInput: {
          type: "object",
          required: ["title", "question", "answer", "folderId"],
          properties: {
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
              example: "A closure is a function that has access to variables from its outer scope.",
            },
            currentLearningLevel: {
              type: "integer",
              minimum: 0,
              maximum: 5,
              description: "Current learning level (0-5)",
              example: 0,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              nullable: true,
              description: "Tags for categorization",
              example: ["javascript", "frontend"],
            },
            folderId: {
              type: "string",
              format: "uuid",
              description: "ID of the associated folder",
              example: "c6f8fb2b-a33f-46da-941d-9832b6212395",
            },
          },
        },
        CardUpdateInput: {
          type: "object",
          properties: {
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
              example: "A closure is a function that has access to variables from its outer scope.",
            },
            currentLearningLevel: {
              type: "integer",
              minimum: 0,
              maximum: 5,
              description: "Current learning level (0-5)",
              example: 2,
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
          },
        },
        
        // =============================================================================
        // FOLDER SCHEMAS
        // =============================================================================
        Folder: {
          type: "object",
          required: ["id", "name", "userId", "createdAt"],
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
              description: "ID of the parent folder (null for root folders)",
              example: "parent-folder-uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the folder owner",
              example: "550e8400-e29b-41d4-a716-446655440000",
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
              nullable: true,
              description: "Last opened date",
              example: "2024-05-15T14:30:00.000Z",
            },
          },
        },
        FolderInput: {
          type: "object",
          required: ["name"],
          properties: {
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
              description: "ID of the parent folder (null for root folder)",
              example: "parent-folder-uuid",
            },
          },
        },
        FolderUpdateInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description: "Name of the folder",
              example: "JavaScript Advanced",
            },
            parentId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "ID of the parent folder",
              example: "parent-folder-uuid",
            },
          },
        },
        
        // =============================================================================
        // ANALYTICS SCHEMAS
        // =============================================================================
        Analytics: {
          type: "object",
          required: ["id", "userId", "studySession", "totalCards", "correctAnswers", "createdAt"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique ID of the analytics record",
              example: "analytics-123e4567-e89b-12d3-a456-426614174000",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user this analytics belongs to",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            studySession: {
              type: "integer",
              minimum: 1,
              description: "Study session number",
              example: 5,
            },
            totalCards: {
              type: "integer",
              minimum: 0,
              description: "Total number of cards studied in this session",
              example: 20,
            },
            correctAnswers: {
              type: "integer",
              minimum: 0,
              description: "Number of correct answers in this session",
              example: 15,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the analytics record was created",
              example: "2024-01-20T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the analytics record was last updated",
              example: "2024-01-20T10:30:00.000Z",
            },
          },
        },
        CreateAnalyticsRequest: {
          type: "object",
          required: ["studySession", "totalCards", "correctAnswers"],
          properties: {
            studySession: {
              type: "integer",
              minimum: 1,
              description: "Study session number",
              example: 5,
            },
            totalCards: {
              type: "integer",
              minimum: 0,
              description: "Total number of cards studied in this session",
              example: 20,
            },
            correctAnswers: {
              type: "integer",
              minimum: 0,
              description: "Number of correct answers in this session",
              example: 15,
            },
          },
        },
        UpdateAnalyticsRequest: {
          type: "object",
          properties: {
            studySession: {
              type: "integer",
              minimum: 1,
              description: "Study session number",
              example: 6,
            },
            totalCards: {
              type: "integer",
              minimum: 0,
              description: "Total number of cards studied in this session",
              example: 25,
            },
            correctAnswers: {
              type: "integer",
              minimum: 0,
              description: "Number of correct answers in this session",
              example: 20,
            },
          },
        },
        AnalyticsResponse: {
          type: "object",
          required: ["status", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            data: {
              $ref: "#/components/schemas/Analytics",
            },
          },
        },
        AnalyticsListResponse: {
          type: "object",
          required: ["status", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Analytics",
              },
            },
          },
        },
        
        // =============================================================================
        // API RESPONSE SCHEMAS
        // =============================================================================
        SuccessResponse: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            message: {
              type: "string",
              description: "Success message",
              example: "Operation completed successfully",
            },
          },
        },
        LoginResponse: {
          type: "object",
          required: ["status", "message", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            message: {
              type: "string",
              description: "Success message",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
        RegisterResponse: {
          type: "object",
          required: ["status", "message", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            message: {
              type: "string",
              description: "Success message",
              example: "Registration successful",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
        ProfileResponse: {
          type: "object",
          required: ["status", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
        CardListResponse: {
          type: "object",
          required: ["status", "results", "limit", "offset", "total", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            results: {
              type: "integer",
              description: "Number of cards returned",
              example: 10,
            },
            limit: {
              type: "integer",
              description: "Maximum number of cards requested",
              example: 20,
            },
            offset: {
              type: "integer",
              description: "Number of cards skipped",
              example: 0,
            },
            total: {
              type: "integer",
              description: "Total number of cards available",
              example: 50,
            },
            data: {
              type: "object",
              properties: {
                cards: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Card",
                  },
                },
              },
            },
          },
        },
        CardResponse: {
          type: "object",
          required: ["status", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                card: {
                  $ref: "#/components/schemas/Card",
                },
              },
            },
          },
        },
        FolderListResponse: {
          type: "object",
          required: ["status", "results", "limit", "offset", "total", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            results: {
              type: "integer",
              description: "Number of folders returned",
              example: 5,
            },
            limit: {
              type: "integer",
              description: "Maximum number of folders requested",
              example: 20,
            },
            offset: {
              type: "integer",
              description: "Number of folders skipped",
              example: 0,
            },
            total: {
              type: "integer",
              description: "Total number of folders available",
              example: 15,
            },
            data: {
              type: "object",
              properties: {
                folders: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Folder",
                  },
                },
              },
            },
          },
        },
        FolderResponse: {
          type: "object",
          required: ["status", "data"],
          properties: {
            status: {
              type: "string",
              enum: ["success"],
              description: "Success status",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                folder: {
                  $ref: "#/components/schemas/Folder",
                },
              },
            },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          required: ["status", "message"],
          properties: {
            status: {
              type: "string",
              enum: ["fail"],
              description: "Validation error status",
              example: "fail",
            },
            message: {
              type: "string",
              description: "Validation error message",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    description: "Field name with error",
                    example: "title",
                  },
                  message: {
                    type: "string",
                    description: "Error message for the field",
                    example: "Title is required",
                  },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          required: ["status", "message"],
          properties: {
            status: {
              type: "string",
              enum: ["fail", "error"],
              description: "Error status (fail = client error, error = server error)",
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
