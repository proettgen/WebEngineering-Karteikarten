import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addUserIdToFolders(): Promise<void> {
  try {
    console.log('Starte Migration: Hinzufügen von userId zu folders...');

    // 1. Erstelle Test-User falls noch nicht vorhanden
    const testUserResult = await pool.query(`
      INSERT INTO users (id, username, email, password)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'testuser',
        'test@example.com',
        '$2b$10$dummy.hash.for.testing.purposes.only'
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id;
    `);

    if (testUserResult.rowCount && testUserResult.rowCount > 0) {
      console.log('Test-User erstellt');
    } else {
      console.log('Test-User bereits vorhanden');
    }

    // 2. Prüfe ob userId Spalte bereits existiert
    const columnExists = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'folders' AND column_name = 'user_id';
    `);

    if (columnExists.rowCount === 0) {
      // 3. Füge userId Spalte hinzu (erstmal nullable)
      await pool.query(`
        ALTER TABLE folders 
        ADD COLUMN user_id UUID;
      `);
      console.log('userId Spalte zu folders hinzugefügt');

      // 4. Setze userId für alle bestehenden Folders auf den Test-User
      const updateResult = await pool.query(`
        UPDATE folders 
        SET user_id = '550e8400-e29b-41d4-a716-446655440000'
        WHERE user_id IS NULL;
      `);
      console.log(`${updateResult.rowCount} bestehende Folders dem Test-User zugewiesen`);

      // 5. Mache userId NOT NULL
      await pool.query(`
        ALTER TABLE folders 
        ALTER COLUMN user_id SET NOT NULL;
      `);
      console.log('userId Spalte als NOT NULL gesetzt');

      // 6. Füge Foreign Key Constraint hinzu
      await pool.query(`
        ALTER TABLE folders 
        ADD CONSTRAINT fk_folders_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      `);
      console.log('Foreign Key Constraint hinzugefügt');

      // 7. Erstelle Index für bessere Performance
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
      `);
      console.log('Index für user_id erstellt');

    } else {
      console.log('userId Spalte existiert bereits in folders Tabelle');
    }

    console.log('Migration erfolgreich abgeschlossen!');

  } catch (err) {
    if (err instanceof Error) {
      console.error('Fehler bei der Migration:', err.message);
      console.error('Stack trace:', err.stack);
    } else {
      console.error('Unbekannter Fehler:', err);
    }
    throw err;
  } finally {
    await pool.end();
  }
}

// Nur ausführen, wenn das Script direkt aufgerufen wird
if (require.main === module) {
  void addUserIdToFolders();
}

export { addUserIdToFolders };
