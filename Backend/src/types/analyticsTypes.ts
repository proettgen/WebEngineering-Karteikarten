/**
 * Analytics TypeScript-Typdefinition
 *
 * Beschreibt die Struktur eines Analytics-Datensatzes (Lernstatistiken).
 * Wird sowohl im Backend als auch im Frontend verwendet (siehe sync-types.js).
 *
 * Felder:
 * - id: Eindeutige ID des Datensatzes (UUID)
 * - userId: ID des Benutzers, dem die Analytics gehören (Foreign Key)
 * - totalLearningTime: Gesamte Lernzeit in Sekunden
 * - totalCardsLearned: Anzahl gelernter Karten
 * - totalCorrect: Anzahl richtiger Antworten
 * - totalWrong: Anzahl falscher Antworten
 * - resets: Anzahl der Resets (Zurücksetzen des Lernfortschritts)
 * - updatedAt: Letztes Änderungsdatum (ISO-String)
 *
 * Querverweise:
 * - drizzle/schema.ts: Datenbankschema
 * - src/services/analyticsService.ts: Service-Logik
 * - src/controllers/analyticsController.ts: Controller-Logik
 */
export interface Analytics {
  id: string;
  userId: string;
  totalLearningTime: number;
  totalCardsLearned: number;
  totalCorrect: number;
  totalWrong: number;
  resets: number;
  updatedAt: string;
}
