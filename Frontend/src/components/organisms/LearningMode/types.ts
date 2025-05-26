// Typen für den Lernmodus
export type CardType = {
  id: string;
  title: string;
  question: string;
  answer: string;
  tags?: string[] | null;
  boxLevel?: number;
};

export type LearningModeProps = {
  elapsedSeconds: number;
  cards: CardType[];
  onEvaluate?: (cardId: string, correct: boolean) => void;
  onNextCard?: () => void;
  onBack?: () => void;
};
