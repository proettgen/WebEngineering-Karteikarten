/**
 * Datenbankverbindung (drizzle/db.ts)
 *
 * Stellt die Verbindung zur PostgreSQL-Datenbank über drizzle-orm und pg her.
 *
 * Hinweise für Einsteiger:
 * - Dieses Modul wird von allen Service-Dateien verwendet, um auf die Datenbank zuzugreifen.
 * - Die Konfiguration erfolgt über die Umgebungsvariable DATABASE_URL.
 * - Das Schema wird aus drizzle/schema.ts importiert (dort sind alle Tabellen definiert).
 *
 * Querverweise:
 * - drizzle/schema.ts: Datenbankschema (Tabellen)
 * - src/services/analyticsService.ts: Beispiel für die Nutzung der db-Instanz
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
