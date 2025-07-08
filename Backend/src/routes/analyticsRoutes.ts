/**
 * Analytics Routes
 *
 * Defines REST API endpoints for the analytics module (learning statistics).
 * Now follows the same patterns as other route files with proper authentication and validation.
 *
 * Notes:
 * - This file connects HTTP routes with controller methods.
 * - The actual logic is in the controller (src/controllers/analyticsController.ts).
 * - Routes are integrated into the main Express server (api/index.ts).
 * - All routes now require authentication and use proper validation middleware.
 *
 * Cross-references:
 * - src/controllers/analyticsController.ts: Controller logic
 * - src/services/analyticsService.ts: Database and business logic
 * - src/middleware/authMiddleware.ts: JWT authentication
 * - src/validation/analyticsValidation.ts: Request validation
 */

import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateBody';
import { createAnalyticsBody, updateAnalyticsBody } from '../validation/analyticsValidation';

const router = Router();

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get user analytics
 *     description: Retrieves the authenticated user's learning statistics. Creates a new analytics record if none exists.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
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
 *                     analytics:
 *                       $ref: '#/components/schemas/Analytics'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateJWT, analyticsController.getAnalytics);

/**
 * @swagger
 * /api/analytics:
 *   post:
 *     summary: Create user analytics
 *     description: Creates a new analytics record for the authenticated user
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalLearningTime:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Total learning time in seconds
 *               totalCardsLearned:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Total number of cards learned
 *               totalCorrect:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Total correct answers
 *               totalWrong:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Total wrong answers
 *               resets:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Number of learning resets
 *     responses:
 *       201:
 *         description: Analytics created successfully
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
 *                     analytics:
 *                       $ref: '#/components/schemas/Analytics'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Analytics already exist for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateJWT, validateBody(createAnalyticsBody), analyticsController.createAnalytics);

/**
 * @swagger
 * /api/analytics:
 *   put:
 *     summary: Update user analytics
 *     description: Updates the authenticated user's analytics record
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalLearningTime:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total learning time in seconds
 *               totalCardsLearned:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total number of cards learned
 *               totalCorrect:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total correct answers
 *               totalWrong:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total wrong answers
 *               resets:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of learning resets
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Analytics updated successfully
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
 *                     analytics:
 *                       $ref: '#/components/schemas/Analytics'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Analytics not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/', authenticateJWT, validateBody(updateAnalyticsBody), analyticsController.updateAnalytics);

/**
 * @swagger
 * /api/analytics:
 *   delete:
 *     summary: Delete user analytics
 *     description: Deletes the authenticated user's analytics record
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Analytics deleted successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Analytics not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/', authenticateJWT, analyticsController.deleteAnalytics);

export default router;
