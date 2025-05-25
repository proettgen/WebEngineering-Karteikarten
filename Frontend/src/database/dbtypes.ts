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