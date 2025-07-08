/**
 * Folder Routes
 *
 * Defines REST API endpoints for folder operations including:
 * - CRUD operations for folders
 * - Hierarchical navigation (root folders, child folders)
 * - Folder search functionality
 * - Nested card operations within folder context
 *
 * Base path: /api/folders
 */

import express from 'express';
import * as folderController from '../controllers/folderController';
import * as cardController from '../controllers/cardController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// =============================================================================
// FOLDER CRUD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Get all folders with pagination
 *     description: Retrieves all folders belonging to the authenticated user with optional pagination
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of folders per page
 *         example: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of folders to skip for pagination
 *         example: 0
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, lastOpenedAt]
 *         description: Field to sort by
 *         example: "name"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *         example: "asc"
 *     responses:
 *       200:
 *         description: Folders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FolderListResponse'
 *             example:
 *               status: "success"
 *               results: 5
 *               limit: 20
 *               offset: 0
 *               total: 15
 *               data:
 *                 folders:
 *                   - id: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *                     name: "JavaScript Basics"
 *                     parentId: null
 *                     userId: "550e8400-e29b-41d4-a716-446655440000"
 *                     createdAt: "2024-05-01T08:00:00.000Z"
 *                     lastOpenedAt: "2024-05-15T14:30:00.000Z"
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
 *                       message: "Sort field must be one of: name, createdAt, lastOpenedAt"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while retrieving folders"
 *   post:
 *     summary: Create new folder
 *     description: Creates a new folder (can be a root folder or subfolder). User automatically becomes the owner.
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FolderInput'
 *           example:
 *             name: "JavaScript Advanced"
 *             parentId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *     responses:
 *       201:
 *         description: Folder successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FolderResponse'
 *             example:
 *               status: "success"
 *               data:
 *                 folder:
 *                   id: "d7f9fc3c-b44f-57bc-9d8e-1f2g3h4i5j6k"
 *                   name: "JavaScript Advanced"
 *                   parentId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *                   userId: "550e8400-e29b-41d4-a716-446655440000"
 *                   createdAt: "2024-05-16T10:30:00.000Z"
 *                   lastOpenedAt: null
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               missingName:
 *                 summary: Missing required name field
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "name"
 *                       message: "Folder name is required"
 *               invalidLength:
 *                 summary: Folder name too long
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "name"
 *                       message: "Folder name must be between 1 and 100 characters"
 *               invalidParentId:
 *                 summary: Invalid parent folder ID format
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "parentId"
 *                       message: "Invalid UUID format for parent folder ID"
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
 *         description: Access denied to parent folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "You don't have permission to create subfolders in this folder"
 *       404:
 *         description: Parent folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Parent folder with ID 'c6f8fb2b-a33f-46da-941d-9832b6212395' not found"
 *       409:
 *         description: Folder name already exists in parent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "A folder with the name 'JavaScript Advanced' already exists in this location"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while creating the folder"
 */
router
    .route('/')
    .get(authenticateJWT, folderController.getAllFolders)
    .post(authenticateJWT, folderController.createFolder);

// =============================================================================
// FOLDER SEARCH & NAVIGATION
// =============================================================================

/**
 * @swagger
 * /api/folders/search:
 *   get:
 *     summary: Search folders by name
 *     description: Searches folders based on their name (partial match)
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for folder name
 *         example: "JavaScript"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of search results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Search results
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
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
 *         description: Search term missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', authenticateJWT, folderController.searchFolders);

/**
 * @swagger
 * /api/folders/root:
 *   get:
 *     summary: Get all root folders
 *     description: Loads all folders without parent folders (root level)
 *     tags: [Folders]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of folders per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of folders to skip
 *     responses:
 *       200:
 *         description: List of root folders
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
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
router.get('/root', authenticateJWT, folderController.getRootFolders);

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: Get single folder
 *     description: Loads a specific folder by its ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the folder
 *     responses:
 *       200:
 *         description: Folder successfully loaded
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update folder
 *     description: Updates an existing folder (partial updates possible)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the folder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Neuer Folder name
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: New parent folder ID
 *                 nullable: true
 *             example:
 *               name: "JavaScript Fortgeschritten"
 *               parentId: null
 *     responses:
 *       200:
 *         description: Folder successfully updated
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
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
 *   delete:
 *     summary: Delete folder
 *     description: Permanently deletes a folder (cascades to all contained cards)
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the folder to delete
 *     responses:
 *       204:
 *         description: Folder successfully deleted
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/:id')
    .get(authenticateJWT, folderController.getFolderById)
    .put(authenticateJWT, folderController.updateFolder)
    .delete(authenticateJWT, folderController.deleteFolder);

/**
 * @swagger
 * /api/folders/{id}/children:
 *   get:
 *     summary: Get subfolders
 *     description: Loads all direct subfolders eines spezifischen Ordners
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the parent folder
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of subfolders per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of subfolders to skip
 *     responses:
 *       200:
 *         description: List of subfolders
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         total:
 *                           type: integer
 *       404:
 *         description: Übergeordneter Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/children', authenticateJWT, folderController.getChildFolders);

// =============================================================================
// NESTED CARD OPERATIONS (FOLDER CONTEXT)
// =============================================================================

/**
 * @swagger
 * /api/folders/{id}/cards:
 *   get:
 *     summary: Get all cards in a folder
 *     description: Loads all flashcards assigned to a specific folder
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder
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
 *         description: Anzahl der zu überspringenden Karten
 *     responses:
 *       200:
 *         description: List of cards in the folder
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
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create new card in a folder
 *     description: Creates a new flashcard and automatically assigns it to the specified folder
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder, dem die Karte zugeordnet wird
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: Card title
 *                 example: "React Hooks"
 *               question:
 *                 type: string
 *                 description: Question on the front side
 *                 example: "Was ist der Unterschied zwischen useState und useEffect?"
 *               answer:
 *                 type: string
 *                 description: Answer on the back side
 *                 example: "useState verwaltet lokalen State, useEffect führt Seiteneffekte aus..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for categorization
 *                 example: ["react", "hooks", "frontend"]
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 1
 *                 description: Current learning level (1-5)
 *     responses:
 *       201:
 *         description: Card successfully created in folder
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
/**
 * @swagger
 * /api/folders/{id}/cards:
 *   get:
 *     summary: Get all cards in a folder
 *     description: Loads all flashcards assigned to a specific folder with pagination support
 *     tags: [Folders, Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder
 *         example: "c6f8fb2b-a33f-46da-941d-9832b6212395"
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
 *         description: List of cards in the folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardListResponse'
 *             example:
 *               status: "success"
 *               results: 8
 *               limit: 20
 *               offset: 0
 *               total: 8
 *               data:
 *                 cards:
 *                   - id: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *                     title: "JavaScript Closures"
 *                     question: "What is a closure in JavaScript?"
 *                     answer: "A closure is a function that has access to variables from its outer scope."
 *                     currentLearningLevel: 2
 *                     createdAt: "2024-05-01T08:00:00.000Z"
 *                     tags: ["javascript", "frontend"]
 *                     folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalidUUID:
 *                 summary: Invalid folder ID format
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "id"
 *                       message: "Invalid UUID format for folder ID"
 *               invalidPagination:
 *                 summary: Invalid pagination parameters
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "limit"
 *                       message: "Limit must be between 1 and 100"
 *                     - field: "offset"
 *                       message: "Offset must be 0 or greater"
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
 *               message: "You don't have permission to access this folder"
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "Folder with ID 'c6f8fb2b-a33f-46da-941d-9832b6212395' not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "error"
 *               message: "An unexpected error occurred while retrieving cards"
 *   post:
 *     summary: Create new card in a folder
 *     description: Creates a new flashcard and automatically assigns it to the specified folder. The user must own the folder.
 *     tags: [Folders, Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder where the card will be created
 *         example: "c6f8fb2b-a33f-46da-941d-9832b6212395"
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
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Card title
 *                 example: "React Hooks"
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 description: Question on the front side
 *                 example: "What is the difference between useState and useEffect?"
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *                 description: Answer on the back side
 *                 example: "useState manages local component state, while useEffect handles side effects like API calls, subscriptions, and DOM manipulation."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 50
 *                 maxItems: 20
 *                 description: Tags for categorization
 *                 example: ["react", "hooks", "frontend"]
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 default: 0
 *                 description: Current learning level (0-5, where 0 is new/unlearned)
 *           example:
 *             title: "React Hooks"
 *             question: "What is the difference between useState and useEffect?"
 *             answer: "useState manages local component state, while useEffect handles side effects like API calls, subscriptions, and DOM manipulation."
 *             tags: ["react", "hooks", "frontend"]
 *             currentLearningLevel: 0
 *     responses:
 *       201:
 *         description: Card successfully created in folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponse'
 *             example:
 *               status: "success"
 *               data:
 *                 card:
 *                   id: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *                   title: "React Hooks"
 *                   question: "What is the difference between useState and useEffect?"
 *                   answer: "useState manages local component state, while useEffect handles side effects like API calls, subscriptions, and DOM manipulation."
 *                   currentLearningLevel: 0
 *                   createdAt: "2024-05-01T08:00:00.000Z"
 *                   tags: ["react", "hooks", "frontend"]
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
 *                     - field: "answer"
 *                       message: "Answer is required"
 *               invalidLength:
 *                 summary: Field length validation
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "title"
 *                       message: "Title must be between 1 and 200 characters"
 *                     - field: "question"
 *                       message: "Question must be between 1 and 2000 characters"
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
 *                     - field: "id"
 *                       message: "Invalid UUID format for folder ID"
 *               tooManyTags:
 *                 summary: Too many tags
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "tags"
 *                       message: "Maximum 20 tags allowed per card"
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
 *               message: "A card with the title 'React Hooks' already exists in this folder"
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
router.get('/:id/cards', authenticateJWT, cardController.getCardsByFolder);
router.post('/:id/cards', authenticateJWT, cardController.createCardInFolder);

/**
 * @swagger
 * /api/folders/{id}/cards/{cardId}:
 *   put:
 *     summary: Update card in a folder
 *     description: Updates a flashcard and validates that it belongs to the specified folder. The user must own the folder.
 *     tags: [Folders, Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder
 *         example: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the card to update
 *         example: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Updated card title
 *                 example: "React Hooks - Advanced"
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 description: Updated question
 *                 example: "What are the rules of React Hooks and how do they work?"
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *                 description: Updated answer
 *                 example: "React Hooks follow two main rules: 1) Only call hooks at the top level, 2) Only call hooks from React functions."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 50
 *                 maxItems: 20
 *                 description: Updated tags
 *                 example: ["react", "hooks", "advanced", "rules"]
 *               currentLearningLevel:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Updated learning level
 *                 example: 3
 *           example:
 *             title: "React Hooks - Advanced"
 *             question: "What are the rules of React Hooks and how do they work?"
 *             answer: "React Hooks follow two main rules: 1) Only call hooks at the top level, 2) Only call hooks from React functions."
 *             tags: ["react", "hooks", "advanced", "rules"]
 *             currentLearningLevel: 3
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
 *                   title: "React Hooks - Advanced"
 *                   question: "What are the rules of React Hooks and how do they work?"
 *                   answer: "React Hooks follow two main rules: 1) Only call hooks at the top level, 2) Only call hooks from React functions."
 *                   currentLearningLevel: 3
 *                   createdAt: "2024-05-01T08:00:00.000Z"
 *                   tags: ["react", "hooks", "advanced", "rules"]
 *                   folderId: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       400:
 *         description: Invalid input data or card doesn't belong to folder
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
 *                     - field: "question"
 *                       message: "Question must be between 1 and 2000 characters"
 *               invalidLearningLevel:
 *                 summary: Invalid learning level
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "currentLearningLevel"
 *                       message: "Learning level must be between 0 and 5"
 *               cardNotInFolder:
 *                 summary: Card doesn't belong to folder
 *                 value:
 *                   status: "fail"
 *                   message: "Card does not belong to the specified folder"
 *               invalidUUID:
 *                 summary: Invalid ID format
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "id"
 *                       message: "Invalid UUID format for folder ID"
 *                     - field: "cardId"
 *                       message: "Invalid UUID format for card ID"
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
 *               message: "You don't have permission to update cards in this folder"
 *       404:
 *         description: Folder or card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               folderNotFound:
 *                 summary: Folder not found
 *                 value:
 *                   status: "fail"
 *                   message: "Folder with ID 'c6f8fb2b-a33f-46da-941d-9832b6212395' not found"
 *               cardNotFound:
 *                 summary: Card not found
 *                 value:
 *                   status: "fail"
 *                   message: "Card with ID '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a' not found"
 *       409:
 *         description: Duplicate card title in folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: "fail"
 *               message: "A card with the title 'React Hooks - Advanced' already exists in this folder"
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
 *     summary: Delete card from folder
 *     description: Deletes a flashcard and validates that it belongs to the specified folder. The user must own the folder.
 *     tags: [Folders, Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder
 *         example: "c6f8fb2b-a33f-46da-941d-9832b6212395"
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the card to delete
 *         example: "1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a"
 *     responses:
 *       204:
 *         description: Card successfully deleted
 *       400:
 *         description: Card doesn't belong to the specified folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               cardNotInFolder:
 *                 summary: Card doesn't belong to folder
 *                 value:
 *                   status: "fail"
 *                   message: "Card does not belong to the specified folder"
 *               invalidUUID:
 *                 summary: Invalid ID format
 *                 value:
 *                   status: "fail"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "id"
 *                       message: "Invalid UUID format for folder ID"
 *                     - field: "cardId"
 *                       message: "Invalid UUID format for card ID"
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
 *               message: "You don't have permission to delete cards from this folder"
 *       404:
 *         description: Folder or card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               folderNotFound:
 *                 summary: Folder not found
 *                 value:
 *                   status: "fail"
 *                   message: "Folder with ID 'c6f8fb2b-a33f-46da-941d-9832b6212395' not found"
 *               cardNotFound:
 *                 summary: Card not found
 *                 value:
 *                   status: "fail"
 *                   message: "Card with ID '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a' not found"
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
router.put('/:id/cards/:cardId', authenticateJWT, cardController.updateCardInFolder);
router.delete('/:id/cards/:cardId', authenticateJWT, cardController.deleteCardInFolder);

export default router;