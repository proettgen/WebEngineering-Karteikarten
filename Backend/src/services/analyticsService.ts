/**
 * Analytics Service
 *
 * This file contains the business logic for managing analytics data (learning statistics).
 * It encapsulates all database operations for the analytics module and is used by controllers.
 *
 * Important notes:
 * - The service layer is responsible for database communication.
 * - It should not contain HTTP-specific logic (that's the controller's job).
 * - Analytics data is now user-specific (associated with userId).
 * - Follows the same patterns as cardService and folderService.
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
 * 
 * @param userId - The ID of the user whose analytics to retrieve
 * @returns The user's analytics data
 * @throws {AppError} If database query fails
 */
export const getUserAnalytics = async (userId: string): Promise<Analytics> => {
  try {
    // First, try to get existing analytics for the user
    const result = await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId));

    if (result.length > 0) {
      return result[0] as Analytics;
    }

    // If no analytics exist, create a new record with default values
    const newAnalytics = await createUserAnalytics(userId, {
      totalLearningTime: 0,
      totalCardsLearned: 0,
      totalCorrect: 0,
      totalWrong: 0,
      resets: 0,
    });

    return newAnalytics;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw new AppError('Could not retrieve analytics data.', 500);
  }
};

/**
 * Creates a new analytics record for a user.
 * 
 * @param userId - The ID of the user
 * @param data - Analytics data without id, userId, and updatedAt
 * @returns The created analytics record
 * @throws {AppError} If database query fails or user doesn't exist
 */
export const createUserAnalytics = async (userId: string, data: CreateAnalyticsBody): Promise<Analytics> => {
  try {
    // Verify that the user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (userExists.length === 0) {
      throw new AppError('User not found.', 404);
    }

    // Check if analytics already exist for this user
    const existingAnalytics = await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId));

    if (existingAnalytics.length > 0) {
      throw new AppError('Analytics already exist for this user.', 409);
    }

    const [created] = await db
      .insert(analytics)
      .values({
        userId,
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return created as Analytics;
  } catch (error) {
    console.error('Error creating user analytics:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Could not create analytics record.', 500);
  }
};

/**
 * Updates an existing analytics record for a user.
 * 
 * @param userId - The ID of the user
 * @param data - Fields to update (without id, userId, and updatedAt)
 * @returns The updated analytics record or null if not found
 * @throws {AppError} If database query fails or user doesn't own the analytics
 */
export const updateUserAnalytics = async (userId: string, data: UpdateAnalyticsBody): Promise<Analytics | null> => {
  try {
    const [updated] = await db
      .update(analytics)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(analytics.userId, userId))
      .returning();

    if (!updated) {
      throw new AppError('Analytics not found for this user.', 404);
    }

    return updated as Analytics;
  } catch (error) {
    console.error('Error updating user analytics:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Could not update analytics record.', 500);
  }
};

/**
 * Deletes analytics record for a user.
 * 
 * @param userId - The ID of the user whose analytics to delete
 * @returns true if a record was deleted, false otherwise
 * @throws {AppError} If database query fails
 */
export const deleteUserAnalytics = async (userId: string): Promise<boolean> => {
  try {
    const deleted = await db
      .delete(analytics)
      .where(eq(analytics.userId, userId))
      .returning();

    return deleted.length > 0;
  } catch (error) {
    console.error('Error deleting user analytics:', error);
    throw new AppError('Could not delete analytics record.', 500);
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
