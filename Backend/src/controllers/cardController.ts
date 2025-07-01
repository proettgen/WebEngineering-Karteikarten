import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/cardService';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { cardSchema, cardUpdateSchema, cardFilterSchema, cardSortSchema } from '../validation/cardValidation';
import { idSchema } from '../validation/common';
import { paginationSchema } from '../validation/pagination';

const querySchema = cardFilterSchema.merge(paginationSchema).merge(cardSortSchema);

export const getAllCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { folderId, tags, title, limit, offset, sortBy, order } = querySchema.parse(req.query);
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const sortField = sortBy === 'currentLearningLevel' ? 'current_learning_level' : 'created_at';
        const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { cards, total } = await cardService.getAllCards({
            folderId, tags, title, limit: limitNum, offset: offsetNum, sortField, sortOrder
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

export const getCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id); // UUID-Validation
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

export const createCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsed = cardSchema.parse(req.body);
        const folderExists = await folderService.folderExists(parsed.folderId);
        if (!folderExists) {
            throw new AppError(`Folder with ID ${parsed.folderId} does not exist.`, 400);
        }

        const card = await cardService.createCard({
            ...parsed,
            tags: parsed.tags ?? null
        });
        res.status(201).json({
            status: 'success',
            data: { card }
        });
    } catch (error) {
        next(error);
    }
};

export const updateCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id);
        const parsed = cardUpdateSchema.parse(req.body);
        if (parsed.folderId) {
            const folderExists = await folderService.folderExists(parsed.folderId);
            if (!folderExists) {
                throw new AppError(`Folder with ID ${parsed.folderId} does not exist.`, 400);
            }
        }

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

export const deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id);
        await cardService.deleteCard(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCardsByFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: folderId } = req.params;
        idSchema.parse(folderId);
        const cards = await cardService.getCardsByFolder(folderId);
        res.status(200).json({ status: 'success', data: { cards } });
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

        // Parse request body without requiring folderId (we set it from params)
        const parsed = cardSchema.omit({ folderId: true }).parse(req.body);
        const card = await cardService.createCard({
            ...parsed,
            folderId,
            tags: parsed.tags ?? null,
            createdAt: parsed.createdAt || new Date().toISOString()
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
        // Ensure folderId cannot be changed via this endpoint
        const updateData = { ...parsed, folderId };
        
        const card = await cardService.updateCard(cardId, updateData);
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