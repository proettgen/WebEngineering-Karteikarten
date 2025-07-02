import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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