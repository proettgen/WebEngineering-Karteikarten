import { Pool } from 'pg';
import { AppError } from '../utils/AppError';
import { Folder } from '../types/folderTypes';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const getAllFolders = async (limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        const data = await pool.query<Folder>(
            `SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const count = await pool.query<{ count: string }>('SELECT COUNT(*) FROM folders');
        return { folders: data.rows, total: parseInt(count.rows[0].count, 10) };
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

// Hierarchical folder functions for Aside component
export const getRootFolders = async (limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        const data = await pool.query<Folder>(
            `SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders 
            WHERE parent_id IS NULL
            ORDER BY name ASC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const count = await pool.query<{ count: string }>('SELECT COUNT(*) FROM folders WHERE parent_id IS NULL');
        return { folders: data.rows, total: parseInt(count.rows[0].count, 10) };
    } catch {
        throw new AppError('Could not retrieve root folders from database.', 500);
    }
};

export const getChildFolders = async (parentId: string, limit = 20, offset = 0): Promise<{ folders: Folder[]; total: number }> => {
    try {
        const data = await pool.query<Folder>(
            `SELECT id, name, parent_id AS "parentId", created_at AS "createdAt", last_opened_at AS "lastOpenedAt"
            FROM folders 
            WHERE parent_id = $1
            ORDER BY name ASC
            LIMIT $2 OFFSET $3`,
            [parentId, limit, offset]
        );
        const count = await pool.query<{ count: string }>('SELECT COUNT(*) FROM folders WHERE parent_id = $1', [parentId]);
        return { folders: data.rows, total: parseInt(count.rows[0].count, 10) };
    } catch {
        throw new AppError('Could not retrieve child folders from database.', 500);
    }
};

// Check if folder exists (for card validation)
export const folderExists = async (folderId: string): Promise<boolean> => {
    try {
        const res = await pool.query('SELECT 1 FROM folders WHERE id = $1', [folderId]);
        return res.rows.length > 0;
    } catch {
        return false;
    }
};