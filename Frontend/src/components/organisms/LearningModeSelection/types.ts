// Typen für LearningModeSelection
// Schritt-Typen für die Auswahl und Navigation im Lernmodus.
export type LearningModeSelectionStep = "start" | "select-folder" | "select-box" | "learn";

// Folder-Typ für die FolderList-Kompatibilität (nur id, name, optional cards)
export type FolderListFolder = {
  id: string;
  name: string;
  cards?: any[];
};