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

const router = express.Router();

// =============================================================================
// FOLDER CRUD OPERATIONS
// =============================================================================

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: Get all folders with pagination
 *     description: Loads all available folders with optional pagination
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
 *         description: Number of folders to skip for pagination
 *     responses:
 *       200:
 *         description: List of all folders
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
 *   post:
 *     summary: Create new folder
 *     description: Creates a new folder (can also be a subfolder)
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Folder name
 *                 example: "JavaScript Grundlagen"
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the parent folder (optional for subfolders)
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Folder successfully created
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
 *         description: Übergeordneter Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/')
    .get(folderController.getAllFolders)
    .post(folderController.createFolder);

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
router.get('/search', folderController.searchFolders);

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
router.get('/root', folderController.getRootFolders);

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
    .get(folderController.getFolderById)
    .put(folderController.updateFolder)
    .delete(folderController.deleteFolder);

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
router.get('/:id/children', folderController.getChildFolders);

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
router.get('/:id/cards', cardController.getCardsByFolder);
router.post('/:id/cards', cardController.createCardInFolder);

/**
 * @swagger
 * /api/folders/{id}/cards/{cardId}:
 *   put:
 *     summary: Karte in einem Update folder
 *     description: Aktualisiert eine Karte und validiert, dass sie zum angegebenen Ordner gehört
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID der zu aktualisierenden Karte
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
 *               title: "React Hooks - Erweitert"
 *               currentLearningLevel: 3
 *               tags: ["react", "hooks", "advanced"]
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
 *         description: Invalid input data oder Karte gehört nicht zum Ordner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ordner oder Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Karte aus einem Delete folder
 *     description: Löscht eine Karte und validiert, dass sie zum angegebenen Ordner gehört
 *     tags: [Folders, Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the folder
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID der zu löschenden Karte
 *     responses:
 *       204:
 *         description: Card successfully deleted
 *       400:
 *         description: Karte gehört nicht zum angegebenen Ordner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ordner oder Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/cards/:cardId', cardController.updateCardInFolder);
router.delete('/:id/cards/:cardId', cardController.deleteCardInFolder);

export default router;