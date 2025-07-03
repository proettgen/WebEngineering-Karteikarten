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

const router = express.Router();

// =============================================================================
// GLOBAL CARD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards with advanced filtering and sorting options
 *     description: Search all cards system-wide with various filtering options
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific folder
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
 *           enum: [createdAt, currentLearningLevel]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of filtered cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     cards:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Card'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         total:
 *                           type: integer
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', cardController.getAllCards);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create new card
 *     description: Creates a new flashcard and assigns it to a folder
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - question
 *               - answer
 *               - folderId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Card title
 *                 example: "JavaScript Closures"
 *               question:
 *                 type: string
 *                 description: Question on the front side
 *                 example: "What is a closure in JavaScript?"
 *               answer:
 *                 type: string
 *                 description: Answer on the back side
 *                 example: "A closure is a function that has access to variables from its outer scope..."
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated folder
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for categorization
 *                 example: ["javascript", "closures", "functions"]
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 1
 *                 description: Current learning level (1-5)
 *     responses:
 *       201:
 *         description: Card successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
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
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', cardController.createCard);

// =============================================================================
// INDIVIDUAL CARD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get single card
 *     description: Loads a specific card by its ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the card
 *     responses:
 *       200:
 *         description: Card successfully loaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     card:
 *                       $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update card
 *     description: Updates an existing card (partial updates possible)
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Neuer Card title
 *               question:
 *                 type: string
 *                 description: New question
 *               answer:
 *                 type: string
 *                 description: New answer
 *               folderId:
 *                 type: string
 *                 format: uuid
 *                 description: New folder ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: New tags
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: New learning level
 *             example:
 *               title: "JavaScript Closures - Erweitert"
 *               currentLearningLevel: 3
 *               tags: ["javascript", "closures", "advanced"]
 *     responses:
 *       200:
 *         description: Card successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
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
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete card
 *     description: Permanently deletes a card from the system
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the card to delete
 *     responses:
 *       204:
 *         description: Card successfully deleted
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/:id')
    .get(cardController.getCardById)
    .put(cardController.updateCard)
    .delete(cardController.deleteCard);

export default router;