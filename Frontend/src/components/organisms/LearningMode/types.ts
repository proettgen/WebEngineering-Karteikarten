/**
 * LearningMode Type Definitions
 *
 * This file contains the central types for displaying and interacting
 * with flashcards in learning mode.
 *
 * Type Overview:
 * - CardType: Describes a single flashcard as used in learning mode
 * - LearningModeProps: Props for the LearningMode component
 *
 * Cross-References:
 * - ../LearningMode/index.tsx: Uses these types for props and cards
 * - ../LearningMode/styles.ts: Styled components for layout
 */

// CardType describes a single flashcard as used in learning mode
export type CardType = {
  id: string; // Unique card ID
  title: string; // Card title
  question: string; // Question/text on the front side
  answer: string; // Answer/text on the back side
  tags?: string[] | null; // Optional tags for categorization
  currentLearningLevel?: number; // Current learning level/box stage (0-3)
};

// Props for the LearningMode component
export type LearningModeProps = {
  elapsedSeconds: number; // Time elapsed in learning mode (for timer)
  cards: CardType[]; // Cards currently being learned (current box only)
  onEvaluate?: (_cardId: string, _correct: boolean) => void; // Callback for evaluation (correct/wrong)
  onNextCard?: () => void; // Callback for switching to next card
  onBack?: () => void; // Callback for back button
  currentLearningLevel?: number; // Current learning level/box stage (0-3)
};
