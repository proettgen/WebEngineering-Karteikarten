/**
 * Analytics Type Definitions (Frontend)
 *
 * TypeScript type definitions for analytics data structures in the frontend application.
 * Provides type safety for analytics data used across components and API interactions.
 * Synchronized with backend analytics types for consistency.
 *
 * Main Interface - Analytics:
 * - id: Unique record identifier (UUID)
 * - userId: User who owns the analytics data (foreign key)
 * - totalLearningTime: Total learning time in seconds
 * - totalCardsLearned: Number of cards successfully learned
 * - totalCorrect: Number of correct answers given
 * - totalWrong: Number of incorrect answers given
 * - resets: Number of times learning progress was reset
 * - updatedAt: Last modification timestamp (ISO string)
 *
 * Cross-references:
 * - src/services/analyticsService.ts: API calls using these types
 * - Backend/src/types/analyticsTypes.ts: Backend type definitions
 * - src/components/organisms/AnalyticsDisplay/: Components using these types
 * - src/hooks/useAnalytics.ts: Analytics data management hooks
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
