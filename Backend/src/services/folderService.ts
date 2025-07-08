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
import { Folder, FolderInput } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index';
import { folders } from '../../drizzle/schema';
import { eq, ilike, sql, desc, asc, isNull, count, and } from 'drizzle-orm';

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
                userId: folders.userId,
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
                userId: folders.userId,
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
 * DEPRECATED: Use createUserFolder instead for user-based operations
 * This function is kept for backward compatibility but requires userId
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
                userId: folder.userId,
                createdAt: folder.createdAt,
                lastOpenedAt: folder.lastOpenedAt
            })
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
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

// =============================================================================
// USER-BASED FOLDER OPERATIONS (NEW)
// =============================================================================

/**
 * Get all folders belonging to a specific user
 *
 * @param userId - UUID of the user
 * @param limit - Maximum number of folders to return
 * @param offset - Number of folders to skip for pagination
 * @returns Object containing user's folders and total count
 */
export const getUserFolders = async (
    userId: string, 
    limit = 20, 
    offset = 0
): Promise<{ folders: Folder[]; total: number }> => {
    try {
        const folderResults = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            })
            .from(folders)
            .where(eq(folders.userId, userId))
            .orderBy(desc(folders.createdAt))
            .limit(limit)
            .offset(offset);
        
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(folders)
            .where(eq(folders.userId, userId));
        
        return {
            folders: folderResults as Folder[],
            total: countResult[0].count
        };
    } catch (error) {
        console.error('Error fetching user folders:', error);
        throw new AppError('Could not retrieve user folders from database.', 500);
    }
};

/**
 * Create a folder for a specific user
 *
 * @param userId - UUID of the user who owns the folder
 * @param folderData - Folder input data (name, parentId)
 * @returns Created folder
 */
export const createUserFolder = async (
    userId: string, 
    folderData: FolderInput
): Promise<Folder> => {
    try {
        // If parentId is provided, verify it belongs to the same user
        if (folderData.parentId) {
            const parentOwnership = await verifyFolderOwnership(folderData.parentId, userId);
            if (!parentOwnership) {
                throw new AppError('Parent folder not found or access denied', 403);
            }
        }

        const folderId = uuidv4();
        const now = new Date().toISOString();
        
        const result = await db
            .insert(folders)
            .values({
                id: folderId,
                name: folderData.name,
                parentId: folderData.parentId || null,
                userId: userId,
                createdAt: now,
                lastOpenedAt: null
            })
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            });
        
        return result[0] as Folder;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error creating user folder:', error);
        throw new AppError('Could not create folder in database.', 500);
    }
};

/**
 * Verify if a folder belongs to a specific user
 *
 * @param folderId - UUID of the folder
 * @param userId - UUID of the user
 * @returns true if user owns the folder, false otherwise
 */
export const verifyFolderOwnership = async (
    folderId: string, 
    userId: string
): Promise<boolean> => {
    try {
        const result = await db
            .select({ id: folders.id })
            .from(folders)
            .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
            .limit(1);
        
        return result.length > 0;
    } catch (error) {
        console.error('Error verifying folder ownership:', error);
        return false;
    }
};

/**
 * Get a specific folder for a user (with ownership verification)
 *
 * @param folderId - UUID of the folder
 * @param userId - UUID of the user
 * @returns Folder if owned by user, null otherwise
 */
export const getUserFolder = async (
    folderId: string, 
    userId: string
): Promise<Folder | null> => {
    try {
        const result = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            })
            .from(folders)
            .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
            .limit(1);
        
        return result.length > 0 ? result[0] as Folder : null;
    } catch (error) {
        console.error('Error fetching user folder:', error);
        return null;
    }
};

/**
 * Update a folder for a specific user (with ownership verification)
 *
 * @param folderId - UUID of the folder to update
 * @param userId - UUID of the user
 * @param updateData - Partial folder data to update
 * @returns Updated folder if successful, null if not found/owned
 */
export const updateUserFolder = async (
    folderId: string, 
    userId: string, 
    updateData: Partial<FolderInput>
): Promise<Folder | null> => {
    try {
        // First verify ownership
        const hasOwnership = await verifyFolderOwnership(folderId, userId);
        if (!hasOwnership) return null;

        // If updating parentId, verify new parent is owned by same user
        if (updateData.parentId) {
            const parentOwnership = await verifyFolderOwnership(updateData.parentId, userId);
            if (!parentOwnership) {
                throw new AppError('New parent folder not found or access denied', 403);
            }
        }

        const result = await db
            .update(folders)
            .set({
                ...updateData,
                lastOpenedAt: new Date().toISOString() // Update last accessed time
            })
            .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
            .returning({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            });
        
        return result.length > 0 ? result[0] as Folder : null;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error updating user folder:', error);
        throw new AppError('Could not update folder in database.', 500);
    }
};

/**
 * Delete a folder for a specific user (with ownership verification)
 *
 * @param folderId - UUID of the folder to delete
 * @param userId - UUID of the user
 * @returns true if deleted successfully, false if not found/owned
 */
export const deleteUserFolder = async (
    folderId: string, 
    userId: string
): Promise<boolean> => {
    try {
        const result = await db
            .delete(folders)
            .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
            .returning({ id: folders.id });
        
        return result.length > 0;
    } catch (error) {
        console.error('Error deleting user folder:', error);
        return false;
    }
};

/**
 * Get root folders for a specific user (folders with no parent)
 *
 * @param userId - UUID of the user
 * @param limit - Maximum number of folders to return
 * @param offset - Number of folders to skip for pagination
 * @returns Object containing user's root folders and total count
 */
export const getUserRootFolders = async (
    userId: string, 
    limit = 20, 
    offset = 0
): Promise<{ folders: Folder[]; total: number }> => {
    try {
        const folderResults = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            })
            .from(folders)
            .where(and(eq(folders.userId, userId), isNull(folders.parentId)))
            .orderBy(desc(folders.createdAt))
            .limit(limit)
            .offset(offset);
        
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(folders)
            .where(and(eq(folders.userId, userId), isNull(folders.parentId)));
        
        return {
            folders: folderResults as Folder[],
            total: countResult[0].count
        };
    } catch (error) {
        console.error('Error fetching user root folders:', error);
        throw new AppError('Could not retrieve user root folders from database.', 500);
    }
};

/**
 * Searches folders by name for a specific user with pagination
 *
 * @param userId - UUID of the user whose folders to search
 * @param searchTerm - Term to search for in folder names
 * @param limit - Maximum number of folders to return
 * @param offset - Number of folders to skip
 * @returns Object containing matching folders and total count
 */
export const searchUserFolders = async (
    userId: string, 
    searchTerm: string, 
    limit: number, 
    offset: number
): Promise<{ folders: Folder[]; total: number }> => {
    try {
        // Search user's folders with name matching the search term
        const folderResults = await db
            .select({
                id: folders.id,
                name: folders.name,
                parentId: folders.parentId,
                userId: folders.userId,
                createdAt: folders.createdAt,
                lastOpenedAt: folders.lastOpenedAt
            })
            .from(folders)
            .where(and(
                eq(folders.userId, userId),
                ilike(folders.name, `%${searchTerm}%`)
            ))
            .orderBy(desc(folders.lastOpenedAt))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(folders)
            .where(and(
                eq(folders.userId, userId),
                ilike(folders.name, `%${searchTerm}%`)
            ));

        return {
            folders: folderResults as Folder[],
            total: countResult[0]?.count ?? 0
        };
    } catch (error) {
        console.error('Error searching user folders:', error);
        throw new AppError('Could not search folders.', 500);
    }
};