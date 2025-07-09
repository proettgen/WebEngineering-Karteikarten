/**
 * Analytics REST API Controller
 *
 * @description HTTP request controllers for analytics endpoints, managing learning statistics
 * and progress tracking operations. Handles request validation, authentication, and response
 * formatting for all analytics-related API operations.
 *
 * @responsibilities
 * - HTTP request/response handling and status code management
 * - Request validation and error response formatting
 * - Authentication verification for protected analytics operations
 * - Delegation of business logic to analytics service layer
 * - Real-time learning progress tracking endpoint management
 *
 * @architecture
 * - Controller Layer: HTTP-specific logic and request/response handling
 * - Service Layer: {@link analyticsService} - Business logic and database operations
 * - Validation Layer: {@link analyticsValidation} - Request schema validation
 * - Database Layer: {@link drizzle/schema} - Analytics data persistence
 *
 * @cross-references
 * - {@link analyticsService} - Core business logic for analytics operations
 * - {@link analyticsRoutes} - Express routing configuration
 * - {@link analyticsValidation} - Zod validation schemas
 * - {@link AuthenticatedRequest} - Authenticated request type definitions
 * - Frontend: `analyticsService.ts` - Client-side API communication
 *
 * @authentication All endpoints require valid JWT authentication via AuthenticatedRequest
 * @validation All request bodies validated using Zod schemas before processing
 *
 * @example
 * ```typescript
 * // Route usage in analyticsRoutes.ts
 * router.get('/', authenticateJWT, getAnalytics);
 * router.put('/', authenticateJWT, validateBody(updateAnalyticsBody), updateAnalytics);
 * ```
 */

import { Response, NextFunction } from 'express';
import * as analyticsService from '../services/analyticsService';
import { AppError } from '../utils/AppError';
import { createAnalyticsBody, updateAnalyticsBody } from '../validation/analyticsValidation';
import { AuthenticatedRequest } from '../types/authTypes';

/**
 * GET /api/analytics
 * Returns the current user's analytics data.
 * Creates a new analytics record if none exists.
 */
export const getAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Security Best Practice: Always verify authentication state
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Security Best Practice: User can only access their own analytics data
    const data = await analyticsService.getUserAnalytics(req.user.id);
    
    // API Best Practice: Consistent response format with status field
    res.status(200).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    // Error Handling Best Practice: Delegate to centralized error handler
    next(error);
  }
};

/**
 * POST /api/analytics
 * Creates a new analytics record for the authenticated user.
 */
export const createAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const validatedData = createAnalyticsBody.parse(req.body);
    const data = await analyticsService.createUserAnalytics(req.user.id, validatedData);
    
    res.status(201).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/analytics
 * Updates the authenticated user's analytics record.
 */
export const updateAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Security Best Practice: Verify authentication before processing
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Validation Best Practice: Parse and validate request body with Zod
    const validatedData = updateAnalyticsBody.parse(req.body);
    // Security Best Practice: User can only update their own analytics
    const data = await analyticsService.updateUserAnalytics(req.user.id, validatedData);
    
    // Error Handling Best Practice: Handle resource not found gracefully
    if (!data) {
      throw new AppError('Analytics not found for this user', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/analytics
 * Deletes the authenticated user's analytics record.
 */
export const deleteAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const deleted = await analyticsService.deleteUserAnalytics(req.user.id);
    
    if (!deleted) {
      throw new AppError('Analytics not found for this user', 404);
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Live Learning Analytics Tracking Controllers
 * New controllers for real-time integration between Learning Mode and Analytics
 */

/**
 * POST /api/analytics/track-study-session
 * Tracks a study session and updates analytics incrementally.
 * Called from the learning mode to update analytics in real-time.
 */
export const trackStudySession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Validate request body
    const { timeSpent, cardsStudied, correctAnswers, wrongAnswers } = req.body as {
      timeSpent: unknown;
      cardsStudied: unknown;
      correctAnswers: unknown;
      wrongAnswers: unknown;
    };

    // Basic validation
    if (typeof timeSpent !== 'number' || typeof cardsStudied !== 'number' || 
        typeof correctAnswers !== 'number' || typeof wrongAnswers !== 'number') {
      throw new AppError('Invalid request body. All fields must be numbers.', 400);
    }

    if (timeSpent < 0 || cardsStudied < 0 || correctAnswers < 0 || wrongAnswers < 0) {
      throw new AppError('All values must be non-negative', 400);
    }

    if (correctAnswers + wrongAnswers !== cardsStudied) {
      throw new AppError('Correct and wrong answers must sum to cards studied', 400);
    }

    const updatedAnalytics = await analyticsService.trackStudySession(req.user.id, {
      timeSpent,
      cardsStudied,
      correctAnswers,
      wrongAnswers
    });

    res.status(200).json({
      status: 'success',
      data: updatedAnalytics,
      message: 'Study session tracked successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/analytics/track-reset
 * Tracks a reset action and updates analytics.
 * Called when a user resets their learning progress.
 */
export const trackReset = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Validate request body
    const { resetType } = req.body as { resetType: unknown };

    if (!resetType || typeof resetType !== 'string' || !['folder', 'learning_session'].includes(resetType)) {
      throw new AppError('Invalid reset type. Must be "folder" or "learning_session"', 400);
    }

    const updatedAnalytics = await analyticsService.trackReset(req.user.id, resetType as 'folder' | 'learning_session');

    res.status(200).json({
      status: 'success',
      data: updatedAnalytics,
      message: `Reset (${resetType}) tracked successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/analytics/increment
 * Incremental update for real-time analytics.
 * Allows updating specific analytics fields without fetching first.
 */
export const incrementAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Validate request body - at least one field must be provided
    const { totalLearningTime, totalCardsLearned, totalCorrect, totalWrong, resets } = req.body as {
      totalLearningTime: unknown;
      totalCardsLearned: unknown;
      totalCorrect: unknown;
      totalWrong: unknown;
      resets: unknown;
    };

    const increments: Record<string, number> = {};
    
    if (typeof totalLearningTime === 'number') {
      if (totalLearningTime < 0) {
        throw new AppError('totalLearningTime increment cannot be negative', 400);
      }
      increments.totalLearningTime = totalLearningTime;
    }
    
    if (typeof totalCardsLearned === 'number') {
      if (totalCardsLearned < 0) {
        throw new AppError('totalCardsLearned increment cannot be negative', 400);
      }
      increments.totalCardsLearned = totalCardsLearned;
    }
    
    if (typeof totalCorrect === 'number') {
      if (totalCorrect < 0) {
        throw new AppError('totalCorrect increment cannot be negative', 400);
      }
      increments.totalCorrect = totalCorrect;
    }
    
    if (typeof totalWrong === 'number') {
      if (totalWrong < 0) {
        throw new AppError('totalWrong increment cannot be negative', 400);
      }
      increments.totalWrong = totalWrong;
    }
    
    if (typeof resets === 'number') {
      if (resets < 0) {
        throw new AppError('resets increment cannot be negative', 400);
      }
      increments.resets = resets;
    }

    if (Object.keys(increments).length === 0) {
      throw new AppError('At least one valid increment field must be provided', 400);
    }

    const updatedAnalytics = await analyticsService.incrementAnalytics(req.user.id, increments);

    res.status(200).json({
      status: 'success',
      data: updatedAnalytics,
      message: 'Analytics incremented successfully'
    });
  } catch (error) {
    next(error);
  }
};
