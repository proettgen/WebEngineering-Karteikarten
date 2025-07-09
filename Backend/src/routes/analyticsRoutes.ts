/**
 * Analytics Routes
 *
 * REST API endpoints for analytics and learning statistics management.
 * Provides comprehensive routing for CRUD operations and real-time learning tracking.
 * Includes proper authentication, validation, and Swagger documentation.
 *
 * Route Groups:
 * - Basic CRUD: GET, POST, PUT, DELETE for analytics records
 * - Real-time tracking: endpoints for live learning progress updates
 * - Integration: seamless connection with learning mode components
 *
 * Features:
 * - JWT authentication on all endpoints
 * - Request validation using Zod schemas
 * - Comprehensive Swagger/OpenAPI documentation
 * - Error handling and standardized responses
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

/**
 * Live Learning Analytics Tracking Routes
 * New endpoints for real-time integration between Learning Mode and Analytics
 */

/**
 * @swagger
 * /api/analytics/track-study-session:
 *   post:
 *     summary: Track study session
 *     description: Tracks a study session and updates analytics incrementally
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [timeSpent, cardsStudied, correctAnswers, wrongAnswers]
 *             properties:
 *               timeSpent:
 *                 type: integer
 *                 minimum: 0
 *                 description: Time spent studying in seconds
 *                 example: 300
 *               cardsStudied:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of cards studied in this session
 *                 example: 10
 *               correctAnswers:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of correct answers in this session
 *                 example: 8
 *               wrongAnswers:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of wrong answers in this session
 *                 example: 2
 *     responses:
 *       200:
 *         description: Study session tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Analytics'
 *                 message:
 *                   type: string
 *                   example: Study session tracked successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/track-study-session', authenticateJWT, analyticsController.trackStudySession);

/**
 * @swagger
 * /api/analytics/track-reset:
 *   post:
 *     summary: Track reset action
 *     description: Tracks a reset action and updates analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resetType]
 *             properties:
 *               resetType:
 *                 type: string
 *                 enum: [folder, learning_session]
 *                 description: Type of reset being performed
 *                 example: folder
 *     responses:
 *       200:
 *         description: Reset tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Analytics'
 *                 message:
 *                   type: string
 *                   example: Reset (folder) tracked successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/track-reset', authenticateJWT, analyticsController.trackReset);

/**
 * @swagger
 * /api/analytics/increment:
 *   post:
 *     summary: Increment analytics
 *     description: Incremental update for real-time analytics
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
 *                 description: Time to add to total learning time in seconds
 *                 example: 60
 *               totalCardsLearned:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of cards to add to total cards learned
 *                 example: 1
 *               totalCorrect:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number to add to total correct answers
 *                 example: 1
 *               totalWrong:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number to add to total wrong answers
 *                 example: 0
 *               resets:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number to add to reset counter
 *                 example: 1
 *     responses:
 *       200:
 *         description: Analytics incremented successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Analytics'
 *                 message:
 *                   type: string
 *                   example: Analytics incremented successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/increment', authenticateJWT, analyticsController.incrementAnalytics);

export default router;
