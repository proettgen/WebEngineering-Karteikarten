/**
 * Typdefinitionen für die LearningMode-Komponente (Organism).
 *
 * Diese Datei enthält die zentralen Typen für die Anzeige und Interaktion mit Karteikarten im Lernmodus.
 *
 * Übersicht der Typen:
 * - CardType: Beschreibt eine einzelne Karteikarte, wie sie im Lernmodus verwendet wird
 * - LearningModeProps: Props für die LearningMode-Komponente (siehe ../LearningMode/index.tsx)
 *
 * Cross-Referenzen:
 * - ../LearningMode/index.tsx: Verwendet diese Typen für Props und Karten
 * - ../LearningMode/styles.ts: Styled Components für das Layout
 */

// CardType beschreibt eine einzelne Karteikarte, wie sie im Lernmodus verwendet wird.
export type CardType = {
  id: string; // Eindeutige ID der Karte
  title: string; // Titel der Karte
  question: string; // Frage/Text auf der Vorderseite
  answer: string; // Antwort/Text auf der Rückseite
  tags?: string[] | null; // Optionale Tags zur Kategorisierung
  currentLearningLevel?: number; // Aktuelles Lernlevel/Box-Stufe (0-3)
};

// Props für die LearningMode-Komponente
export type LearningModeProps = {
  elapsedSeconds: number; // Bisher vergangene Zeit im Lernmodus (für Timer)
  cards: CardType[]; // Karten, die aktuell gelernt werden (nur aktuelle Box)
  onEvaluate?: (cardId: string, correct: boolean) => void; // Callback für Bewertung (richtig/falsch)
  onNextCard?: () => void; // Callback für Wechsel zur nächsten Karte
  onBack?: () => void; // Callback für Zurück-Button
  currentLearningLevel?: number; // Aktuelles Lernlevel/Box-Stufe (0-3)
};
