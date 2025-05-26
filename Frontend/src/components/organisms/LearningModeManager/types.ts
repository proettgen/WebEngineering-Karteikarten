// Typen für den LearningModeManager
export type Folder = {
  id: string;
  cards: any[];
  // ggf. weitere Eigenschaften
};

export type LearningModeManagerProps = {
  folder: Folder;
  boxLevel: number;
  elapsedSeconds: number;
  onBack: () => void;
  onRestart?: () => void;
  onBackToFolders?: () => void;
};

export interface LearningModeManagerState {
  cards: any[];
  isCompleted: boolean;
  completedTime: number | null;
  resetKey: number;
}
