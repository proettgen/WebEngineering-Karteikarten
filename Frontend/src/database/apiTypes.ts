/**
 * !!!
 * This file will be deleted in the long run and all should be migrated to cardTypes.ts and folderTypes.ts
 * These two files are synchronized to the Backend
 * This is just here as long as the changes to the Frontend aren't complete and you want to test it
 * !!!
 */

export interface Card {
  id: string;
  title: string;
  question: string;
  answer: string;
  tags: string[];
  boxLevel?: number; // Fachzuordnung für Karteikasten
}

export interface Folder {
  id: string;
  name: string;
  cards: Card[];
}

export interface DatabaseData {
  folders: Folder[];
}