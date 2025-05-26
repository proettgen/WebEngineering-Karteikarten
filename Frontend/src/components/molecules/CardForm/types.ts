export interface CardFormProps {
  onSubmit: (
    _title: string,
    _question: string,
    _answer: string,
    _tags: string[],
  ) => void;
  onDelete: () => void;
  initialTitle?: string;
  initialQuestion?: string;
  initialAnswer?: string;
  initialTags?: string;
  onCancel: () => void;
}
