/**
 * Typdefinitionen für die LearningModeManager-Komponente (Organism).
 *
 * Diese Datei enthält die zentralen Typen für die Verwaltung des Lernvorgangs einer Box.
 *
 * Übersicht der Typen:
 * - Folder: Beschreibt einen Ordner mit Karteikarten
 * - LearningModeManagerProps: Props für die LearningModeManager-Komponente (siehe ../LearningModeManager/index.tsx)
 * - LearningModeManagerState: (optional) State-Interface für Klassenkomponenten
 *
 * Cross-Referenzen:
 * - ../LearningModeManager/index.tsx: Verwendet diese Typen für Props und State
 * - ../LearningModeManager/styles.ts: Styled Components für das Layout
 */

// Folder beschreibt einen Ordner mit Karteikarten.
export type Folder = {
  id: string; // Eindeutige ID des Ordners
  name: string; // Name des Ordners
  cards?: any[]; // Karten im Ordner (optional, für Kompatibilität)
  // ggf. weitere Eigenschaften
};

// Props für die LearningModeManager-Komponente
export type LearningModeManagerProps = {
  folder: Folder; // Aktuell ausgewählter Ordner
  currentLearningLevel: number; // Aktuelles Lernlevel/Box-Stufe (0-3)
  elapsedSeconds: number; // Bisher vergangene Zeit im Lernmodus
  onBack: () => void; // Callback für Zurück-Button
  onRestart?: () => void; // Callback für Neustart des Lernmodus
  onRefreshCounts?: () => Promise<void>; // Callback zum Aktualisieren der Box-Counts
  onBackToFolders?: () => void; // Callback für Rückkehr zur Ordnerauswahl
};

// State-Interface für den Manager (optional, falls mit Klassenkomponenten gearbeitet wird)
export interface LearningModeManagerState {
  cards: any[]; // Karten im aktuellen Lernvorgang
  isCompleted: boolean; // Ob alle Karten gelernt wurden
  completedTime: number | null; // Zeit, die für das Lernen benötigt wurde
  resetKey: number; // Schlüssel zum Erzwingen eines Remounts
}
