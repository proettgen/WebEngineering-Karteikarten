export interface CardFormProps {
  onSubmit: (title: string, question: string, answer: string, tags: string[]) => void;
  onDelete: () => void;
  initialTitle?: string;
  initialQuestion?: string;
  initialAnswer?: string;
  initialTags?: string;
}