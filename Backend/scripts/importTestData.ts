import { Pool } from 'pg';
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

// Typen für die Daten
interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    lastOpenedAt: string;
}

interface Card {
    id: string;
    title: string;
    question: string;
    answer: string;
    currentLearingLevel: number;
    createdAt: string;
    tags: string[] | null;
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function importFolders() {
    const filePath = path.join(__dirname, '../src/data/mockFolders.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const { folders } = JSON.parse(raw) as { folders: Folder[] };

    for (const folder of folders) {
        await pool.query(
        `INSERT INTO folders (id, name, parent_id, created_at, last_opened_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING`,
        [folder.id, folder.name, folder.parentId, folder.createdAt, folder.lastOpenedAt]
    );
    }
    console.log('Ordner importiert!');
}

async function importCards() {
    const filePath = path.join(__dirname, '../src/data/mockCardStack.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const cardStack = JSON.parse(raw) as { folderId: string; cards: Card[] };

    for (const card of cardStack.cards) {
        await pool.query(
        `INSERT INTO cards (id, title, question, answer, current_learning_level, created_at, tags, folder_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING`,
        [
        card.id,
        card.title ?? null,
        card.question,
        card.answer,
        card.currentLearingLevel ?? null,
        card.createdAt,
        card.tags ?? [],
        cardStack.folderId,
        ]
    );
    }
    console.log('Karten importiert!');
}

async function main() {
    try {
    await importFolders();
    await importCards();
    console.log('Import abgeschlossen!');
    } catch (err) {
    if (err instanceof Error) {
        console.error('Fehler beim Import:', err.message);
    } else {
        console.error('Unbekannter Fehler:', err);
    }
    } finally {
    await pool.end();
    }
}

void main();