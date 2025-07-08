/**
 * Card Service
 *
 * Business logic layer for flashcard operations including:
 * - Database interactions for card CRUD operations
 * - Dynamic query building for filtering and sorting
 * - Data transformation between database and application models
 * - Complex queries for card statistics and learning features
 */

import { AppError } from '../utils/AppError';
import { Card, CardServiceFilter } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index';
import { cards, folders } from '../../drizzle/schema';
import { eq, and, ilike, sql, desc, asc } from 'drizzle-orm';

/**
 * Retrieves cards with advanced filtering, sorting, and pagination
 *
 * Supports filtering by:
 * - folderId: Cards belonging to a specific folder
 * - title: Partial title matching (case-insensitive)
 * - tags: Cards containing any of the specified tags
 *
 * @param filter - Filter criteria including pagination and sorting options
 * @returns Object containing cards array and total count
 */
export const getAllCards = async (filter: CardServiceFilter): Promise<{ cards: Card[]; total: number }> => {
    try {
        // Build WHERE conditions
        const conditions = [];
        
        if (filter.folderId) {
            conditions.push(eq(cards.folderId, filter.folderId));
        }
        
        if (filter.title) {
            conditions.push(ilike(cards.title, `%${filter.title}%`));
        }
        
        if (filter.tags) {
            const tagList = filter.tags.split(',').map(tag => tag.trim());
            // PostgreSQL array overlap operator
            conditions.push(sql`${cards.tags} && ${tagList}`);
        }

        // Combine conditions with AND
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        
        // Set sorting options
        const sortField = filter.sortBy === 'currentLearningLevel' ? cards.currentLearningLevel : cards.createdAt;
        const sortOrder = filter.order?.toUpperCase() === 'ASC' ? asc(sortField) : desc(sortField);
        
        // Execute main query
        const cardResults = await db
            .select({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            })
            .from(cards)
            .where(whereClause)
            .orderBy(sortOrder)
            .limit(filter.limit ?? 20)
            .offset(filter.offset ?? 0);

        // Execute count query
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(cards)
            .where(whereClause);

        return {
            cards: cardResults as Card[],
            total: countResult[0]?.count ?? 0
        };
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw new AppError('Could not retrieve cards from database.', 500);
    }
};

/**
 * Retrieves a single card by its unique identifier
 *
 * @param id - UUID of the card to fetch
 * @returns Card object if found, null otherwise
 * @throws {AppError} If database query fails
 */
export const getCardById = async (id: string): Promise<Card | null> => {
    try {
        const result = await db
            .select({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            })
            .from(cards)
            .where(eq(cards.id, id))
            .limit(1);
        
        return result[0] ? result[0] as Card : null;
    } catch (error) {
        console.error('Error fetching card by ID:', error);
        throw new AppError('Could not retrieve card from database.', 500);
    }
};

/**
 * Creates a new flashcard in the database
 *
 * Generates a unique UUID for the card and inserts it with all provided data.
 * Sets default learning level to 0 if not specified.
 *
 * @param card - Card data without ID (ID will be generated)
 * @returns Created card with generated ID
 * @throws {AppError} If database insertion fails
 */
export const createCard = async (card: Omit<Card, 'id'>): Promise<Card> => {
    try {
        const cardId = uuidv4();
        
        const result = await db
            .insert(cards)
            .values({
                id: cardId,
                title: card.title,
                question: card.question,
                answer: card.answer,
                currentLearningLevel: card.currentLearningLevel,
                createdAt: card.createdAt,
                tags: card.tags,
                folderId: card.folderId,
            })
            .returning({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            });
        
        return result[0] as Card;
    } catch (error) {
        console.error('Error creating card:', error);
        throw new AppError('Could not create card.', 500);
    }
};

/**
 * Updates an existing flashcard with partial data
 *
 * Uses COALESCE to only update fields that are provided in the partial card object.
 * Supports updating all card fields including learning level progression.
 *
 * @param id - UUID of the card to update
 * @param card - Partial card data with fields to update
 * @returns Updated card object if found, null if card doesn't exist
 * @throws {AppError} If database update operation fails
 */
export const updateCard = async (id: string, card: Partial<Card>): Promise<Card | null> => {
    try {
        const result = await db
            .update(cards)
            .set({
                title: card.title,
                question: card.question,
                answer: card.answer,
                currentLearningLevel: card.currentLearningLevel,
                createdAt: card.createdAt,
                tags: card.tags,
                folderId: card.folderId,
            })
            .where(eq(cards.id, id))
            .returning({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            });
        
        return result[0] ? result[0] as Card : null;
    } catch (error) {
        console.error('Error updating card:', error);
        throw new AppError(
            `Could not update card: ${error instanceof Error ? error.message : 'Unknown error'}`,
            500
        );
    }
};

/**
 * Permanently deletes a flashcard from the database
 *
 * This operation is irreversible. Consider implementing soft delete
 * for production environments to maintain data integrity.
 *
 * @param id - UUID of the card to delete
 * @throws {AppError} If database deletion fails
 */
export const deleteCard = async (id: string): Promise<void> => {
    try {
        await db
            .delete(cards)
            .where(eq(cards.id, id));
    } catch (error) {
        console.error('Error deleting card:', error);
        throw new AppError('Could not delete card.', 500);
    }
};

/**
 * Retrieves all cards belonging to a specific folder
 *
 * Returns cards ordered by creation date (newest first).
 * Used for folder-specific card views and operations.
 *
 * @param folderId - UUID of the folder to get cards from
 * @returns Array of cards in the specified folder
 * @throws {AppError} If database query fails
 */
export const getCardsByFolder = async (folderId: string): Promise<Card[]> => {
    try {
        const result = await db
            .select({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            })
            .from(cards)
            .where(eq(cards.folderId, folderId))
            .orderBy(desc(cards.createdAt));
        
        return result as Card[];
    } catch (error) {
        console.error('Error fetching cards by folder:', error);
        throw new AppError('Could not retrieve cards for folder.', 500);
    }
};

// ========================================================================
// USER-BASED CARD OPERATIONS
// ========================================================================

/**
 * Verifies that a user owns the folder that contains a card
 *
 * @param cardId - UUID of the card to check
 * @param userId - UUID of the user to verify ownership for
 * @returns True if user owns the folder containing the card, false otherwise
 * @throws {AppError} If database query fails
 */
export const verifyCardOwnership = async (cardId: string, userId: string): Promise<boolean> => {
    try {
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(cards)
            .innerJoin(folders, eq(cards.folderId, folders.id))
            .where(and(
                eq(cards.id, cardId),
                eq(folders.userId, userId)
            ));

        return (result[0]?.count ?? 0) > 0;
    } catch (error) {
        console.error('Error verifying card ownership:', error);
        throw new AppError('Could not verify card ownership.', 500);
    }
};

/**
 * Retrieves cards belonging to folders owned by a specific user
 * 
 * @param userId - UUID of the user whose cards to fetch
 * @param filter - Filter criteria including pagination and sorting options
 * @returns Object containing cards array and total count
 */
export const getUserCards = async (userId: string, filter: CardServiceFilter): Promise<{ cards: Card[]; total: number }> => {
    try {
        // Build WHERE conditions
        const conditions = [eq(folders.userId, userId)];
        
        if (filter.folderId) {
            conditions.push(eq(cards.folderId, filter.folderId));
        }
        
        if (filter.title) {
            conditions.push(ilike(cards.title, `%${filter.title}%`));
        }
        
        if (filter.tags) {
            const tagList = filter.tags.split(',').map(tag => tag.trim());
            // PostgreSQL array overlap operator
            conditions.push(sql`${cards.tags} && ${tagList}`);
        }

        // Combine conditions with AND
        const whereClause = and(...conditions);
        
        // Set sorting options
        const sortField = filter.sortBy === 'currentLearningLevel' ? cards.currentLearningLevel : cards.createdAt;
        const sortOrder = filter.order?.toUpperCase() === 'ASC' ? asc(sortField) : desc(sortField);
        
        // Execute main query
        const cardResults = await db
            .select({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            })
            .from(cards)
            .innerJoin(folders, eq(cards.folderId, folders.id))
            .where(whereClause)
            .orderBy(sortOrder)
            .limit(filter.limit ?? 20)
            .offset(filter.offset ?? 0);

        // Execute count query
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(cards)
            .innerJoin(folders, eq(cards.folderId, folders.id))
            .where(whereClause);

        return {
            cards: cardResults as Card[],
            total: countResult[0]?.count ?? 0
        };
    } catch (error) {
        console.error('Error fetching user cards:', error);
        throw new AppError('Could not retrieve user cards from database.', 500);
    }
};

/**
 * Retrieves a single card by ID if the user owns the folder containing it
 *
 * @param cardId - UUID of the card to fetch
 * @param userId - UUID of the user to verify ownership for
 * @returns Card object if found and owned by user, null otherwise
 * @throws {AppError} If database query fails
 */
export const getUserCard = async (cardId: string, userId: string): Promise<Card | null> => {
    try {
        const result = await db
            .select({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            })
            .from(cards)
            .innerJoin(folders, eq(cards.folderId, folders.id))
            .where(and(
                eq(cards.id, cardId),
                eq(folders.userId, userId)
            ))
            .limit(1);
        
        return result[0] ? result[0] as Card : null;
    } catch (error) {
        console.error('Error fetching user card by ID:', error);
        throw new AppError('Could not retrieve card from database.', 500);
    }
};

/**
 * Creates a new flashcard in a folder owned by the user
 *
 * Verifies that the user owns the target folder before creating the card.
 *
 * @param userId - UUID of the user creating the card
 * @param card - Card data without ID (ID will be generated)
 * @returns Created card with generated ID
 * @throws {AppError} If user doesn't own the folder or database operation fails
 */
export const createUserCard = async (userId: string, card: Omit<Card, 'id'>): Promise<Card> => {
    try {
        // Verify that the user owns the folder
        const folderOwnership = await db
            .select({ count: sql<number>`count(*)` })
            .from(folders)
            .where(and(
                eq(folders.id, card.folderId),
                eq(folders.userId, userId)
            ));

        if ((folderOwnership[0]?.count ?? 0) === 0) {
            throw new AppError('You do not have permission to create cards in this folder.', 403);
        }

        const cardId = uuidv4();
        
        const result = await db
            .insert(cards)
            .values({
                id: cardId,
                title: card.title,
                question: card.question,
                answer: card.answer,
                currentLearningLevel: card.currentLearningLevel,
                createdAt: card.createdAt,
                tags: card.tags,
                folderId: card.folderId,
            })
            .returning({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            });
        
        return result[0] as Card;
    } catch (error) {
        console.error('Error creating user card:', error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Could not create card.', 500);
    }
};

/**
 * Updates a card if the user owns the folder containing it
 *
 * @param cardId - UUID of the card to update
 * @param userId - UUID of the user attempting the update
 * @param card - Partial card data with fields to update
 * @returns Updated card object if found and owned, null if card doesn't exist or user doesn't own it
 * @throws {AppError} If database update operation fails
 */
export const updateUserCard = async (cardId: string, userId: string, card: Partial<Card>): Promise<Card | null> => {
    try {
        // Verify ownership before updating
        const hasOwnership = await verifyCardOwnership(cardId, userId);
        if (!hasOwnership) {
            return null; // Card doesn't exist or user doesn't own it
        }

        const result = await db
            .update(cards)
            .set({
                title: card.title,
                question: card.question,
                answer: card.answer,
                currentLearningLevel: card.currentLearningLevel,
                createdAt: card.createdAt,
                tags: card.tags,
                folderId: card.folderId,
            })
            .where(eq(cards.id, cardId))
            .returning({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            });
        
        return result[0] ? result[0] as Card : null;
    } catch (error) {
        console.error('Error updating user card:', error);
        throw new AppError(
            `Could not update card: ${error instanceof Error ? error.message : 'Unknown error'}`,
            500
        );
    }
};

/**
 * Deletes a card if the user owns the folder containing it
 *
 * @param cardId - UUID of the card to delete
 * @param userId - UUID of the user attempting the deletion
 * @returns True if card was deleted, false if card doesn't exist or user doesn't own it
 * @throws {AppError} If database deletion fails
 */
export const deleteUserCard = async (cardId: string, userId: string): Promise<boolean> => {
    try {
        // Verify ownership before deleting
        const hasOwnership = await verifyCardOwnership(cardId, userId);
        if (!hasOwnership) {
            return false; // Card doesn't exist or user doesn't own it
        }

        await db
            .delete(cards)
            .where(eq(cards.id, cardId));
        
        return true;
    } catch (error) {
        console.error('Error deleting user card:', error);
        throw new AppError('Could not delete card.', 500);
    }
};

/**
 * Retrieves all cards belonging to a specific folder owned by the user
 *
 * @param userId - UUID of the user
 * @param folderId - UUID of the folder to get cards from
 * @returns Array of cards in the specified folder if user owns it
 * @throws {AppError} If database query fails or user doesn't own the folder
 */
export const getUserCardsByFolder = async (userId: string, folderId: string): Promise<Card[]> => {
    try {
        // Verify that the user owns the folder
        const folderOwnership = await db
            .select({ count: sql<number>`count(*)` })
            .from(folders)
            .where(and(
                eq(folders.id, folderId),
                eq(folders.userId, userId)
            ));

        if ((folderOwnership[0]?.count ?? 0) === 0) {
            throw new AppError('You do not have permission to access this folder.', 403);
        }

        const result = await db
            .select({
                id: cards.id,
                title: cards.title,
                question: cards.question,
                answer: cards.answer,
                currentLearningLevel: cards.currentLearningLevel,
                createdAt: cards.createdAt,
                tags: cards.tags,
                folderId: cards.folderId
            })
            .from(cards)
            .where(eq(cards.folderId, folderId))
            .orderBy(desc(cards.createdAt));
        
        return result as Card[];
    } catch (error) {
        console.error('Error fetching user cards by folder:', error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Could not retrieve cards for folder.', 500);
    }
};