import { Request, Response, NextFunction } from 'express';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';
import { folderSchema, folderUpdateSchema } from '../validation/folderValidation';
import { idSchema } from '../validation/common'; 
import { paginationSchema } from '../validation/pagination';

export const getAllFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { limit, offset } = paginationSchema.parse(req.query);
        const limitNum = limit ? parseInt(limit, 10) : 20;
        const offsetNum = offset ? parseInt(offset, 10) : 0;

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

export const getFolderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        idSchema.parse(id); // <-- UUID-Validation
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
        const { id } = req.params;
        idSchema.parse(id);
        const parsed = folderUpdateSchema.parse(req.body);
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
        idSchema.parse(id);
        await folderService.deleteFolder(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};