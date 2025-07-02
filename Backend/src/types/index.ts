/**
 * Types Index
 *
 * Central export point for all type definitions in the application.
 * Provides utility types and re-exports from individual type files.
 *
 * IMPORTANT: Type Synchronization Notice
 * If you make changes to this file, please run `npm run sync-types` from the project root.
 * This will copy the updated types to the Frontend for type safety and consistency.
 */

// Re-export all card types
export * from './cardTypes';

// Re-export all folder types
export * from './folderTypes';

/**
 * Common API Response Types
 *
 * Standardized response formats used across all API endpoints.
 */

/**
 * Standard API Success Response
 */
export interface ApiResponse<T = unknown> {
  /** Response status indicator */
    status: 'success' | 'error';
    
  /** Response data payload */
    data?: T;
    
  /** Error message (only present when status is 'error') */
    message?: string;
}

/**
 * Paginated API Response
 *
 * Used for endpoints that return lists with pagination support.
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  /** Number of items in current response */
    results: number;
    
  /** Maximum items per page */
    limit: number;
    
  /** Number of items skipped */
    offset: number;
    
  /** Total number of items available */
    total: number;
    
  /** Search term (for search endpoints) */
    searchTerm?: string;
}

/**
 * Database Entity Base Interface
 *
 * Common fields that all database entities should have.
 */
export interface BaseEntity {
  /** Unique identifier (UUID) */
    id: string;
    
  /** ISO timestamp when the entity was created */
    createdAt: string;
}

/**
 * Utility Types for Enhanced Type Safety
 */

/** Extract ID from any entity type */
export type EntityId<T extends BaseEntity> = T['id'];

/** Create type without ID (for creation operations) */
export type CreateInput<T extends BaseEntity> = Omit<T, 'id'>;

/** Create type with optional fields (for update operations) */
export type UpdateInput<T extends BaseEntity> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/** Learning levels enum for better type safety */
export enum LearningLevel {
    NEW = 0,
    LEARNING = 1,
    FAMILIAR = 2,
    GOOD = 3,
    VERY_GOOD = 4,
    MASTERED = 5
}

/** Sort order enum */
export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

/** Card sort fields enum */
export enum CardSortField {
    CREATED_AT = 'created_at',
    CURRENT_LEARNING_LEVEL = 'current_learning_level',
    TITLE = 'title'
}
