/**
 * @fileoverview Common validation schemas shared across the application
 *
 * This module provides reusable validation schemas that are used
 * throughout the application for consistent data validation.
 *
 * Contains validation for:
 * - Entity IDs (UUIDs)
 * - Common data types and formats
 * - Shared validation patterns
 *
 */

import { z } from 'zod';

// =============================================================================
// COMMON VALIDATION SCHEMAS
// =============================================================================

/**
 * Schema for validating entity IDs
 *
 * Ensures all entity IDs are valid UUIDs (version 4).
 * Used for validating IDs in path parameters and references.
 */
export const idSchema = z.string()
    .uuid('ID must be a valid UUID');

/**
 * Schema for validating boolean query parameters
 *
 * Converts string representations of booleans to actual boolean values.
 * Accepts: 'true', 'false', '1', '0' (case insensitive)
 */
export const booleanQuerySchema = z.string()
    .transform(val => val.toLowerCase())
    .refine(val => ['true', 'false', '1', '0'].includes(val), 'Must be a boolean value')
    .transform(val => val === 'true' || val === '1');

/**
 * Schema for validating ISO datetime strings
 *
 * Ensures datetime values are in valid ISO format.
 * Used for timestamps and date-related fields.
 */
export const dateTimeSchema = z.string()
    .datetime('Must be a valid ISO datetime string');

/**
 * Schema for validating positive integers
 *
 * Ensures values are non-negative integers.
 * Commonly used for counts, IDs, and numeric parameters.
 */
export const positiveIntegerSchema = z.number()
    .int('Must be an integer')
    .min(0, 'Must be a positive integer');

/**
 * Schema for validating string-based positive integers
 *
 * Validates string representations of positive integers
 * and transforms them to numbers. Used for query parameters.
 */
export const positiveIntegerStringSchema = z.string()
    .regex(/^\d+$/, 'Must be a positive integer')
    .transform(val => parseInt(val, 10));