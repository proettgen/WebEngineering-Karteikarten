/**
 * Folder Service
 *
 * Business logic layer for folder operations including:
 * - Hierarchical folder management (root folders, child folders)
 * - Database interactions for folder CRUD operations
 * - Folder search functionality with pattern matching
 * - Folder existence validation for card operations
 * - Support for nested folder structures and navigation
 */

import { Pool } from 'pg';
import { AppError } from '../utils/AppError';
import { Folder } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Retrieves all folders with pagination support
 *
 * Returns folders ordered by creation date (newest first) with total count
 * for pagination. Includes both root folders and nested folders.
 *
 * @param limit - Maximum number of folders to return (default: 20)
 * @param offset - Number of folders to skip for pagination (default: 0)
 * @returns Object containing folders array and total count
 * @throws {AppError} If database query fails
 */
export const getAllFolders = async (limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        // Query for folders with pagination
        const foldersQuery = `
            SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        
        const foldersResult = await pool.query<Folder>(foldersQuery, [limit, offset]);
        
        // Query for total count
        const countQuery = 'SELECT COUNT(*) FROM folders';
        const countResult = await pool.query<{ count: string }>(countQuery);
        
        return {
            folders: foldersResult.rows,
            total: parseInt(countResult.rows[0].count, 10)
        };
    } catch {
        throw new AppError('Could not retrieve folder data from database.', 500);
    }
};

/**
 * Retrieves a single folder by its unique identifier
 *
 * @param id - UUID of the folder to fetch
 * @returns Folder object if found, null otherwise
 * @throws {AppError} If database query fails
 */
export const getFolderById = async (id: string): Promise<Folder | null> => {
    try {
        const query = `
            SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt" 
            FROM folders
            WHERE id = $1
        `;
        
        const result = await pool.query<Folder>(query, [id]);
        
        return result.rows[0] ?? null;
    } catch {
        throw new AppError('Could not retrieve folder from database.', 500);
    }
};

/**
 * Creates a new folder in the database
 *
 * Generates a unique UUID for the folder and supports creating both
 * root folders (parentId = null) and nested folders with a parent.
 *
 * @param folder - Folder data without ID (ID will be generated)
 * @returns Created folder with generated ID
 * @throws {AppError} If database insertion fails
 */
export const createFolder = async (folder: Omit<Folder, 'id'>): Promise<Folder> => {
    try {
        const folderId = uuidv4();
        
        const insertQuery = `
            INSERT INTO folders (id, name, parent_id, created_at, last_opened_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
        `;
        
        const values = [
            folderId,
            folder.name,
            folder.parentId,
            folder.createdAt,
            folder.lastOpenedAt
        ];
        
        const result = await pool.query<Folder>(insertQuery, values);
        
        return result.rows[0];
    } catch {
        throw new AppError('Could not create folder.', 500);
    }
};

/**
 * Updates an existing folder with partial data
 *
 * Uses COALESCE to only update fields that are provided.
 * Supports changing folder name, parent (for moving folders), and timestamps.
 *
 * @param id - UUID of the folder to update
 * @param folder - Partial folder data with fields to update
 * @returns Updated folder object if found, null if folder doesn't exist
 * @throws {AppError} If database update operation fails
 */
export const updateFolder = async (id: string, folder: Partial<Folder>): Promise<Folder | null> => {
    try {
        const updateQuery = `
            UPDATE folders
            SET name = COALESCE($2, name),
                parent_id = COALESCE($3, parent_id),
                created_at = COALESCE($4, created_at),
                last_opened_at = COALESCE($5, last_opened_at)
            WHERE id = $1
            RETURNING id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
        `;
        
        const values = [
            id,
            folder.name,
            folder.parentId,
            folder.createdAt,
            folder.lastOpenedAt
        ];
        
        const result = await pool.query<Folder>(updateQuery, values);
        
        return result.rows[0] ?? null;
    } catch {
        throw new AppError('Could not update folder.', 500);
    }
};

/**
 * Permanently deletes a folder from the database
 *
 * WARNING: This will also delete all cards within the folder due to
 * foreign key constraints. Consider implementing soft delete for production.
 *
 * @param id - UUID of the folder to delete
 * @throws {AppError} If database deletion fails
 */
export const deleteFolder = async (id: string): Promise<void> => {
    try {
        const deleteQuery = 'DELETE FROM folders WHERE id = $1';
        await pool.query(deleteQuery, [id]);
    } catch {
        throw new AppError('Could not delete folder.', 500);
    }
};

/**
 * Hierarchical folder functions for navigation components
 * These functions support building tree-like folder structures in the UI
 */

/**
 * Retrieves all root folders (folders without a parent)
 *
 * Used to build the top level of folder hierarchy in navigation.
 * Orders folders alphabetically for consistent presentation.
 *
 * @param limit - Maximum number of folders to return (default: 20)
 * @param offset - Number of folders to skip for pagination (default: 0)
 * @returns Object containing root folders array and total count
 * @throws {AppError} If database query fails
 */
export const getRootFolders = async (limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        // Query for root folders (parent_id IS NULL) with pagination
        const foldersQuery = `
            SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders
            WHERE parent_id IS NULL
            ORDER BY name ASC
            LIMIT $1 OFFSET $2
        `;
        
        const foldersResult = await pool.query<Folder>(foldersQuery, [limit, offset]);
        
        // Count total root folders
        const countQuery = 'SELECT COUNT(*) FROM folders WHERE parent_id IS NULL';
        const countResult = await pool.query<{ count: string }>(countQuery);
        
        return {
            folders: foldersResult.rows,
            total: parseInt(countResult.rows[0].count, 10)
        };
    } catch {
        throw new AppError('Could not retrieve root folders from database.', 500);
    }
};

/**
 * Retrieves all child folders of a specific parent folder
 *
 * Used to expand folder nodes in hierarchical navigation.
 * Orders folders alphabetically for consistent presentation.
 *
 * @param parentId - UUID of the parent folder
 * @param limit - Maximum number of folders to return (default: 20)
 * @param offset - Number of folders to skip for pagination (default: 0)
 * @returns Object containing child folders array and total count
 * @throws {AppError} If database query fails
 */
export const getChildFolders = async (parentId: string, limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        // Query for child folders with specific parent_id
        const foldersQuery = `
            SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders
            WHERE parent_id = $1
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        `;
        
        const foldersResult = await pool.query<Folder>(foldersQuery, [parentId, limit, offset]);
        
        // Count total child folders for this parent
        const countQuery = 'SELECT COUNT(*) FROM folders WHERE parent_id = $1';
        const countResult = await pool.query<{ count: string }>(countQuery, [parentId]);
        
        return {
            folders: foldersResult.rows,
            total: parseInt(countResult.rows[0].count, 10)
        };
    } catch {
        throw new AppError('Could not retrieve child folders from database.', 500);
    }
};

/**
 * Checks if a folder exists by its ID
 *
 * Used for validation before creating cards or performing folder operations.
 * Optimized query using SELECT 1 for existence checking.
 *
 * @param folderId - UUID of the folder to check
 * @returns True if folder exists, false otherwise
 */
export const folderExists = async (folderId: string): Promise<boolean> => {
    try {
        const query = 'SELECT 1 FROM folders WHERE id = $1';
        const result = await pool.query(query, [folderId]);
        
        return result.rows.length > 0;
    } catch {
        return false;
    }
};

/**
 * Searches folders by name with case-insensitive matching
 *
 * Performs partial name matching using LIKE operator.
 * Results are ordered alphabetically for consistent presentation.
 *
 * @param searchTerm - Search term to match against folder names
 * @param limit - Maximum number of folders to return (default: 20)
 * @param offset - Number of folders to skip for pagination (default: 0)
 * @returns Object containing matching folders array and total count
 * @throws {AppError} If database query fails
 */
export const searchFolders = async (searchTerm: string, limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        const searchPattern = `%${searchTerm}%`;
        
        // Query for folders matching search term
        const foldersQuery = `
            SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders
            WHERE LOWER(name) LIKE LOWER($1)
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        `;
        
        const foldersResult = await pool.query<Folder>(foldersQuery, [searchPattern, limit, offset]);
        
        // Count total matching folders
        const countQuery = 'SELECT COUNT(*) FROM folders WHERE LOWER(name) LIKE LOWER($1)';
        const countResult = await pool.query<{ count: string }>(countQuery, [searchPattern]);
        
        return {
            folders: foldersResult.rows,
            total: parseInt(countResult.rows[0].count, 10)
        };
    } catch {
        throw new AppError('Could not search folders in database.', 500);
    }
};