/**
 * Analytics Controller
 *
 * This file contains HTTP controllers for all analytics endpoints.
 * It handles HTTP requests, calls service methods, and sends HTTP responses.
 *
 * Notes:
 * - Controllers are responsible for HTTP-specific logic (e.g., status codes, error handling).
 * - The actual database logic is in the service (see src/services/analyticsService.ts).
 * - Controllers are used in routes (src/routes/analyticsRoutes.ts).
 * - Now follows the same patterns as authController and cardController.
 *
 * Cross-references:
 * - src/services/analyticsService.ts: Business logic for analytics
 * - src/routes/analyticsRoutes.ts: Routing for analytics endpoints
 * - src/validation/analyticsValidation.ts: Request validation
 * - drizzle/schema.ts: Database schema
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
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const data = await analyticsService.getUserAnalytics(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: data
    });
  } catch (error) {
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
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const validatedData = updateAnalyticsBody.parse(req.body);
    const data = await analyticsService.updateUserAnalytics(req.user.id, validatedData);
    
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
 * PHASE 4: Live Learning Analytics Tracking Controllers
 * Neue Controller für die Echtzeit-Integration zwischen Learning Mode und Analytics
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
