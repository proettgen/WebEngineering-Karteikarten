// Typen für den Lernmodus
// CardType beschreibt eine einzelne Karteikarte, wie sie im Lernmodus verwendet wird.
export type CardType = {
  id: string; // Eindeutige ID der Karte
  title: string; // Titel der Karte
  question: string; // Frage/Text auf der Vorderseite
  answer: string; // Antwort/Text auf der Rückseite
  tags?: string[] | null; // Optionale Tags zur Kategorisierung
  boxLevel?: number; // Aktuelle Box-Stufe (0-3)
};

// Props für die LearningMode-Komponente
export type LearningModeProps = {
  elapsedSeconds: number; // Bisher vergangene Zeit im Lernmodus (für Timer)
  cards: CardType[]; // Karten, die aktuell gelernt werden (nur aktuelle Box)
  onEvaluate?: (cardId: string, correct: boolean) => void; // Callback für Bewertung (richtig/falsch)
  onNextCard?: () => void; // Callback für Wechsel zur nächsten Karte
  onBack?: () => void; // Callback für Zurück-Button
  boxLevel?: number; // Aktuelle Box-Stufe (0-3)
};
