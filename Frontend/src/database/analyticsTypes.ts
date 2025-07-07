/**
 * Analytics TypeScript-Typdefinition (Frontend)
 *
 * Beschreibt die Struktur eines Analytics-Datensatzes (Lernstatistiken) im Frontend.
 * Wird für die Typisierung der Analytics-Daten verwendet, die von der API geladen werden.
 *
 * Felder:
 * - id: Eindeutige ID des Datensatzes (UUID)
 * - totalLearningTime: Gesamte Lernzeit in Sekunden
 * - totalCardsLearned: Anzahl gelernter Karten
 * - totalCorrect: Anzahl richtiger Antworten
 * - totalWrong: Anzahl falscher Antworten
 * - resets: Anzahl der Resets (Zurücksetzen des Lernfortschritts)
 * - updatedAt: Letztes Änderungsdatum (ISO-String)
 *
 * Querverweise:
 * - src/services/analyticsService.ts: API-Aufrufe für Analytics
 * - Backend/src/types/analyticsTypes.ts: Gemeinsame Typdefinition (wird synchronisiert)
 */
export interface Analytics {
  id: string;
  totalLearningTime: number;
  totalCardsLearned: number;
  totalCorrect: number;
  totalWrong: number;
  resets: number;
  updatedAt: string;
}
