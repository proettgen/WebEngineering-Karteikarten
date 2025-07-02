/**
 * Card Types
 *
 * TypeScript type definitions for flashcard-related data structures.
 * These types ensure type safety across the application and define
 * the API contract between frontend and backend.
 *
 * IMPORTANT: Type Synchronization Notice
 * If you make changes to this file, please run `npm run sync-types` from the project root.
 * This will copy the updated types to the Frontend for type safety and consistency.
 */

/**
 * Core Card Interface
 *
 * Represents a flashcard with learning progression tracking.
 * Used for database operations and API responses.
 */
export interface Card {
    /** Unique identifier (UUID) */
    id: string;
    
    /** Display title for the flashcard */
    title: string;
    
    /** Question text shown to the user */
    question: string;
    
    /** Answer text revealed after user interaction */
    answer: string;
    
    /** Current learning level (0-5, where 5 is mastered) */
    currentLearningLevel: number;
    
    /** ISO timestamp when the card was created */
    createdAt: string;
    
    /** Optional array of tags for categorization */
    tags: string[] | null;
    
    /** Reference to the folder containing this card */
    folderId: string;
}

/**
 * Card Filter Interface
 *
 * Defines available filtering, sorting, and pagination options
 * for querying cards from the database.
 */
export interface CardFilter {
    /** Filter cards by specific folder ID */
    folderId?: string;
    
    /** Filter cards by tags (comma-separated string) */
    tags?: string;
    
    /** Filter cards by title (partial match, case-insensitive) */
    title?: string;
    
    /** Maximum number of cards to return (pagination) */
    limit?: number;
    
    /** Number of cards to skip (pagination offset) */
    offset?: number;
    
    /** Field to sort by ('current_learning_level' or 'created_at') */
    sortField?: string;
    
    /** Sort order ('ASC' or 'DESC') */
    sortOrder?: string;
}