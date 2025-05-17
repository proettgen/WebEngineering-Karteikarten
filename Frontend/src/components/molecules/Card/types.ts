export interface CardProps {
  title: string;
  question: string;
  answer: string;
  tags: string[];
  onEdit?: (
    _newTitle: string,
    _newQuestion: string,
    _newAnswer: string,
    _newTags: string[],
  ) => void;
  onDelete?: () => void;
  isFlipped?: boolean;
  onFlip?: () => void;
  showEditButton?: boolean;
}
