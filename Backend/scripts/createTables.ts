import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id TEXT,
        created_at TIMESTAMP,
        last_opened_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        title TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        current_learning_level INTEGER,
        created_at TIMESTAMP,
        tags TEXT[],
        folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE
      );
    `);
    console.log('Tabellen wurden erfolgreich angelegt!');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fehler beim Anlegen der Tabellen:', err.message);
    } else {
      console.error('Unbekannter Fehler:', err);
    }
  } finally {
    await pool.end();
  }
}

void createTables();