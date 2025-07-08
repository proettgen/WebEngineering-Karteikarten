/**
 * Card Controller
 *
 * Handles HTTP requests for flashcard operations including:
 * - User-based CRUD operations for individual cards
 * - Batch operations for cards within user-owned folders
 * - Filtering, sorting, and pagination
 * - Folder-context specific card management with ownership verification
 */

import { Response, NextFunction } from 'express';
import * as cardService from '../services/cardService';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { cardSchema, cardUpdateSchema, cardCreateInFolderSchema, cardFilterSchema, cardSortSchema } from '../validation/cardValidation';
import { idSchema } from '../validation/common';
import { paginationSchema } from '../validation/pagination';
import { AuthenticatedRequest } from '../types/authTypes';

// Constants for default values and configuration
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

// Combined schema for query validation (filters + pagination + sorting)
const querySchema = cardFilterSchema.merge(paginationSchema).merge(cardSortSchema);

/**
 * Retrieves all cards belonging to the authenticated user with optional filtering, sorting, and pagination
 */
export const getAllCards = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Parse and validate query parameters
        const { folderId, tags, title, limit, offset, sortBy, order } = querySchema.parse(req.query);
        
        // Convert string pagination values to numbers
        const limitNum = limit ?? DEFAULT_LIMIT;
        const offsetNum = offset ?? DEFAULT_OFFSET;
        
        // If folderId is provided, verify user owns the folder
        if (folderId) {
            const folderOwnership = await folderService.verifyFolderOwnership(folderId, req.user!.id);
            if (!folderOwnership) {
                throw new AppError('Access denied to specified folder', 403);
            }
        }
        
        // Fetch user's cards from service layer
        const { cards, total } = await cardService.getUserCards(req.user!.id, {
            folderId,
            tags,
            title,
            limit: limitNum,
            offset: offsetNum,
            sortBy,
            order
        });
        
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

export const getCardById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id);
        
        const card = await cardService.getUserCard(id, req.user!.id);
        
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

export const createCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsed = cardSchema.parse(req.body);
        
        const card = await cardService.createUserCard(req.user!.id, {
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

export const updateCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id);
        
        const parsed = cardUpdateSchema.parse(req.body);
        const card = await cardService.updateUserCard(id, req.user!.id, parsed);
        
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

export const deleteCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id);
        
        const deleted = await cardService.deleteUserCard(id, req.user!.id);
        
        if (!deleted) {
            throw new AppError(`Card with ID ${id} not found`, 404);
        }
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCardsByFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId } = req.params;
        idSchema.parse(folderId);
        
        const cards = await cardService.getUserCardsByFolder(req.user!.id, folderId);
        
        res.status(200).json({
            status: 'success',
            data: { cards }
        });
    } catch (error) {
        next(error);
    }
};

export const createCardInFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId } = req.params;
        idSchema.parse(folderId);
        
        const folderOwnership = await folderService.verifyFolderOwnership(folderId, req.user!.id);
        if (!folderOwnership) {
            throw new AppError(`Folder with ID ${folderId} not found`, 404);
        }

        const parsed = cardCreateInFolderSchema.parse(req.body);
        
        const card = await cardService.createUserCard(req.user!.id, {
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

export const updateCardInFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId, cardId } = req.params;
        idSchema.parse(folderId);
        idSchema.parse(cardId);
        
        const folderOwnership = await folderService.verifyFolderOwnership(folderId, req.user!.id);
        if (!folderOwnership) {
            throw new AppError(`Folder with ID ${folderId} not found`, 404);
        }

        const existingCard = await cardService.getUserCard(cardId, req.user!.id);
        if (!existingCard) {
            throw new AppError(`Card with ID ${cardId} not found`, 404);
        }
        
        if (existingCard.folderId !== folderId) {
            throw new AppError(`Card ${cardId} does not belong to folder ${folderId}`, 400);
        }

        const parsed = cardUpdateSchema.parse(req.body);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { folderId: _, ...updateDataWithoutFolderId } = parsed;
        const updateData = { ...updateDataWithoutFolderId, folderId };

        const card = await cardService.updateUserCard(cardId, req.user!.id, updateData);

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

export const deleteCardInFolder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId, cardId } = req.params;
        idSchema.parse(folderId);
        idSchema.parse(cardId);
        
        const folderOwnership = await folderService.verifyFolderOwnership(folderId, req.user!.id);
        if (!folderOwnership) {
            throw new AppError(`Folder with ID ${folderId} not found`, 404);
        }

        const existingCard = await cardService.getUserCard(cardId, req.user!.id);
        if (!existingCard) {
            throw new AppError(`Card with ID ${cardId} not found`, 404);
        }
        
        if (existingCard.folderId !== folderId) {
            throw new AppError(`Card ${cardId} does not belong to folder ${folderId}`, 400);
        }

        const deleted = await cardService.deleteUserCard(cardId, req.user!.id);
        
        if (!deleted) {
            throw new AppError(`Failed to delete card with ID ${cardId}`, 500);
        }
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};