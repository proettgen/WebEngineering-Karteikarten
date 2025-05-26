// Typen für den LearningModeManager
// Folder beschreibt einen Ordner mit Karteikarten.
export type Folder = {
  id: string; // Eindeutige ID des Ordners
  cards: any[]; // Karten im Ordner (könnten CardType sein)
  // ggf. weitere Eigenschaften
};

// Props für die LearningModeManager-Komponente
export type LearningModeManagerProps = {
  folder: Folder; // Aktuell ausgewählter Ordner
  boxLevel: number; // Aktuelle Box-Stufe (0-3)
  elapsedSeconds: number; // Bisher vergangene Zeit im Lernmodus
  onBack: () => void; // Callback für Zurück-Button
  onRestart?: () => void; // Callback für Neustart des Lernmodus
  onBackToFolders?: () => void; // Callback für Rückkehr zur Ordnerauswahl
};

// State-Interface für den Manager (optional, falls mit Klassenkomponenten gearbeitet wird)
export interface LearningModeManagerState {
  cards: any[]; // Karten im aktuellen Lernvorgang
  isCompleted: boolean; // Ob alle Karten gelernt wurden
  completedTime: number | null; // Zeit, die für das Lernen benötigt wurde
  resetKey: number; // Schlüssel zum Erzwingen eines Remounts
}
