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
