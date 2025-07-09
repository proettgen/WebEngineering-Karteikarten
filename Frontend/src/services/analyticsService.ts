/**
 * Analytics Service (Frontend)
 *
 * This service handles all analytics-related API calls from the frontend.
 * Now follows the same patterns as cardAndFolderService with proper authentication
 * and consistent error handling.
 *
 * Cross-references:
 * - src/database/analyticsTypes.ts: Type definitions
 * - src/services/httpClient.ts: Unified HTTP client (should be used)
 * - Backend analytics routes: /api/analytics endpoints
 */

import { request } from "./httpClient";
import type { 
  AnalyticsResponse,
  CreateAnalyticsInput, 
  UpdateAnalyticsInput 
} from '../database/analyticsTypes';

const ANALYTICS_ENDPOINT = '/analytics';

/**
 * Analytics API service following the established patterns
 */
export const analyticsService = {
  /**
   * Gets analytics data for the current user.
   */
  getAnalytics: (): Promise<AnalyticsResponse> =>
    request(ANALYTICS_ENDPOINT, { 
      credentials: 'include' 
    }),

  /**
   * Creates a new analytics record for the current user.
   */
  createAnalytics: (data: CreateAnalyticsInput): Promise<AnalyticsResponse> =>
    request(ANALYTICS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    }),

  /**
   * Updates the analytics record for the current user.
   */
  updateAnalytics: (data: UpdateAnalyticsInput): Promise<AnalyticsResponse> =>
    request(ANALYTICS_ENDPOINT, {
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include',
    }),

  /**
   * Deletes the analytics record for the current user.
   */
  deleteAnalytics: (): Promise<void> =>
    request(ANALYTICS_ENDPOINT, {
      method: 'DELETE',
      credentials: 'include',
    }),

  /**
   * PHASE 4: Live Learning Analytics Tracking API Methods
   * Neue API-Methoden für die Echtzeit-Integration zwischen Learning Mode und Analytics
   */

  /**
   * Tracks a study session and updates analytics incrementally.
   */
  trackStudySession: (sessionData: {
    timeSpent: number;
    cardsStudied: number;
    correctAnswers: number;
    wrongAnswers: number;
  }): Promise<AnalyticsResponse> =>
    request(`${ANALYTICS_ENDPOINT}/track-study-session`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
      credentials: 'include',
    }),

  /**
   * Tracks a reset action and updates analytics.
   */
  trackReset: (resetType: 'folder' | 'learning_session'): Promise<AnalyticsResponse> =>
    request(`${ANALYTICS_ENDPOINT}/track-reset`, {
      method: 'POST',
      body: JSON.stringify({ resetType }),
      credentials: 'include',
    }),

  /**
   * Incremental update for real-time analytics.
   */
  incrementAnalytics: (increments: {
    totalLearningTime?: number;
    totalCardsLearned?: number;
    totalCorrect?: number;
    totalWrong?: number;
    resets?: number;
  }): Promise<AnalyticsResponse> =>
    request(`${ANALYTICS_ENDPOINT}/increment`, {
      method: 'POST',
      body: JSON.stringify(increments),
      credentials: 'include',
    }),
};

// Convenient export functions for components
export const getAnalytics = (): Promise<AnalyticsResponse> => 
  analyticsService.getAnalytics();

export const createAnalytics = (data: CreateAnalyticsInput): Promise<AnalyticsResponse> => 
  analyticsService.createAnalytics(data);

export const updateAnalytics = (data: UpdateAnalyticsInput): Promise<AnalyticsResponse> => 
  analyticsService.updateAnalytics(data);

export const deleteAnalytics = (): Promise<void> => 
  analyticsService.deleteAnalytics();

/**
 * PHASE 4: Convenient export functions for new tracking methods
 */
export const trackStudySession = (sessionData: {
  timeSpent: number;
  cardsStudied: number;
  correctAnswers: number;
  wrongAnswers: number;
}): Promise<AnalyticsResponse> => 
  analyticsService.trackStudySession(sessionData);

export const trackReset = (resetType: 'folder' | 'learning_session'): Promise<AnalyticsResponse> => 
  analyticsService.trackReset(resetType);

export const incrementAnalytics = (increments: {
  totalLearningTime?: number;
  totalCardsLearned?: number;
  totalCorrect?: number;
  totalWrong?: number;
  resets?: number;
}): Promise<AnalyticsResponse> => 
  analyticsService.incrementAnalytics(increments);
