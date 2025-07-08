/**
 * @fileoverview Folder validation schemas using Zod for runtime type validation
 *
 * This module provides validation schemas for folder-related operations including:
 * - Folder creation and updates
 * - Hierarchical folder structure validation
 * - Field-level validation with appropriate constraints
 *
 * All schemas enforce data integrity and provide clear validation errors
 * for API endpoints handling folder operations.
 *
 */

import { z } from 'zod';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Minimum length for folder names */
const MIN_FOLDER_NAME_LENGTH = 1;

/** Maximum length for folder names */
const MAX_FOLDER_NAME_LENGTH = 100;

// =============================================================================
// FOLDER SCHEMAS
// =============================================================================

/**
 * Schema for validating folder creation input from users
 *
 * Validates required fields for folder creation:
 * - name: Folder name (1-100 characters, trimmed)
 * - parentId: Optional UUID of parent folder (null for root folders)
 * 
 * Note: userId, createdAt, and lastOpenedAt are set automatically by the server
 */
export const folderInputSchema = z.object({
    name: z.string()
        .min(MIN_FOLDER_NAME_LENGTH, 'Folder name must not be empty')
        .max(MAX_FOLDER_NAME_LENGTH, `Folder name must not exceed ${MAX_FOLDER_NAME_LENGTH} characters`)
        .trim()
        .refine(name => name.length > 0, 'Folder name must not be empty after trimming'),
    parentId: z.string()
        .uuid('Parent ID must be a valid UUID')
        .nullable()
        .optional(),
});

/**
 * Schema for validating complete folder data (including server-set fields)
 *
 * This is used for validating complete folder objects that include
 * server-generated fields like userId, createdAt, etc.
 */
export const folderSchema = folderInputSchema.extend({
    userId: z.string()
        .uuid('User ID must be a valid UUID'),
    createdAt: z.string()
        .datetime('Invalid datetime format for createdAt'),
    lastOpenedAt: z.string()
        .datetime('Invalid datetime format for lastOpenedAt')
        .nullable(),
});

/**
 * Schema for validating folder updates
 *
 * Same validation rules as folderInputSchema but all fields are optional,
 * allowing partial updates of folder data. Commonly used for:
 * - Renaming folders (name only)
 * - Moving folders (parentId only)
 */
export const folderUpdateSchema = folderInputSchema.partial();

// =============================================================================
// FOLDER OPERATION SCHEMAS
// =============================================================================

/**
 * Schema for validating folder move operations
 *
 * Validates requests to move a folder to a new parent.
 * Ensures the new parent ID is a valid UUID if provided.
 */
export const folderMoveSchema = z.object({
    parentId: z.string()
        .uuid('Parent ID must be a valid UUID')
        .nullable(),
});

/**
 * Schema for validating folder hierarchy queries
 *
 * Validates parameters for retrieving folder hierarchies:
 * - includeCards: Whether to include card counts in the response
 * - maxDepth: Maximum depth to traverse in the hierarchy
 */
export const folderHierarchySchema = z.object({
    includeCards: z.string()
        .transform(val => val === 'true')
        .optional(),
    maxDepth: z.string()
        .regex(/^\d+$/, 'Max depth must be a positive integer')
        .transform(val => parseInt(val, 10))
        .refine(depth => depth > 0 && depth <= 10, 'Max depth must be between 1 and 10')
        .optional(),
});