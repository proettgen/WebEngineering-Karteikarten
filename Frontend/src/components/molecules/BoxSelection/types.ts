/**
 * BoxSelection Component Types
 * 
 * Type definitions for the BoxSelection molecule component.
 */

export interface BoxCount {
  level: number;
  count: number;
}

export interface BoxSelectionProps {
  boxes: BoxCount[];
  selectedLevel: number | null;
  onSelect: (_level: number) => void;
  masteredCount?: number; // Number of cards in the invisible mastered box (Box 5)
  loading?: boolean;
  testId?: string;
}
