/**
 * @fileoverview Pagination validation schemas for API endpoints
 *
 * This module provides validation schemas for pagination parameters
 * used across various API endpoints. Ensures consistent pagination
 * behavior and parameter validation.
 *
 * Contains schemas for:
 * - Basic pagination (limit/offset)
 * - Search pagination (with search terms)
 * - Advanced pagination options
 *
 */

import { z } from 'zod';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default pagination limit */
export const DEFAULT_PAGINATION_LIMIT = 20;

/** Maximum allowed pagination limit */
export const MAX_PAGINATION_LIMIT = 100;

/** Regular expression for pagination parameters (positive integers) */
const PAGINATION_REGEX = /^\d+$/;

// =============================================================================
// PAGINATION SCHEMAS
// =============================================================================

/**
 * Schema for basic pagination parameters
 *
 * Validates and transforms pagination parameters:
 * - limit: Maximum number of items to return (1-100, default: 20)
 * - offset: Number of items to skip (0 or positive integer)
 *
 * Both parameters are provided as strings (query parameters) and
 * transformed to numbers for use in services.
 */
export const paginationSchema = z.object({
    limit: z.string()
        .regex(PAGINATION_REGEX, 'Limit must be a positive integer')
        .transform(val => parseInt(val, 10))
        .refine(val => val >= 1 && val <= MAX_PAGINATION_LIMIT, 
            `Limit must be between 1 and ${MAX_PAGINATION_LIMIT}`)
        .optional()
        .default(DEFAULT_PAGINATION_LIMIT.toString())
        .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    offset: z.string()
        .regex(PAGINATION_REGEX, 'Offset must be a positive integer')
        .transform(val => parseInt(val, 10))
        .optional()
        .default('0')
        .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
});

/**
 * Schema for search pagination parameters
 *
 * Extends basic pagination with search functionality:
 * - limit: Maximum number of items to return
 * - offset: Number of items to skip
 * - search: Search term to filter results (minimum 1 character)
 *
 * Used for endpoints that support both pagination and search.
 */
export const searchPaginationSchema = z.object({
    limit: z.string()
        .regex(PAGINATION_REGEX, 'Limit must be a positive integer')
        .transform(val => parseInt(val, 10))
        .refine(val => val >= 1 && val <= MAX_PAGINATION_LIMIT, 
            `Limit must be between 1 and ${MAX_PAGINATION_LIMIT}`)
        .optional()
        .default(DEFAULT_PAGINATION_LIMIT.toString())
        .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    offset: z.string()
        .regex(PAGINATION_REGEX, 'Offset must be a positive integer')
        .transform(val => parseInt(val, 10))
        .optional()
        .default('0')
        .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    search: z.string()
        .min(1, 'Search term must not be empty')
        .trim()
        .optional(),
});

/**
 * Schema for advanced pagination with sorting
 *
 * Combines pagination with sorting options:
 * - limit: Maximum number of items to return
 * - offset: Number of items to skip
 * - sortBy: Field to sort by
 * - order: Sort direction (asc/desc)
 */
export const sortedPaginationSchema = z.object({
    limit: z.string()
        .regex(PAGINATION_REGEX, 'Limit must be a positive integer')
        .transform(val => parseInt(val, 10))
        .refine(val => val >= 1 && val <= MAX_PAGINATION_LIMIT,
            `Limit must be between 1 and ${MAX_PAGINATION_LIMIT}`)
        .optional()
        .default(DEFAULT_PAGINATION_LIMIT.toString())
        .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    offset: z.string()
        .regex(PAGINATION_REGEX, 'Offset must be a positive integer')
        .transform(val => parseInt(val, 10))
        .optional()
        .default('0')
        .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
    sortBy: z.string()
        .min(1, 'Sort field must not be empty')
        .optional(),
    order: z.enum(['asc', 'desc', 'ASC', 'DESC'], {
        errorMap: () => ({ message: 'Sort order must be either "asc" or "desc"' })
    }).optional(),
});