/**
 * useLearningMode Hook Types
 * 
 * Type definitions for the useLearningMode custom hook.
 */

import { Folder } from '@/database/folderTypes';
import { Card } from '@/database/cardTypes';

export type LearningModeStep = 'start' | 'select-folder' | 'select-box' | 'learn';

export interface FolderWithCardCount extends Folder {
  cardCount: number;
}

export interface BoxCount {
  level: number;
  count: number;
}

export interface UseLearningModeReturn {
  // Current state
  step: LearningModeStep;
  selectedFolder: FolderWithCardCount | null;
  selectedLearningLevel: number | null;
  elapsedSeconds: number;
  resetTrigger: number;
  
  // Data
  folders: FolderWithCardCount[];
  boxCounts: BoxCount[];
  masteredCount: number; // Number of cards in the invisible mastered box (Box 5)
  cards: Card[];
  
  // Loading states
  loadingFolders: boolean;
  loadingCards: boolean;
  loading: boolean;
  
  // Enhanced error states
  error: string | null;
  canRetry: boolean;
  isRetrying: boolean;
  
  // Actions
  startLearning: () => void;
  selectFolder: (_folder: FolderWithCardCount) => void;
  selectBox: (_level: number) => void;
  startBoxLearning: () => void;
  resetLearning: () => void;
  goBack: () => void;
  goBackToFolders: () => void;
  retryLastOperation: () => Promise<void>;
  refreshBoxCounts: () => Promise<void>;
  
  // Navigation
  navigateToCards: () => void;
}
