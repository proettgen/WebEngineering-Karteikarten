import { Pool } from 'pg';
import { AppError } from '../utils/AppError';
import { Folder } from '../types/folderTypes';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const getAllFolders = async (): Promise<Folder[]> => {
    try {
        const res = await pool.query<Folder>(
        'SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt" FROM folders'
        );
        return res.rows;
    } catch {
        throw new AppError('Could not retrieve folder data from database.', 500);
    }
};

export const getFolderById = async (id: string): Promise<Folder | null> => {
    try {
        const res = await pool.query<Folder>(
        'SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt" FROM folders WHERE id = $1',
        [id]
        );
        return res.rows[0] ?? null;
    } catch {
        throw new AppError('Could not retrieve folder from database.', 500);
    }
};

export const createFolder = async (folder: Omit<Folder, 'id'>): Promise<Folder> => {
    try {
        const id = uuidv4();
        const res = await pool.query<Folder>(
        `INSERT INTO folders (id, name, parent_id, created_at, last_opened_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"`,
        [id, folder.name, folder.parentId, folder.createdAt, folder.lastOpenedAt]
        );
        return res.rows[0];
    } catch {
        throw new AppError('Could not create folder.', 500);
    }
};

export const updateFolder = async (id: string, folder: Partial<Folder>): Promise<Folder | null> => {
    try {
        const res = await pool.query<Folder>(
        `UPDATE folders
        SET name = COALESCE($2, name),
            parent_id = COALESCE($3, parent_id),
            created_at = COALESCE($4, created_at),
            last_opened_at = COALESCE($5, last_opened_at)
        WHERE id = $1
        RETURNING id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"`,
        [id, folder.name, folder.parentId, folder.createdAt, folder.lastOpenedAt]
        );
        return res.rows[0] ?? null;
    } catch {
        throw new AppError('Could not update folder.', 500);
    }
};

export const deleteFolder = async (id: string): Promise<void> => {
    try {
        await pool.query('DELETE FROM folders WHERE id = $1', [id]);
    } catch {
        throw new AppError('Could not delete folder.', 500);
    }
};


/* * Mock data retrieval for testing purposes.
 * This function reads from a local JSON file containing mock folder data.
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
    // Resolve path to data files. This works for development (ts-node) and production (Vercel).
    // __dirname is the directory of the current module.
    // In dev: src/services -> resolves to src/data
    // In prod (after build): dist/services -> resolves to dist/data
    const dataDir = path.resolve(__dirname, '..', 'data');
    const filePath = path.join(dataDir, filename);
    return filePath;
};

// Type guard for Node.js errors
const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return typeof error === 'object' && error !== null && 'code' in error;
};
*/