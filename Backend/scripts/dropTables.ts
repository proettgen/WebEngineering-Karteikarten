import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function dropTables() {
    try {
        await pool.query('DROP TABLE IF EXISTS cards;');
        await pool.query('DROP TABLE IF EXISTS folders;');
        console.log('Tabellen wurden gelöscht!');
    } finally {
        await pool.end();
    }
}

void dropTables();