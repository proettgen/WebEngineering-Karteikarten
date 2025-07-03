import { relations } from "drizzle-orm/relations";
import { folders, cards } from "./schema";

export const cardsRelations = relations(cards, ({one}) => ({
	folder: one(folders, {
		fields: [cards.folderId],
		references: [folders.id]
	}),
}));

export const foldersRelations = relations(folders, ({many}) => ({
	cards: many(cards),
}));