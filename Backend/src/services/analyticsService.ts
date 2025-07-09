/**
 * Analytics Service
 *
 * Business logic for managing analytics data and learning statistics.
 * Handles database operations, validation, and real-time progress tracking integration.
 * Follows established service patterns for consistency across the application.
 *
 * Features:
 * - CRUD operations for user analytics
 * - Real-time learning progress tracking
 * - Integration with learning mode components
 * - Reset functionality for learning sessions
 * - Comprehensive error handling and validation
 *
 * Cross-references:
 * - src/controllers/analyticsController.ts: HTTP controllers for analytics endpoints
 * - drizzle/schema.ts: Database schema for analytics
 * - src/types/analyticsTypes.ts: TypeScript type definitions for analytics
 * - src/validation/analyticsValidation.ts: Zod validation schemas
 */

import { db } from '../../drizzle/db';
import { analytics, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Analytics } from '../types/analyticsTypes';
import { AppError } from '../utils/AppError';
import type { CreateAnalyticsBody, UpdateAnalyticsBody } from '../validation/analyticsValidation';

/**
 * Retrieves analytics data for a specific user.
 * Creates a new analytics record if none exists for the user.
 * Enhanced with better error handling and validation.
 * 
 * @param userId - The ID of the user whose analytics to retrieve
 * @returns The user's analytics data
 * @throws {AppError} With specific error codes and messages
 */
export const getUserAnalytics = async (userId: string): Promise<Analytics> => {
  try {
    // Validate userId format (should be UUID)
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    // First, try to get existing analytics for the user
    const result = await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId));

    if (result.length > 0) {
      console.log(`Successfully retrieved analytics for user: ${userId}`);
      return result[0] as Analytics;
    }

    // If no analytics exist, create a new record with default values
    console.log(`No analytics found for user ${userId}, creating default record`);
    const newAnalytics = await createUserAnalytics(userId, {
      totalLearningTime: 0,
      totalCardsLearned: 0,
      totalCorrect: 0,
      totalWrong: 0,
      resets: 0,
    });

    return newAnalytics;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Database error in getUserAnalytics:', error);
    throw new AppError('Failed to retrieve analytics data due to database error', 500);
  }
};

/**
 * Creates a new analytics record for a user.
 * Enhanced with better validation and error handling.
 * 
 * @param userId - The ID of the user
 * @param data - Analytics data without id, userId, and updatedAt
 * @returns The created analytics record
 * @throws {AppError} With specific error codes and messages
 */
export const createUserAnalytics = async (userId: string, data: CreateAnalyticsBody): Promise<Analytics> => {
  try {
    // Validate input data
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    if (!data || typeof data !== 'object') {
      throw new AppError('Invalid analytics data format', 400);
    }

    // Verify that the user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (userExists.length === 0) {
      throw new AppError('User not found', 404);
    }

    // Check if analytics already exist for this user
    const existingAnalytics = await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId));

    if (existingAnalytics.length > 0) {
      throw new AppError('Analytics already exist for this user', 409);
    }

    // Validate data ranges (similar to Card service validation patterns)
    if (data.totalLearningTime < 0 || data.totalCardsLearned < 0 || 
        data.totalCorrect < 0 || data.totalWrong < 0 || data.resets < 0) {
      throw new AppError('Analytics values cannot be negative', 400);
    }

    const [created] = await db
      .insert(analytics)
      .values({
        userId,
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .returning();

    if (!created) {
      throw new AppError('Failed to create analytics record', 500);
    }

    console.log(`Successfully created analytics for user: ${userId}`);
    return created as Analytics;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Database error in createUserAnalytics:', error);
    throw new AppError('Failed to create analytics record due to database error', 500);
  }
};

/**
 * Updates an existing analytics record for a user.
 * Enhanced with better validation and error handling.
 * 
 * @param userId - The ID of the user
 * @param data - Fields to update (without id, userId, and updatedAt)
 * @returns The updated analytics record or null if not found
 * @throws {AppError} With specific error codes and messages
 */
export const updateUserAnalytics = async (userId: string, data: UpdateAnalyticsBody): Promise<Analytics | null> => {
  try {
    // Validate input data
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    if (!data || typeof data !== 'object') {
      throw new AppError('Invalid analytics data format', 400);
    }

    // Validate data ranges (prevent negative values)
    const numericFields = ['totalLearningTime', 'totalCardsLearned', 'totalCorrect', 'totalWrong', 'resets'];
    for (const field of numericFields) {
      if (field in data && typeof data[field as keyof UpdateAnalyticsBody] === 'number' && data[field as keyof UpdateAnalyticsBody]! < 0) {
        throw new AppError(`${field} cannot be negative`, 400);
      }
    }

    const [updated] = await db
      .update(analytics)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(analytics.userId, userId))
      .returning();

    if (!updated) {
      throw new AppError('Analytics not found for this user', 404);
    }

    console.log(`Successfully updated analytics for user: ${userId}`);
    return updated as Analytics;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Database error in updateUserAnalytics:', error);
    throw new AppError('Failed to update analytics record due to database error', 500);
  }
};

/**
 * Deletes analytics record for a user.
 * Enhanced with better validation and error handling.
 * 
 * @param userId - The ID of the user whose analytics to delete
 * @returns true if a record was deleted, false otherwise
 * @throws {AppError} With specific error codes and messages
 */
export const deleteUserAnalytics = async (userId: string): Promise<boolean> => {
  try {
    // Validate userId format
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    const deleted = await db
      .delete(analytics)
      .where(eq(analytics.userId, userId))
      .returning();

    const wasDeleted = deleted.length > 0;
    if (wasDeleted) {
      console.log(`Successfully deleted analytics for user: ${userId}`);
    } else {
      console.log(`No analytics found to delete for user: ${userId}`);
    }

    return wasDeleted;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Database error in deleteUserAnalytics:', error);
    throw new AppError('Failed to delete analytics record due to database error', 500);
  }
};

// Legacy functions for backward compatibility (deprecated)
/**
 * @deprecated Use getUserAnalytics instead
 */
export const getAnalytics = async (): Promise<Analytics | null> => {
  console.warn('getAnalytics is deprecated. Use getUserAnalytics instead.');
  const result = await db.select().from(analytics);
  return result[0] || null;
};

/**
 * @deprecated Use createUserAnalytics instead
 */
export const createAnalytics = async (data: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics> => {
  console.warn('createAnalytics is deprecated. Use createUserAnalytics instead.');
  const [created] = await db.insert(analytics).values(data).returning();
  return created;
};

/**
 * @deprecated Use updateUserAnalytics instead
 */
export const updateAnalytics = async (id: string, data: Partial<Omit<Analytics, 'id' | 'updatedAt'>>): Promise<Analytics | null> => {
  console.warn('updateAnalytics is deprecated. Use updateUserAnalytics instead.');
  const [updated] = await db.update(analytics).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(analytics.id, id)).returning();
  return updated || null;
};

/**
 * @deprecated Use deleteUserAnalytics instead
 */
export const deleteAnalytics = async (id: string): Promise<boolean> => {
  console.warn('deleteAnalytics is deprecated. Use deleteUserAnalytics instead.');
  const deleted = await db.delete(analytics).where(eq(analytics.id, id)).returning();
  return !!deleted.length;
};

/**
 * Live Learning Analytics Tracking
 * New functions for real-time integration between Learning Mode and Analytics
 */

/**
 * Tracks a study session and updates analytics incrementally.
 * This function is called from the learning mode to update analytics in real-time.
 * 
 * @param userId - The ID of the user
 * @param sessionData - Data from the current study session
 * @returns Updated analytics data
 * @throws {AppError} With specific error codes and messages
 */
export const trackStudySession = async (
  userId: string, 
  sessionData: {
    timeSpent: number;
    cardsStudied: number;
    correctAnswers: number;
    wrongAnswers: number;
  }
): Promise<Analytics> => {
  try {
    // Validate userId format
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    // Validate session data
    if (!sessionData || typeof sessionData !== 'object') {
      throw new AppError('Invalid session data format', 400);
    }

    const { timeSpent, cardsStudied, correctAnswers, wrongAnswers } = sessionData;

    // Validate that all values are non-negative
    if (timeSpent < 0 || cardsStudied < 0 || correctAnswers < 0 || wrongAnswers < 0) {
      throw new AppError('Session data values cannot be negative', 400);
    }

    // Validate that correct + wrong answers equals cards studied
    if (correctAnswers + wrongAnswers !== cardsStudied) {
      throw new AppError('Correct and wrong answers must sum to cards studied', 400);
    }

    // Get existing analytics or create if not exists
    let userAnalytics: Analytics;
    try {
      userAnalytics = await getUserAnalytics(userId);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        // Create new analytics if none exist
        userAnalytics = await createUserAnalytics(userId, {
          totalLearningTime: 0,
          totalCardsLearned: 0,
          totalCorrect: 0,
          totalWrong: 0,
          resets: 0
        });
      } else {
        throw error;
      }
    }

    // Calculate new values
    const updatedData = {
      totalLearningTime: userAnalytics.totalLearningTime + timeSpent,
      totalCardsLearned: userAnalytics.totalCardsLearned + cardsStudied,
      totalCorrect: userAnalytics.totalCorrect + correctAnswers,
      totalWrong: userAnalytics.totalWrong + wrongAnswers,
    };

    // Update analytics
    const updated = await updateUserAnalytics(userId, updatedData);
    
    if (!updated) {
      throw new AppError('Failed to update analytics after study session', 500);
    }
    
    console.log(`Successfully tracked study session for user: ${userId}`, {
      timeSpent,
      cardsStudied,
      correctAnswers,
      wrongAnswers
    });

    return updated;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Error in trackStudySession:', error);
    throw new AppError('Failed to track study session due to database error', 500);
  }
};

/**
 * Tracks a reset action and updates analytics.
 * This function is called when a user resets their learning progress.
 * 
 * @param userId - The ID of the user
 * @param resetType - The type of reset being performed
 * @returns Updated analytics data
 * @throws {AppError} With specific error codes and messages
 */
export const trackReset = async (
  userId: string,
  resetType: 'folder' | 'learning_session'
): Promise<Analytics> => {
  try {
    // Validate userId format
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    // Validate reset type
    if (!resetType || !['folder', 'learning_session'].includes(resetType)) {
      throw new AppError('Invalid reset type. Must be "folder" or "learning_session"', 400);
    }

    // Get existing analytics or create if not exists
    let userAnalytics: Analytics;
    try {
      userAnalytics = await getUserAnalytics(userId);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        // Create new analytics if none exist
        userAnalytics = await createUserAnalytics(userId, {
          totalLearningTime: 0,
          totalCardsLearned: 0,
          totalCorrect: 0,
          totalWrong: 0,
          resets: 0
        });
      } else {
        throw error;
      }
    }

    // Increment reset counter
    const updatedData = {
      resets: userAnalytics.resets + 1,
    };

    // Update analytics
    const updated = await updateUserAnalytics(userId, updatedData);
    
    if (!updated) {
      throw new AppError('Failed to update analytics after reset', 500);
    }
    
    console.log(`Successfully tracked reset (${resetType}) for user: ${userId}`);

    return updated;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Error in trackReset:', error);
    throw new AppError('Failed to track reset due to database error', 500);
  }
};

/**
 * Incremental update for real-time analytics.
 * This function allows updating specific analytics fields without fetching first.
 * 
 * @param userId - The ID of the user
 * @param increments - Object with fields to increment
 * @returns Updated analytics data
 * @throws {AppError} With specific error codes and messages
 */
export const incrementAnalytics = async (
  userId: string,
  increments: {
    totalLearningTime?: number;
    totalCardsLearned?: number;
    totalCorrect?: number;
    totalWrong?: number;
    resets?: number;
  }
): Promise<Analytics> => {
  try {
    // Validate userId format
    if (!userId || typeof userId !== 'string') {
      throw new AppError('Invalid user ID format', 400);
    }

    // Validate increments
    if (!increments || typeof increments !== 'object') {
      throw new AppError('Invalid increments data format', 400);
    }

    // Validate that all increment values are non-negative
    Object.entries(increments).forEach(([key, value]) => {
      if (typeof value === 'number' && value < 0) {
        throw new AppError(`${key} increment cannot be negative`, 400);
      }
    });

    // Get current analytics
    let userAnalytics: Analytics;
    try {
      userAnalytics = await getUserAnalytics(userId);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        // Create new analytics if none exist
        userAnalytics = await createUserAnalytics(userId, {
          totalLearningTime: 0,
          totalCardsLearned: 0,
          totalCorrect: 0,
          totalWrong: 0,
          resets: 0
        });
      } else {
        throw error;
      }
    }

    // Apply increments
    const updatedData = {
      totalLearningTime: userAnalytics.totalLearningTime + (increments.totalLearningTime || 0),
      totalCardsLearned: userAnalytics.totalCardsLearned + (increments.totalCardsLearned || 0),
      totalCorrect: userAnalytics.totalCorrect + (increments.totalCorrect || 0),
      totalWrong: userAnalytics.totalWrong + (increments.totalWrong || 0),
      resets: userAnalytics.resets + (increments.resets || 0),
    };

    // Update analytics
    const updated = await updateUserAnalytics(userId, updatedData);
    
    if (!updated) {
      throw new AppError('Failed to increment analytics', 500);
    }
    
    console.log(`Successfully incremented analytics for user: ${userId}`, increments);

    return updated;
  } catch (error) {
    // Re-throw AppErrors as-is, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error('Error in incrementAnalytics:', error);
    throw new AppError('Failed to increment analytics due to database error', 500);
  }
};
