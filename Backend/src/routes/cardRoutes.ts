/**
 * Card Routes
 *
 * Defines REST API endpoints for flashcard operations including:
 * - Global card operations (search across all folders)
 * - Individual card CRUD operations
 * - Advanced filtering, sorting, and pagination
 *
 * Base path: /api/cards
 *
 * Note: For folder-specific card operations, see folderRoutes.ts
 */

import express from 'express';
import * as cardController from '../controllers/cardController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// =============================================================================
// GLOBAL CARD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all user cards with advanced filtering and sorting options
 *     description: Retrieves all cards belonging to the authenticated user with various filtering options
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific folder
 *         example: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
 *         example: "javascript,frontend"
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (partial match)
 *         example: "JavaScript"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of cards per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of cards to skip for pagination
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, currentLearningLevel, title]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardListResponse'
 *             example:
 *               status: "success"
 *               results: 15
 *               limit: 20
 *               offset: 0
 *               total: 50
 *               data:
 *                 cards:
 *                   - id: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *                     title: "JavaScript Closures"
 *                     question: "What is a closure in JavaScript?"
 *                     answer: "A closure is a function that has access to variables from its outer scope."
 *                     currentLearningLevel: 2
 *                     createdAt: "2024-05-01T08:00:00.000Z"
 *                     tags: ["javascript", "frontend", "advanced"]
 *                     folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalidLimit:
 *                 summary: Invalid limit parameter
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "limit"
 *                       message: "Limit must be between 1 and 100"
 *               invalidSortField:
 *                 summary: Invalid sort field
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "sortBy"
 *                       message: "Sort field must be one of: createdAt, currentLearningLevel, title"
 *               invalidUUID:
 *                 summary: Invalid folderId format
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "folderId"
 *                       message: "Invalid UUID format"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Authentication token is required"
 *       403:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Invalid or expired authentication token"
 *       404:
 *         description: Folder not found (when filtering by folderId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Folder with ID 'c6f8fb2b-a33f-46da-941d-9832b6212395' not found or you don't have access to it"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while retrieving cards"
 */
router.get('/', authenticateJWT, cardController.getAllCards);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create new card
 *     description: Creates a new flashcard and assigns it to a folder. The user must own the specified folder.
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardInput'
 *           example:
 *             title: "JavaScript Closures"
 *             question: "What is a closure in JavaScript?"
 *             answer: "A closure is a function that has access to variables from its outer scope and can access those variables even after the outer function has finished executing."
 *             folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *             tags: ["javascript", "closures", "functions"]
 *             currentLearningLevel: 0
 *     responses:
 *       201:
 *         description: Card successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponse'
 *             example:
 *               status: "success"
 *               data:
 *                 card:
 *                   id: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *                   title: "JavaScript Closures"
 *                   question: "What is a closure in JavaScript?"
 *                   answer: "A closure is a function that has access to variables from its outer scope and can access those variables even after the outer function has finished executing."
 *                   currentLearningLevel: 0
 *                   createdAt: "2024-05-01T08:00:00.000Z"
 *                   tags: ["javascript", "closures", "functions"]
 *                   folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               missingRequired:
 *                 summary: Missing required fields
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "title"
 *                       message: "Title is required"
 *                     - field: "question"
 *                       message: "Question is required"
 *               invalidLength:
 *                 summary: Field length validation
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "title"
 *                       message: "Title must be between 1 and 200 characters"
 *               invalidLearningLevel:
 *                 summary: Invalid learning level
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "currentLearningLevel"
 *                       message: "Learning level must be between 0 and 5"
 *               invalidUUID:
 *                 summary: Invalid folder ID format
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "folderId"
 *                       message: "Invalid UUID format for folder ID"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Authentication token is required"
 *       403:
 *         description: Access denied to folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "You don't have permission to create cards in this folder"
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Folder with ID 'c6f8fb2b-a33f-46da-941d-9832b6212395' not found"
 *       409:
 *         description: Duplicate card title in folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "A card with the title 'JavaScript Closures' already exists in this folder"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while creating the card"
 */
router.post('/', authenticateJWT, cardController.createCard);

// =============================================================================
// INDIVIDUAL CARD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get single card
 *     description: Retrieves a specific card by its ID. User must own the card's folder.
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the card
 *         example: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *     responses:
 *       200:
 *         description: Card successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponse'
 *             example:
 *               status: "success"
 *               data:
 *                 card:
 *                   id: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *                   title: "JavaScript Closures"
 *                   question: "What is a closure in JavaScript?"
 *                   answer: "A closure is a function that has access to variables from its outer scope."
 *                   currentLearningLevel: 2
 *                   createdAt: "2024-05-01T08:00:00.000Z"
 *                   tags: ["javascript", "frontend", "advanced"]
 *                   folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       400:
 *         description: Invalid card ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Validation failed"
 *               errors:
 *                 - field: "id"
 *                   message: "Invalid UUID format for card ID"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Authentication token is required"
 *       403:
 *         description: Access denied to card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "You don't have permission to access this card"
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Card with ID '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a' not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while retrieving the card"
 *   put:
 *     summary: Update card
 *     description: Updates an existing card (partial updates supported). User must own the card's folder.
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the card
 *         example: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardUpdateInput'
 *           example:
 *             title: "JavaScript Closures - Advanced"
 *             currentLearningLevel: 3
 *             tags: ["javascript", "closures", "advanced", "functions"]
 *     responses:
 *       200:
 *         description: Card successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponse'
 *             example:
 *               status: "success"
 *               data:
 *                 card:
 *                   id: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *                   title: "JavaScript Closures - Advanced"
 *                   question: "What is a closure in JavaScript?"
 *                   answer: "A closure is a function that has access to variables from its outer scope."
 *                   currentLearningLevel: 3
 *                   createdAt: "2024-05-01T08:00:00.000Z"
 *                   tags: ["javascript", "closures", "advanced", "functions"]
 *                   folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalidLength:
 *                 summary: Field length validation
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "title"
 *                       message: "Title must be between 1 and 200 characters"
 *               invalidLearningLevel:
 *                 summary: Invalid learning level
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "currentLearningLevel"
 *                       message: "Learning level must be between 0 and 5"
 *               emptyUpdate:
 *                 summary: No fields to update
 *                 value:
 *                   status: "fail"
 *                   message: "At least one field must be provided for update"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Authentication token is required"
 *       403:
 *         description: Access denied to card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "You don't have permission to update this card"
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Card with ID '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a' not found"
 *       409:
 *         description: Conflict with existing card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "A card with the title 'JavaScript Closures - Advanced' already exists in this folder"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while updating the card"
 *   delete:
 *     summary: Delete card
 *     description: Permanently deletes a card from the system. User must own the card's folder. This action cannot be undone.
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the card to delete
 *         example: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *     responses:
 *       204:
 *         description: Card successfully deleted (no content returned)
 *       400:
 *         description: Invalid card ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Validation failed"
 *               errors:
 *                 - field: "id"
 *                   message: "Invalid UUID format for card ID"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Authentication token is required"
 *       403:
 *         description: Access denied to card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "You don't have permission to delete this card"
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Card with ID '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a' not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while deleting the card"
 */
router
    .route('/:id')
    .get(authenticateJWT, cardController.getCardById)
    .put(authenticateJWT, cardController.updateCard)
    .delete(authenticateJWT, cardController.deleteCard);

export default router;