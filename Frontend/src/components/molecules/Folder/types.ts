import { Card } from "@/database/cardTypes";

export interface FolderProps {
  name: string;
  cards: Card[];
  onAddCard: (
    _folderName: string,
    _title: string,
    _question: string,
    _answer: string,
    _tags: string[],
  ) => void;
  onEditCard: (
    _folderName: string,
    _cardIndex: number,
    _newTitle: string,
    _newQuestion: string,
    _newAnswer: string,
    _newTags: string[],
  ) => void;
  onDeleteCard: (
    _folderName: string,
    _cardIndex: number
  ) => void;
}
