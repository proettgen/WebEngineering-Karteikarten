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

import { AppError } from '../utils/AppError';
import { Folder } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index';
import { folders } from '../../drizzle/schema';
import { eq, ilike, sql, desc, asc, isNull, count } from 'drizzle-orm';

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
        const folderResults = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            })
            .from(folders)
            .orderBy(desc(folders.createdAt))
            .limit(limit)
            .offset(offset);
        
        // Query for total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(folders);
        
        return {
            folders: folderResults as Folder[],
            total: countResult[0]?.count ?? 0
        };
    } catch (error) {
        console.error('Error fetching all folders:', error);
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
        const result = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            })
            .from(folders)
            .where(eq(folders.id, id))
            .limit(1);
        
        return result[0] ? result[0] as Folder : null;
    } catch (error) {
        console.error('Error fetching folder by ID:', error);
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
        
        const result = await db
            .insert(folders)
            .values({
                id: folderId,
                name: folder.name,
                parentId: folder.parentId,
                createdAt: folder.createdAt,
                lastOpenedAt: folder.lastOpenedAt
            })
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            });
        
        return result[0] as Folder;
    } catch (error) {
        console.error('Error creating folder:', error);
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
        const updateData: Partial<typeof folders.$inferInsert> = {};
        
        if (folder.name !== undefined) updateData.name = folder.name;
        if (folder.parentId !== undefined) updateData.parentId = folder.parentId;
        if (folder.createdAt !== undefined) updateData.createdAt = folder.createdAt;
        if (folder.lastOpenedAt !== undefined) updateData.lastOpenedAt = folder.lastOpenedAt;
        
        const result = await db.update(folders)
            .set(updateData)
            .where(eq(folders.id, id))
            .returning();
        
        return result[0] ?? null;
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
        await db.delete(folders).where(eq(folders.id, id));
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
        const foldersResult = await db.select()
            .from(folders)
            .where(isNull(folders.parentId))
            .orderBy(asc(folders.name))
            .limit(limit)
            .offset(offset);
        
        // Count total root folders
        const countResult = await db.select({ count: count() })
            .from(folders)
            .where(isNull(folders.parentId));
        
        return {
            folders: foldersResult,
            total: countResult[0].count
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
        const foldersResult = await db.select()
            .from(folders)
            .where(eq(folders.parentId, parentId))
            .orderBy(asc(folders.name))
            .limit(limit)
            .offset(offset);
        
        // Count total child folders for this parent
        const countResult = await db.select({ count: count() })
            .from(folders)
            .where(eq(folders.parentId, parentId));
        
        return {
            folders: foldersResult,
            total: countResult[0].count
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
        const result = await db.select({ id: folders.id })
            .from(folders)
            .where(eq(folders.id, folderId))
            .limit(1);
        
        return result.length > 0;
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
        const foldersResult = await db.select()
            .from(folders)
            .where(ilike(folders.name, searchPattern))
            .orderBy(asc(folders.name))
            .limit(limit)
            .offset(offset);
        
        // Count total matching folders
        const countResult = await db.select({ count: count() })
            .from(folders)
            .where(ilike(folders.name, searchPattern));
        
        return {
            folders: foldersResult,
            total: countResult[0].count
        };
    } catch {
        throw new AppError('Could not search folders in database.', 500);
    }
};