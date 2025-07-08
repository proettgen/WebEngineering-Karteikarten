/**
 * Analytics TypeScript-Typdefinition (Frontend)
 *
 * Beschreibt die Struktur eines Analytics-Datensatzes (Lernstatistiken) im Frontend.
 * Wird für die Typisierung der Analytics-Daten verwendet, die von der API geladen werden.
 * Entspricht dem Backend-Schema.
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
 * - src/services/analyticsService.ts: API-Aufrufe für Analytics
 * - Backend/src/types/analyticsTypes.ts: Backend Typdefinition
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

// Response types for API calls
export interface AnalyticsResponse {
  status: 'success';
  data: Analytics;
}

// Input types for API calls
export interface CreateAnalyticsInput {
  totalLearningTime?: number;
  totalCardsLearned?: number;
  totalCorrect?: number;
  totalWrong?: number;
  resets?: number;
}

export interface UpdateAnalyticsInput {
  totalLearningTime?: number;
  totalCardsLearned?: number;
  totalCorrect?: number;
  totalWrong?: number;
  resets?: number;
}
