/**
 * Database Schema Definitions
 *
 * Drizzle ORM schema definitions for all database tables.
 * Defines table structures, relationships, and constraints for the flashcard application.
 *
 * Tables:
 * - folders: Hierarchical folder structure for organizing flashcards
 * - cards: Individual flashcard data with learning progress tracking
 * - users: User account information and authentication
 * - analytics: Learning statistics and progress tracking data
 *
 * Features:
 * - UUID primary keys for security and scalability
 * - Foreign key relationships with cascade delete
 * - Automatic timestamp management
 * - Unique constraints for data integrity
 * - Learning level tracking for spaced repetition
 *
 * Cross-references:
 * - src/types/: TypeScript interfaces derived from these schemas
 * - src/services/: Business logic using these database structures
 * - migrations: Version-controlled schema changes in drizzle/ folder
 */

import { pgTable, text, timestamp, foreignKey, integer, unique, uuid, varchar } from "drizzle-orm/pg-core"



export const folders = pgTable("folders", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	parentId: text("parent_id"),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastOpenedAt: timestamp("last_opened_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.parentId],
		foreignColumns: [table.id],
		name: "folders_parent_id_folders_id_fk"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "folders_user_id_users_id_fk"
	}).onDelete("cascade"),
]);

export const cards = pgTable("cards", {
	id: text().primaryKey().notNull(),
	title: text(),
	question: text().notNull(),
	answer: text().notNull(),
	currentLearningLevel: integer("current_learning_level"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	tags: text().array(),
	folderId: text("folder_id").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.folderId],
		foreignColumns: [folders.id],
		name: "cards_folder_id_folders_id_fk"
	}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

/**
 * Analytics Table
 * 
 * Stores learning statistics and progress tracking data for each user.
 * Supports real-time updates from learning mode and comprehensive analytics reporting.
 */
export const analytics = pgTable("analytics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(), // Foreign key to users table
	totalLearningTime: integer("total_learning_time").default(0).notNull(), // Learning time in seconds
	totalCardsLearned: integer("total_cards_learned").default(0).notNull(), // Number of cards learned
	totalCorrect: integer("total_correct").default(0).notNull(), // Correct answers count
	totalWrong: integer("total_wrong").default(0).notNull(), // Wrong answers count
	resets: integer().default(0).notNull(), // Number of learning progress resets
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(), // Last update timestamp
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "analytics_user_id_users_id_fk"
	}).onDelete("cascade"),
]);
