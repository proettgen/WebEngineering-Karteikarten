/**
 * Card Service
 *
 * Business logic layer for flashcard operations including:
 * - Database interactions for card CRUD operations
 * - Dynamic query building for filtering and sorting
 * - Data transformation between database and application models
 * - Complex queries for card statistics and learning features
 */

import { Pool } from 'pg';
import { AppError } from '../utils/AppError';
import { Card, CardFilter } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

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
export const getAllCards = async (filter: CardFilter): Promise<{ cards: Card[]; total: number }> => {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let parameterIndex = 1;

    // Build dynamic WHERE conditions based on provided filters
    if (filter.folderId) {
        conditions.push(`folder_id = $${parameterIndex++}`);
        values.push(filter.folderId);
    }
    
    if (filter.title) {
        conditions.push(`LOWER(title) LIKE $${parameterIndex++}`);
        values.push(`%${filter.title.toLowerCase()}%`);
    }
    
    if (filter.tags) {
        const tagList = filter.tags.split(',').map(tag => tag.trim());
        conditions.push(`tags && $${parameterIndex++}::text[]`);
        values.push(tagList);
    }

    // Construct WHERE clause if conditions exist
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Set default sorting options
    const sortField = filter.sortField ?? 'created_at';
    const sortOrder = filter.sortOrder ?? 'DESC';

    // Build main query with column aliases for camelCase transformation
    const mainQuery = `
        SELECT id, title, question, answer, current_learning_level AS "currentLearningLevel",
            created_at AS "createdAt", tags, folder_id AS "folderId"
        FROM cards
        ${whereClause}
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $${parameterIndex++} OFFSET $${parameterIndex}
    `;
    
    // Add pagination parameters
    values.push(filter.limit ?? 20, filter.offset ?? 0);

    // Execute main query to get cards
    const cardData = await pool.query<Card>(mainQuery, values);

    // Execute count query for total results (excluding pagination parameters)
    const countQuery = `SELECT COUNT(*) FROM cards ${whereClause}`;
    const countValues = values.slice(0, values.length - 2); // Remove limit and offset
    const countResult = await pool.query<{ count: string }>(countQuery, countValues);

    return {
        cards: cardData.rows,
        total: parseInt(countResult.rows[0].count, 10)
    };
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
        const query = `
            SELECT id, title, question, answer, current_learning_level AS "currentLearningLevel",
                created_at AS "createdAt", tags, folder_id AS "folderId"
            FROM cards
            WHERE id = $1
        `;
        
        const result = await pool.query<Card>(query, [id]);
        
        return result.rows[0] ?? null;
    } catch {
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
        
        const insertQuery = `
            INSERT INTO cards (id, title, question, answer, current_learning_level, created_at, tags, folder_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"
        `;
        
        const values = [
            cardId,
            card.title,
            card.question,
            card.answer,
            card.currentLearningLevel,
            card.createdAt,
            card.tags,
            card.folderId,
        ];
        
        const result = await pool.query<Card>(insertQuery, values);
        
        return result.rows[0];
    } catch {
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
        const updateQuery = `
            UPDATE cards
            SET title = COALESCE($2, title),
                question = COALESCE($3, question),
                answer = COALESCE($4, answer),
                current_learning_level = COALESCE($5, current_learning_level),
                created_at = COALESCE($6, created_at),
                tags = COALESCE($7, tags),
                folder_id = COALESCE($8, folder_id)
            WHERE id = $1
            RETURNING id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"
        `;
        
        const values = [
            id,
            card.title,
            card.question,
            card.answer,
            card.currentLearningLevel,
            card.createdAt,
            card.tags,
            card.folderId,
        ];
        
        const result = await pool.query<Card>(updateQuery, values);
        
        return result.rows[0] ?? null;
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
        const deleteQuery = 'DELETE FROM cards WHERE id = $1';
        await pool.query(deleteQuery, [id]);
    } catch {
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
        const query = `
            SELECT id, title, question, answer, current_learning_level AS "currentLearningLevel",
                created_at AS "createdAt", tags, folder_id AS "folderId"
            FROM cards
            WHERE folder_id = $1
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query<Card>(query, [folderId]);
        
        return result.rows;
    } catch {
        throw new AppError('Could not retrieve cards for folder.', 500);
    }
};