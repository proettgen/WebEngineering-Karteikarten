/**
 * LearningModeManager Type Definitions
 *
 * This file contains the central types for managing the learning process
 * of a specific box.
 *
 * Type Overview:
 * - Folder: Describes a folder containing flashcards
 * - LearningModeManagerProps: Props for the LearningModeManager component
 * - LearningModeManagerState: (optional) State interface for class components
 *
 * Cross-References:
 * - ../LearningModeManager/index.tsx: Uses these types for props and state
 * - ../LearningModeManager/styles.ts: Styled components for layout
 */

// Folder describes a folder containing flashcards
export type Folder = {
  id: string; // Unique folder ID
  name: string; // Folder name
  cards?: any[]; // Cards in the folder (optional, for compatibility)
  // Additional properties as needed
};

// Props for the LearningModeManager component
export type LearningModeManagerProps = {
  folder: Folder; // Currently selected folder
  currentLearningLevel: number; // Current learning level/box stage (0-3)
  elapsedSeconds: number; // Time elapsed in learning mode so far
  onBack: () => void; // Callback for back button
  onRestart?: () => void; // Callback for restarting learning mode
  onRefreshCounts?: () => Promise<void>; // Callback to update box counts
  onBackToFolders?: () => void; // Callback for returning to folder selection
};

// State interface for the manager (optional, if working with class components)
export interface LearningModeManagerState {
  cards: any[]; // Cards in the current learning session
  isCompleted: boolean; // Whether all cards have been learned
  completedTime: number | null; // Time required for learning
  resetKey: number; // Key to force component remount
}
