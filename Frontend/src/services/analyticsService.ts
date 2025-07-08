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
