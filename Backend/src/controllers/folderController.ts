import { Request, Response, NextFunction } from 'express';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { folderSchema, folderUpdateSchema } from '../validation/folderValidation';

export const getAllFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const folders = await folderService.getAllFolders();
        res.status(200).json({
        status: 'success',
        results: folders.length,
        data: {
            folders
        }
        });
    } catch (error) {
        next(error);
    }
};

export const getFolderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
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

export const createFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsed = folderSchema.parse(req.body);
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

export const updateFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsed = folderUpdateSchema.parse(req.body);
        const { id } = req.params;
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

export const deleteFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await folderService.deleteFolder(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};