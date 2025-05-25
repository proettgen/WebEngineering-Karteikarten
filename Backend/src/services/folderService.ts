import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/AppError.js';
import { FolderData } from '../types/folderTypes.js'; // Import the new type

// Derive __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMockFolders = async (): Promise<FolderData> => { // Use FolderData as the return type
    const filePath = path.join(__dirname, '..', 'data', 'mockFolders.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // Assuming the JSON structure matches FolderData, parse it.
        // For stronger type safety, you might add validation here (e.g., with Zod or io-ts)
        // but for now, a type assertion or direct parsing is common.
        const jsonData: FolderData = JSON.parse(fileContent) as FolderData; 
        return jsonData;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("SyntaxError parsing mockFolders.json:", error);
            throw new AppError('Invalid data format in folders source.', 500);
        }
        // Check if error is an instance of NodeJS.ErrnoException for file system errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            console.error("mockFolders.json not found at path:", filePath, error);
            throw new AppError('Folders data source not found.', 404);
        }
        console.error("Error reading or parsing mockFolders.json:", error);
        throw new AppError('Could not retrieve folder data.', 500);
    }
};