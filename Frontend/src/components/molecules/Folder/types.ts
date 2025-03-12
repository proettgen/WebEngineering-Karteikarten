export interface FolderProps {
  name: string;
  cards: { title: string; question: string; answer: string; tags: string[] }[];
  onAddCard: (folderName: string, title: string, question: string, answer: string, tags: string[]) => void;
  onEditCard: (folderName: string, cardIndex: number, newTitle: string, newQuestion: string, newAnswer: string, newTags: string[]) => void;
  onDeleteCard: (folderName: string, cardIndex: number) => void;
}