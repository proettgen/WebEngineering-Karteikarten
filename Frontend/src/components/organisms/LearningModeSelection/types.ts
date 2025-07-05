/**
 * Typdefinitionen für die LearningModeSelection-Komponente (Organism).
 *
 * Diese Datei enthält die zentralen Typen für die Auswahl- und Navigationslogik im Lernmodus.
 *
 * Übersicht der Typen:
 * - LearningModeSelectionStep: Schritt-Typen für die Auswahl und Navigation im Lernmodus
 * - FolderListFolder: Typ für die FolderList-Kompatibilität (nur id, name, optional cards)
 *
 * Cross-Referenzen:
 * - ../LearningModeSelection/index.tsx: Verwendet diese Typen für State und Props
 * - ../LearningModeSelection/styles.ts: Styled Components für das Layout
 */

// Schritt-Typen für die Auswahl und Navigation im Lernmodus.
export type LearningModeSelectionStep = "start" | "select-folder" | "select-box" | "learn";

// Folder-Typ für die FolderList-Kompatibilität (nur id, name, optional cards)
export type FolderListFolder = {
  id: string;
  name: string;
  cards?: any[];
};