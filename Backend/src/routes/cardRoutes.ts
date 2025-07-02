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
 * GET /api/cards - Get all cards with advanced filtering and pagination
 * Query params:
 * - folderId: Filter by specific folder
 * - tags: Filter by tags (comma-separated)
 * - title: Filter by title (partial match)
 * - limit: Number of cards per page (default: 20)
 * - offset: Number of cards to skip for pagination
 * - sortBy: Sort field ('currentLearningLevel' or 'created_at')
 * - order: Sort order ('ASC' or 'DESC')
 */
router.get('/', cardController.getAllCards);

/**
 * POST /api/cards - Create a new card
 * Body: { title, question, answer, folderId, tags?, currentLearningLevel? }
 * Validates that the specified folder exists
 */
router.post('/', cardController.createCard);

// =============================================================================
// INDIVIDUAL CARD OPERATIONS
// =============================================================================

/**
 * GET /api/cards/:id - Get card by ID
 * PUT /api/cards/:id - Update card (supports partial updates)
 * DELETE /api/cards/:id - Delete card permanently
 */
router
    .route('/:id')
    .get(cardController.getCardById)
    .put(cardController.updateCard)
    .delete(cardController.deleteCard);

export default router;