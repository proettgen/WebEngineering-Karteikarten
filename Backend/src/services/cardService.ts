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
import { cards } from '../../drizzle/schema';
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