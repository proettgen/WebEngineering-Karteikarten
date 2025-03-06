export interface CardFormProps {
  onSubmit: (title: string, question: string, answer: string, tags: string[]) => void;
}