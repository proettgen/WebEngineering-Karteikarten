/**
 * Analytics API Service
 *
 * @description Frontend service for all analytics-related API communication.
 * Provides comprehensive analytics data management with authentication, error handling,
 * and real-time learning tracking capabilities.
 *
 * @features
 * - Complete analytics CRUD operations with authentication
 * - Real-time learning activity tracking
 * - Consistent error handling patterns with other services
 * - Optimized request handling with proper caching
 * - Session-based learning analytics integration
 *
 * @cross-references
 * - {@link httpClient} - Unified HTTP client for API communication
 * - {@link analyticsTypes} - Analytics data type definitions
 * - {@link useAnalytics} - Hook consuming this service
 * - {@link useAnalyticsTracking} - Real-time tracking integration
 * - Backend: `/api/analytics/*` - Analytics REST endpoints
 *
 * @authentication All endpoints require valid JWT authentication
 * @error-handling Uses standardized error responses and retry logic
 *
 * @example
 * ```tsx
 * // Basic analytics operations
 * const analytics = await analyticsService.getAnalytics();
 * await analyticsService.updateAnalytics(updateData);
 * 
 * // Real-time tracking
 * await trackLearningTime({ folderId, timeSpent: 300, cardsStudied: 5 });
 * ```
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
  /**
   * Creates new analytics record for the current user.
   * 
   * @security Authentication required via credentials: 'include'
   * @validation Input validated against CreateAnalyticsInput schema
   */
  createAnalytics: (data: CreateAnalyticsInput): Promise<AnalyticsResponse> =>
    request(ANALYTICS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include', // Security Best Practice: Include auth credentials
    }),

  /**
   * Updates the analytics record for the current user.
   * 
   * @performance Uses PUT for idempotent updates
   * @security Authentication required via credentials: 'include'
   */
  updateAnalytics: (data: UpdateAnalyticsInput): Promise<AnalyticsResponse> =>
    request(ANALYTICS_ENDPOINT, {
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include', // Security Best Practice: Include auth credentials
    }),

  /**
   * Deletes the analytics record for the current user.
   * 
   * @security Authentication required, user can only delete own data
   * @data-protection Implements user's right to data deletion (GDPR compliance)
   */
  deleteAnalytics: (): Promise<void> =>
    request(ANALYTICS_ENDPOINT, {
      method: 'DELETE',
      credentials: 'include', // Security Best Practice: Include auth credentials
    }),

  /**
   * Live Learning Analytics Tracking API Methods
   * New API methods for real-time integration between Learning Mode and Analytics
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
 * Convenient export functions for new tracking methods
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
