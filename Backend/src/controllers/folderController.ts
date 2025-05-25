import { Request, Response, NextFunction } from 'express';
import * as folderService from '../services/folderService.js';
// import { AppError } from '../utils/AppError'; // Import if you need to throw specific errors from controller

export const getAllFolders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await folderService.getMockFolders();
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        // Pass the error to the global error handler
        next(error);
    }
};