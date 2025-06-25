import { Pool } from 'pg';
import { AppError } from '../utils/AppError';
import { Card } from '../types/cardTypes';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const getAllCards = async (limit = 20, offset = 0): Promise<{ cards: Card[]; total: number }> => {
    try {
        const data = await pool.query<Card>(
            `SELECT id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"
            FROM cards
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const count = await pool.query<{ count: string }>('SELECT COUNT(*) FROM cards');
        return { cards: data.rows, total: parseInt(count.rows[0].count, 10) };
    } catch {
        throw new AppError('Could not retrieve cards data from database.', 500);
    }
};

export const getCardById = async (id: string): Promise<Card | null> => {
    try {
        const res = await pool.query<Card>(
            `SELECT id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"
            FROM cards WHERE id = $1`,
            [id]
        );
        return res.rows[0] ?? null;
    } catch {
        throw new AppError('Could not retrieve card from database.', 500);
    }
};

export const createCard = async (card: Omit<Card, 'id'>): Promise<Card> => {
    try {
        const id = uuidv4();
        const res = await pool.query<Card>(
            `INSERT INTO cards (id, title, question, answer, current_learning_level, created_at, tags, folder_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"`,
            [
                id,
                card.title,
                card.question,
                card.answer,
                card.currentLearningLevel,
                card.createdAt,
                card.tags,
                card.folderId,
            ]
        );
        return res.rows[0];
    } catch {
        throw new AppError('Could not create card.', 500);
    }
};

export const updateCard = async (id: string, card: Partial<Card>): Promise<Card | null> => {
    try {
        const res = await pool.query<Card>(
            `UPDATE cards
            SET title = COALESCE($2, title),
                question = COALESCE($3, question),
                answer = COALESCE($4, answer),
                current_learning_level = COALESCE($5, current_learning_level),
                created_at = COALESCE($6, created_at),
                tags = COALESCE($7, tags),
                folder_id = COALESCE($8, folder_id)
            WHERE id = $1
            RETURNING id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"`,
            [
                id,
                card.title,
                card.question,
                card.answer,
                card.currentLearningLevel,
                card.createdAt,
                card.tags,
                card.folderId,
            ]
        );
        return res.rows[0] ?? null;
    } catch {
        throw new AppError('Could not update card.', 500);
    }
};

export const deleteCard = async (id: string): Promise<void> => {
    try {
        await pool.query('DELETE FROM cards WHERE id = $1', [id]);
    } catch {
        throw new AppError('Could not delete card.', 500);
    }
};

export const getCardsByFolder = async (folderId: string): Promise<Card[]> => {
    try {
        const res = await pool.query<Card>(
            `SELECT id, title, question, answer, current_learning_level AS "currentLearningLevel",
                    created_at AS "createdAt", tags, folder_id AS "folderId"
            FROM cards
            WHERE folder_id = $1`,
            [folderId]
        );
        return res.rows;
    } catch {
        throw new AppError('Could not retrieve cards for folder.', 500);
    }
};