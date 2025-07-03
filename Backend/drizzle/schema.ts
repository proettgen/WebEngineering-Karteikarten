import { pgTable, text, timestamp, foreignKey, integer, unique, uuid, varchar } from "drizzle-orm/pg-core"



export const folders = pgTable("folders", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	parentId: text("parent_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastOpenedAt: timestamp("last_opened_at", { mode: 'string' }),
});

export const cards = pgTable("cards", {
	id: text().primaryKey().notNull(),
	title: text(),
	question: text().notNull(),
	answer: text().notNull(),
	currentLearningLevel: integer("current_learning_level"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	tags: text().array(),
	folderId: text("folder_id"),
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
