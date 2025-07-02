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
 * GET /api/folders - Get all folders with pagination
 * Query params: limit, offset
 *
 * POST /api/folders - Create a new folder
 * Body: { name, parentId? }
 */
router
    .route('/')
    .get(folderController.getAllFolders)
    .post(folderController.createFolder);

// =============================================================================
// FOLDER SEARCH & NAVIGATION
// =============================================================================

/**
 * GET /api/folders/search - Search folders by name
 * Query params: search (required), limit, offset
 */
router.get('/search', folderController.searchFolders);

/**
 * GET /api/folders/root - Get all root folders (no parent)
 * Query params: limit, offset
 */
router.get('/root', folderController.getRootFolders);

/**
 * GET /api/folders/:id - Get folder by ID
 * PUT /api/folders/:id - Update folder
 * DELETE /api/folders/:id - Delete folder (cascades to cards)
 */
router
    .route('/:id')
    .get(folderController.getFolderById)
    .put(folderController.updateFolder)
    .delete(folderController.deleteFolder);

/**
 * GET /api/folders/:id/children - Get child folders of a specific folder
 * Query params: limit, offset
 */
router.get('/:id/children', folderController.getChildFolders);

// =============================================================================
// NESTED CARD OPERATIONS (FOLDER CONTEXT)
// =============================================================================

/**
 * GET /api/folders/:id/cards - Get all cards in a specific folder
 */
router.get('/:id/cards', cardController.getCardsByFolder);

/**
 * POST /api/folders/:id/cards - Create a new card in a specific folder
 * Body: { title, question, answer, tags?, currentLearningLevel? }
 * Note: folderId is taken from URL parameter
 */
router.post('/:id/cards', cardController.createCardInFolder);

/**
 * PUT /api/folders/:id/cards/:cardId - Update a card within a specific folder
 * Body: Partial card data
 * Validates that card belongs to the specified folder
 */
router.put('/:id/cards/:cardId', cardController.updateCardInFolder);

/**
 * DELETE /api/folders/:id/cards/:cardId - Delete a card within a specific folder
 * Validates that card belongs to the specified folder before deletion
 */
router.delete('/:id/cards/:cardId', cardController.deleteCardInFolder);

export default router;