/**
 * @fileoverview Card validation schemas using Zod for runtime type validation
 *
 * This module provides validation schemas for card-related operations including:
 * - Card creation and updates
 * - Query parameter filtering and sorting
 * - Field-level validation with appropriate constraints
 *
 * All schemas enforce data integrity and provide clear validation errors
 * for API endpoints handling card operations.
 *
 */

import { z } from 'zod';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Minimum length for card titles and content */
const MIN_CARD_CONTENT_LENGTH = 1;

/** Maximum length for card titles */
const MAX_CARD_TITLE_LENGTH = 200;

/** Maximum length for card questions and answers */
const MAX_CARD_CONTENT_LENGTH = 2000;

/** Maximum learning level value */
const MAX_LEARNING_LEVEL = 5;

/** Regular expression for pagination parameters (positive integers) */
const PAGINATION_REGEX = /^\d+$/;

// =============================================================================
// CARD SCHEMAS
// =============================================================================

/**
 * Schema for validating card creation and full card data
 *
 * Validates all required fields for a card including:
 * - title: Card title (1-200 characters)
 * - question: Card question content (1-2000 characters)
 * - answer: Card answer content (1-2000 characters)
 * - currentLearningLevel: Learning progress (0-5)
 * - createdAt: ISO datetime string
 * - tags: Optional array of tag strings
 * - folderId: UUID of the parent folder
 */
export const cardSchema = z.object({
    title: z.string()
        .min(MIN_CARD_CONTENT_LENGTH, 'Title must not be empty')
        .max(MAX_CARD_TITLE_LENGTH, `Title must not exceed ${MAX_CARD_TITLE_LENGTH} characters`)
        .trim(),
    question: z.string()
        .min(MIN_CARD_CONTENT_LENGTH, 'Question must not be empty')
        .max(MAX_CARD_CONTENT_LENGTH, `Question must not exceed ${MAX_CARD_CONTENT_LENGTH} characters`)
        .trim(),
    answer: z.string()
        .min(MIN_CARD_CONTENT_LENGTH, 'Answer must not be empty')
        .max(MAX_CARD_CONTENT_LENGTH, `Answer must not exceed ${MAX_CARD_CONTENT_LENGTH} characters`)
        .trim(),
    currentLearningLevel: z.number()
        .int('Learning level must be an integer')
        .min(0, 'Learning level must be at least 0')
        .max(MAX_LEARNING_LEVEL, `Learning level must not exceed ${MAX_LEARNING_LEVEL}`),
    createdAt: z.string().datetime('Invalid datetime format'),
    tags: z.array(z.string().trim().min(1, 'Tag must not be empty'))
        .nullable()
        .optional()
        .transform(tags => tags?.filter(tag => tag.length > 0) || null),
    folderId: z.string()
        .uuid('Folder ID must be a valid UUID'),
});

/**
 * Schema for validating card updates
 *
 * Same validation rules as cardSchema but all fields are optional,
 * allowing partial updates of card data.
 */
export const cardUpdateSchema = cardSchema.partial();

/**
 * Schema for validating card creation in folder context
 *
 * Omits folderId (provided by URL parameter) and makes optional fields
 * truly optional with sensible defaults.
 */
export const cardCreateInFolderSchema = z.object({
    title: z.string()
        .min(MIN_CARD_CONTENT_LENGTH, 'Title must not be empty')
        .max(MAX_CARD_TITLE_LENGTH, `Title must not exceed ${MAX_CARD_TITLE_LENGTH} characters`)
        .trim(),
    question: z.string()
        .min(MIN_CARD_CONTENT_LENGTH, 'Question must not be empty')
        .max(MAX_CARD_CONTENT_LENGTH, `Question must not exceed ${MAX_CARD_CONTENT_LENGTH} characters`)
        .trim(),
    answer: z.string()
        .min(MIN_CARD_CONTENT_LENGTH, 'Answer must not be empty')
        .max(MAX_CARD_CONTENT_LENGTH, `Answer must not exceed ${MAX_CARD_CONTENT_LENGTH} characters`)
        .trim(),
    currentLearningLevel: z.number()
        .int('Learning level must be an integer')
        .min(0, 'Learning level must be at least 0')
        .max(MAX_LEARNING_LEVEL, `Learning level must not exceed ${MAX_LEARNING_LEVEL}`)
        .optional()
        .default(0),
    createdAt: z.string().datetime('Invalid datetime format').optional(),
    tags: z.array(z.string().trim().min(1, 'Tag must not be empty'))
        .nullable()
        .optional()
        .transform(tags => tags?.filter(tag => tag.length > 0) || null),
});

// =============================================================================
// QUERY PARAMETER SCHEMAS
// =============================================================================

/**
 * Schema for validating card filtering parameters
 *
 * Validates query parameters for filtering cards:
 * - folderId: Optional UUID to filter by folder
 * - tags: Optional comma-separated tag string
 * - title: Optional title search string
 * - limit: Optional pagination limit (positive integer as string)
 * - offset: Optional pagination offset (positive integer as string)
 */
export const cardFilterSchema = z.object({
    folderId: z.string()
        .uuid('Folder ID must be a valid UUID')
        .optional(),
    tags: z.string()
        .min(1, 'Tags parameter must not be empty')
        .optional(),
    title: z.string()
        .min(1, 'Title search parameter must not be empty')
        .optional(),
    limit: z.string()
        .regex(PAGINATION_REGEX, 'Limit must be a positive integer')
        .optional(),
    offset: z.string()
        .regex(PAGINATION_REGEX, 'Offset must be a positive integer')
        .optional(),
});

/**
 * Schema for validating card sorting parameters
 *
 * Validates query parameters for sorting cards:
 * - sortBy: Field to sort by (createdAt or currentLearningLevel)
 * - order: Sort direction (asc/desc, case insensitive)
 */
export const cardSortSchema = z.object({
    sortBy: z.enum(['createdAt', 'currentLearningLevel'], {
        errorMap: () => ({ message: 'Sort field must be either "createdAt" or "currentLearningLevel"' })
    }).optional(),
    order: z.enum(['asc', 'desc', 'ASC', 'DESC'], {
        errorMap: () => ({ message: 'Sort order must be either "asc" or "desc"' })
    }).optional(),
});