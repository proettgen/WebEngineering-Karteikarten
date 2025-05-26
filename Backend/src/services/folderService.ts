import fs from 'fs/promises';
import path from 'path';
import { AppError } from '../utils/AppError.js';
import { FolderData } from '../types/folderTypes.js';


export const getMockFolders = async (): Promise<FolderData> => {
    // Use an absolute path to the data directory
    // This assumes your project structure is consistent
    const projectRoot = path.resolve(process.cwd());
    const filePath = path.join(projectRoot, 'src', 'data', 'mockFolders.json');
    
    console.log('Attempting to read mockFolders.json from:', filePath);
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const jsonData: FolderData = JSON.parse(fileContent) as FolderData; 
        return jsonData;
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("SyntaxError parsing mockFolders.json:", error);
            throw new AppError('Invalid data format in folders source.', 500);
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            console.error("mockFolders.json not found at path:", filePath, error);
            throw new AppError('Folders data source not found.', 404);
        }
        console.error("Error reading or parsing mockFolders.json:", error);
        throw new AppError('Could not retrieve folder data.', 500);
    }
};