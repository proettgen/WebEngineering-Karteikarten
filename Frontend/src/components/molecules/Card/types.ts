export interface CardProps {
  title: string;
  question: string;
  answer: string;
  tags: string[];
  onEdit?: (newTitle: string, newQuestion: string, newAnswer: string, newTags: string[]) => void;
  onDelete?: () => void;
  isFlipped?: boolean;
  onFlip?: () => void;
  showEditButton?: boolean;
}