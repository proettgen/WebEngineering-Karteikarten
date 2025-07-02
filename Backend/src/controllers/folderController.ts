/**
 * Folder Controller
 *
 * Handles HTTP requests for folder operations including:
 * - CRUD operations for folders
 * - Hierarchical folder navigation (root folders, child folders)
 * - Folder search functionality with pagination
 * - Support for nested folder structures
 */

import { Request, Response, NextFunction } from 'express';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { folderSchema, folderUpdateSchema } from '../validation/folderValidation';
import { idSchema } from '../validation/common';
import { paginationSchema, searchPaginationSchema } from '../validation/pagination';

// Constants for default values and configuration
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

/**
 * Retrieves all folders with pagination support
 *
 * Query parameters:
 * - limit: Number of folders per page (default: 20)
 * - offset: Number of folders to skip for pagination
 */
export const getAllFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Parse and validate query parameters
        const { limit, offset } = paginationSchema.parse(req.query);
        
        // Use transformed pagination values directly (already converted to numbers by schema)
        const limitNum = limit ?? DEFAULT_LIMIT;
        const offsetNum = offset ?? DEFAULT_OFFSET;

        // Fetch folders from service layer
        const { folders, total } = await folderService.getAllFolders(limitNum, offsetNum);
        
        res.status(200).json({
            status: 'success',
            results: folders.length,
            limit: limitNum,
            offset: offsetNum,
            total,
            data: { folders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves a single folder by its unique identifier
 *
 * @param id - UUID of the folder to retrieve
 * @throws {AppError} 404 - If folder with given ID is not found
 */
export const getFolderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        idSchema.parse(id);
        
        // Fetch folder from service layer
        const folder = await folderService.getFolderById(id);

        if (!folder) {
            throw new AppError(`Folder with ID ${id} not found`, 404);
        }

        res.status(200).json({
            status: 'success',
            data: { folder }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new folder
 *
 * Supports creating both root folders (parentId = null) and nested folders.
 * The parentId is optional and defaults to null for root folders.
 */
export const createFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate and parse request body
        const parsed = folderSchema.parse(req.body);
        
        // Create folder with optional parentId (null for root folders)
        const folder = await folderService.createFolder({
            ...parsed,
            parentId: parsed.parentId ?? null
        });
        
        res.status(201).json({
            status: 'success',
            data: { folder }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing folder
 *
 * Supports partial updates including changing the folder's parent
 * to restructure the folder hierarchy.
 *
 * @param id - UUID of the folder to update
 * @throws {AppError} 404 - If folder with given ID is not found
 */
export const updateFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        idSchema.parse(id);
        
        // Validate and parse update data
        const parsed = folderUpdateSchema.parse(req.body);
        
        // Update folder through service layer
        const folder = await folderService.updateFolder(id, parsed);
        
        if (!folder) {
            throw new AppError(`Folder with ID ${id} not found`, 404);
        }
        
        res.status(200).json({
            status: 'success',
            data: { folder }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes a folder by its unique identifier
 *
 * @param id - UUID of the folder to delete
 * @returns 204 No Content on successful deletion
 */
export const deleteFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        idSchema.parse(id);
        
        // Delete folder through service layer
        await folderService.deleteFolder(id);
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Hierarchical folder controllers for navigation components
 * These endpoints support building tree-like folder structures in the UI
 */

/**
 * Retrieves all root folders (folders without a parent)
 *
 * Used to build the top level of folder hierarchy in the aside navigation.
 * Query parameters:
 * - limit: Number of folders per page (default: 20)
 * - offset: Number of folders to skip for pagination
 */
export const getRootFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Parse and validate query parameters
        const { limit, offset } = paginationSchema.parse(req.query);
        const limitNum = limit ?? DEFAULT_LIMIT;
        const offsetNum = offset ?? DEFAULT_OFFSET;

        // Fetch root folders from service layer
        const { folders, total } = await folderService.getRootFolders(limitNum, offsetNum);
        
        res.status(200).json({
            status: 'success',
            results: folders.length,
            limit: limitNum,
            offset: offsetNum,
            total,
            data: { folders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves all child folders of a specific parent folder
 *
 * Used to expand folder nodes in the hierarchical navigation.
 *
 * @param id - UUID of the parent folder
 */
export const getChildFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: parentId } = req.params;
        const { limit, offset } = paginationSchema.parse(req.query);
        
        // Validate parent folder UUID format
        idSchema.parse(parentId);
        
        const limitNum = limit ?? DEFAULT_LIMIT;
        const offsetNum = offset ?? DEFAULT_OFFSET;

        // Fetch child folders from service layer
        const { folders, total } = await folderService.getChildFolders(parentId, limitNum, offsetNum);
        
        res.status(200).json({
            status: 'success',
            results: folders.length,
            limit: limitNum,
            offset: offsetNum,
            total,
            data: { folders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Searches folders by name with pagination support
 *
 * Query parameters:
 * - search: Search term to match against folder names (required)
 * - limit: Number of folders per page (default: 20)
 * - offset: Number of folders to skip for pagination
 *
 * @throws {AppError} 400 - If search term is empty or missing
 */
export const searchFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Parse and validate query parameters
        const parsedQuery = searchPaginationSchema.parse(req.query);
        const { search, limit, offset } = parsedQuery;
        
        // Ensure search term is provided and not empty
        if (!search || search.trim() === '') {
            throw new AppError('Search term is required', 400);
        }
        
        // Use pagination parameters directly (already transformed by Zod)
        const limitNum = limit ?? DEFAULT_LIMIT;
        const offsetNum = offset ?? DEFAULT_OFFSET;
        const searchTerm = search.trim();

        // Perform search through service layer
        const { folders, total } = await folderService.searchFolders(searchTerm, limitNum, offsetNum);
        
        res.status(200).json({
            status: 'success',
            results: folders.length,
            limit: limitNum,
            offset: offsetNum,
            total,
            searchTerm: searchTerm,
            data: { folders }
        });
    } catch (error) {
        next(error);
    }
};