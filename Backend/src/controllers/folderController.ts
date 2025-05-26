import { Request, Response, NextFunction } from 'express';
import * as folderService from '../services/folderService';
import { AppError } from '../utils/AppError';

export const getAllFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await folderService.getMockFolders();
        res.status(200).json({
            status: 'success',
            results: data.folders.length,
            data: {
                folders: data.folders
            }
        });
    } catch (error) {
        next(error);
    }
};

// Future controller methods
export const getFolderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const data = await folderService.getMockFolders();
        const folder = data.folders.find(f => f.id === id);
        
        if (!folder) {
            throw new AppError(`Folder with ID ${id} not found`, 404);
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                folder
            }
        });
    } catch (error) {
        next(error);
    }
};