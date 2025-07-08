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

export const analytics = pgTable("analytics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	totalLearningTime: integer("total_learning_time").default(0).notNull(),
	totalCardsLearned: integer("total_cards_learned").default(0).notNull(),
	totalCorrect: integer("total_correct").default(0).notNull(),
	totalWrong: integer("total_wrong").default(0).notNull(),
	resets: integer().default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
		columns: [table.userId],
		foreignColumns: [users.id],
		name: "analytics_user_id_users_id_fk"
	}).onDelete("cascade"),
]);
