import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection(): Promise<void> {
  try {
    const res = await pool.query<{ now: string }>('SELECT NOW()');
    console.log('Verbindung erfolgreich! Serverzeit:', res.rows[0].now);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fehler bei der Verbindung:', err.message);
    } else {
      console.error('Unbekannter Fehler:', err);
    }
  } finally {
    await pool.end();
  }
}

void testConnection();