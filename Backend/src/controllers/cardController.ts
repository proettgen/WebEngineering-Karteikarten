/**
 * Card Controller
 *
 * Handles HTTP requests for flashcard operations including:
 * - CRUD operations for individual cards
 * - Batch operations for cards within folders
 * - Filtering, sorting, and pagination
 * - Folder-context specific card management
 */

import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/cardService';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { cardSchema, cardUpdateSchema, cardCreateInFolderSchema, cardFilterSchema, cardSortSchema } from '../validation/cardValidation';
import { idSchema } from '../validation/common';
import { paginationSchema } from '../validation/pagination';

// Constants for default values and configuration
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

// Combined schema for query validation (filters + pagination + sorting)
const querySchema = cardFilterSchema.merge(paginationSchema).merge(cardSortSchema);

/**
 * Retrieves all cards with optional filtering, sorting, and pagination
 *
 * Query parameters:
 * - folderId: Filter cards by folder
 * - tags: Filter cards by tags
 * - title: Filter cards by title (partial match)
 * - limit: Number of cards per page (default: 20)
 * - offset: Number of cards to skip for pagination
 * - sortBy: Field to sort by ('currentLearningLevel' or 'created_at')
 * - order: Sort order ('ASC' or 'DESC')
 */
export const getAllCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Parse and validate query parameters
        const { folderId, tags, title, limit, offset, sortBy, order } = querySchema.parse(req.query);
        
        // Convert string pagination values to numbers (like in the old working version)
        const limitNum = limit ?? DEFAULT_LIMIT;
        const offsetNum = offset ?? DEFAULT_OFFSET;
        
        // Fetch cards from service layer
        const { cards, total } = await cardService.getAllCards({
            folderId,
            tags,
            title,
            limit: limitNum,
            offset: offsetNum,
            sortBy,
            order
        });

        // Return standardized response format
        res.status(200).json({
            status: 'success',
            results: cards.length,
            limit: limitNum,
            offset: offsetNum,
            total,
            data: { cards }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves a single card by its unique identifier
 *
 * @param id - UUID of the card to retrieve
 * @throws {AppError} 404 - If card with given ID is not found
 */
export const getCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        idSchema.parse(id);
        
        // Fetch card from service layer
        const card = await cardService.getCardById(id);
        
        if (!card) {
            throw new AppError(`Card with ID ${id} not found`, 404);
        }

        res.status(200).json({
            status: 'success',
            data: { card }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new flashcard
 *
 * Validates the request body and ensures the target folder exists
 * before creating the card. Tags are optional and default to null.
 *
 * @throws {AppError} 400 - If folder does not exist
 */
export const createCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate and parse request body
        const parsed = cardSchema.parse(req.body);
        
        // Verify that the target folder exists
        const folderExists = await folderService.folderExists(parsed.folderId);
        if (!folderExists) {
            throw new AppError(`Folder with ID ${parsed.folderId} does not exist.`, 400);
        }

        // Create card with optional tags defaulting to null and set defaults
        const card = await cardService.createCard({
            ...parsed,
            tags: parsed.tags ?? null,
            currentLearningLevel: parsed.currentLearningLevel ?? 0,
            createdAt: parsed.createdAt ?? new Date().toISOString()
        });

        res.status(201).json({
            status: 'success',
            data: { card }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing flashcard
 *
 * Supports partial updates. If folderId is being changed,
 * validates that the new folder exists.
 *
 * @param id - UUID of the card to update
 * @throws {AppError} 400 - If new folder does not exist
 * @throws {AppError} 404 - If card with given ID is not found
 */
export const updateCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        idSchema.parse(id);
        
        // Validate and parse update data
        const parsed = cardUpdateSchema.parse(req.body);
        
        // If folderId is being changed, verify the new folder exists
        if (parsed.folderId) {
            const folderExists = await folderService.folderExists(parsed.folderId);
            if (!folderExists) {
                throw new AppError(`Folder with ID ${parsed.folderId} does not exist.`, 400);
            }
        }

        // Update card in service layer
        const card = await cardService.updateCard(id, parsed);
        
        if (!card) {
            throw new AppError(`Card with ID ${id} not found`, 404);
        }

        res.status(200).json({
            status: 'success',
            data: { card }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes a flashcard by its unique identifier
 *
 * @param id - UUID of the card to delete
 * @returns 204 No Content on successful deletion
 */
export const deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate UUID format
        idSchema.parse(id);
        
        // Delete card through service layer
        await cardService.deleteCard(id);
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves all cards belonging to a specific folder
 *
 * @param id - UUID of the folder (renamed from folderId for clarity)
 */
export const getCardsByFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId } = req.params;
        
        // Validate UUID format
        idSchema.parse(folderId);
        
        // Fetch cards from service layer
        const cards = await cardService.getCardsByFolder(folderId);
        
        res.status(200).json({
            status: 'success',
            data: { cards }
        });
    } catch (error) {
        next(error);
    }
};

// Folder-context card operations
export const createCardInFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId } = req.params;
        idSchema.parse(folderId);
        
        // Check if folder exists
        const folderExists = await folderService.folderExists(folderId);
        if (!folderExists) {
            throw new AppError(`Folder with ID ${folderId} does not exist.`, 404);
        }

        // Parse request body - use dedicated schema for folder context creation
        const parsed = cardCreateInFolderSchema.parse(req.body);
        
        const card = await cardService.createCard({
            ...parsed,
            folderId,
            tags: parsed.tags ?? null,
            currentLearningLevel: parsed.currentLearningLevel ?? 0,
            createdAt: parsed.createdAt ?? new Date().toISOString()
        });
        
        res.status(201).json({
            status: 'success',
            data: { card }
        });
    } catch (error) {
        next(error);
    }
};

export const updateCardInFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId, cardId } = req.params;
        idSchema.parse(folderId);
        idSchema.parse(cardId);
        
        // Check if folder exists
        const folderExists = await folderService.folderExists(folderId);
        if (!folderExists) {
            throw new AppError(`Folder with ID ${folderId} does not exist.`, 404);
        }

        // Ensure card belongs to this folder
        const existingCard = await cardService.getCardById(cardId);
        if (!existingCard) {
            throw new AppError(`Card with ID ${cardId} not found`, 404);
        }
        
        if (existingCard.folderId !== folderId) {
            throw new AppError(`Card ${cardId} does not belong to folder ${folderId}`, 400);
        }

        // Parse update data (allow partial updates, but keep folderId fixed)
        const parsed = cardUpdateSchema.parse(req.body);
        
        // Ensure folderId cannot be changed via this endpoint - remove any folderId from parsed data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { folderId: _, ...updateDataWithoutFolderId } = parsed;
        const updateData = { ...updateDataWithoutFolderId, folderId };

        // Logging entfernt

        const card = await cardService.updateCard(cardId, updateData);

        // Logging entfernt

        if (!card) {
            throw new AppError(`Failed to update card with ID ${cardId}`, 500);
        }
        res.status(200).json({
            status: 'success',
            data: { card }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCardInFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId, cardId } = req.params;
        idSchema.parse(folderId);
        idSchema.parse(cardId);
        
        // Check if folder exists
        const folderExists = await folderService.folderExists(folderId);
        if (!folderExists) {
            throw new AppError(`Folder with ID ${folderId} does not exist.`, 404);
        }

        // Ensure card belongs to this folder
        const existingCard = await cardService.getCardById(cardId);
        if (!existingCard) {
            throw new AppError(`Card with ID ${cardId} not found`, 404);
        }
        
        if (existingCard.folderId !== folderId) {
            throw new AppError(`Card ${cardId} does not belong to folder ${folderId}`, 400);
        }

        await cardService.deleteCard(cardId);
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};