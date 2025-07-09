/**
 * Database Connection Configuration
 *
 * Establishes PostgreSQL database connection using drizzle-orm and pg.
 * Provides the main database instance used throughout the backend application.
 *
 * Configuration:
 * - Uses DATABASE_URL environment variable for connection
 * - Imports complete schema for type safety
 * - Configured for PostgreSQL with connection pooling
 *
 * Usage:
 * - Import 'db' instance in service files for database operations
 * - All database queries should go through this configured instance
 * - Schema provides TypeScript types for all tables and relationships
 *
 * Cross-references:
 * - drizzle/schema.ts: Database schema definitions
 * - src/services/: Service files using this database instance
 * - Environment: Requires DATABASE_URL configuration
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
