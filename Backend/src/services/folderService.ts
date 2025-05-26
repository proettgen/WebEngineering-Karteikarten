import fs from 'fs/promises';
import path from 'path';
import { AppError } from '../utils/AppError';
import { FolderData } from '../types/folderTypes';

export const getMockFolders = async (): Promise<FolderData> => {
    try {
        const filePath = getDataFilePath('mockFolders.json');
        console.log('📁 Reading mockFolders.json from:', filePath);
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent) as FolderData;
        
        // Validate the data structure
        if (!jsonData.folders || !Array.isArray(jsonData.folders)) {
            throw new AppError('Invalid data structure in folders source.', 500);
        }
        
        return jsonData;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("❌ SyntaxError parsing mockFolders.json:", error.message);
            throw new AppError('Invalid JSON format in folders source.', 500);
        }
        
        if (isNodeError(error) && error.code === 'ENOENT') {
            console.error("❌ mockFolders.json not found at expected path");
            throw new AppError('Folders data source not found.', 404);
        }
        
        console.error("❌ Error reading or parsing mockFolders.json:", error);
        throw new AppError('Could not retrieve folder data.', 500);
    }
};

const getDataFilePath = (filename: string): string => {
    // Try different possible paths
    const possiblePaths = [
        path.join(process.cwd(), 'src', 'data', filename),
        path.join(process.cwd(), 'dist', 'data', filename),
    ];
    
    return possiblePaths[0];
};

// Type guard for Node.js errors
const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return typeof error === 'object' && error !== null && 'code' in error;
};