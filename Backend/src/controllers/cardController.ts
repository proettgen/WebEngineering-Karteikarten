import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/cardService';
import { AppError } from '../utils/AppError';
import { cardSchema, cardUpdateSchema } from '../validation/cardValidation';

export const getAllCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cards = await cardService.getAllCards();
        res.status(200).json({
            status: 'success',
            results: cards.length,
            data: { cards }
        });
    } catch (error) {
        next(error);
    }
};

export const getCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
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
        const parsed = cardUpdateSchema.parse(req.body);
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
        await cardService.deleteCard(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};