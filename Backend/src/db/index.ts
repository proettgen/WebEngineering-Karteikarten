//this file is used to set up the database connection using Drizzle ORM with Neon as the database provider.
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../../drizzle/schema';
import * as relations from '../../drizzle/relations';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema: { ...schema, ...relations } });