import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/cardService';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { cardSchema, cardUpdateSchema } from '../validation/cardValidation';
import { idSchema } from '../validation/common';
import { paginationSchema } from '../validation/pagination';

export const getAllCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { limit, offset } = paginationSchema.parse(req.query);
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const offsetNum = offset ? parseInt(offset, 10) : 0;

        const { cards, total } = await cardService.getAllCards(limitNum, offsetNum);
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
        const { folderId } = req.params;
        idSchema.parse(folderId);
        const cards = await cardService.getCardsByFolder(folderId);
        res.status(200).json({ status: 'success', data: { cards } });
    } catch (error) {
        next(error);
    }
};