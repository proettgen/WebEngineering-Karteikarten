export interface Card {
  title: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface Folder {
  id: string;
  name: string;
  cards: Card[];
}

export interface DatabaseData {
  folders: Folder[];
}