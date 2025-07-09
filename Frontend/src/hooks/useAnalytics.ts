/**
 * Analytics Data Management Hook
 *
 * @description Custom React hook for managing user analytics data and operations.
 * Provides comprehensive state management for learning statistics with optimistic updates
 * and robust error handling.
 *
 * @features
 * - Automatic analytics data loading on component mount
 * - CRUD operations for analytics with error recovery
 * - Loading states and error management
 * - Optimistic updates for improved user experience
 * - Authentication-aware API calls
 *
 * @cross-references
 * - {@link analyticsService} - Backend API communication for analytics
 * - {@link Analytics} - Core analytics data types
 * - {@link AnalyticsTemplate} - Main UI component consuming this hook
 * - {@link useAnalyticsTracking} - Real-time learning analytics tracking
 *
 * @returns {UseAnalyticsReturn} Analytics state and management functions
 *
 * @example
 * ```tsx
 * const {
 *   analytics,
 *   loading,
 *   error,
 *   loadAnalytics,
 *   updateAnalyticsData
 * } = useAnalytics();
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAnalytics, 
  updateAnalytics 
} from '../services/analyticsService';
import type { 
  Analytics, 
  CreateAnalyticsInput, 
  UpdateAnalyticsInput 
} from '../database/analyticsTypes';

interface UseAnalyticsReturn {
  // State
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  form: CreateAnalyticsInput;
  
  // Actions
  loadAnalytics: () => Promise<void>;
  updateAnalyticsData: (_data: UpdateAnalyticsInput) => Promise<void>;
  startEdit: (_data: Analytics) => void;
  cancelEdit: () => void;
  setFormField: (_field: keyof CreateAnalyticsInput, _value: number) => void;
  
  // Live Analytics Updates
  refreshAnalytics: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  
  // Computed values
  successRate: number;
  totalQuestions: number;
  learningTimeMinutes: number;
}

const defaultForm: CreateAnalyticsInput = {
  totalLearningTime: 0,
  totalCardsLearned: 0,
  totalCorrect: 0,
  totalWrong: 0,
  resets: 0,
};

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<CreateAnalyticsInput>(defaultForm);

  // Auto-refresh functionality
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const AUTO_REFRESH_INTERVAL = 10000; // Refresh every 10 seconds

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAnalytics();
      
      if (response && response.status === 'success' && response.data) {
        setAnalytics(response.data);
      } else {
        setError('Fehler: Unerwartetes Response-Format');
        setAnalytics(null);
      }
    } catch {
      setError('Fehler beim Laden der Analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAnalyticsData = useCallback(async (data: UpdateAnalyticsInput) => {
    if (!analytics) return;

    try {
      setLoading(true);
      setError(null);
      
      // Optimistic update
      const optimisticUpdate: Analytics = {
        ...analytics,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setAnalytics(optimisticUpdate);
      
      const response = await updateAnalytics(data);
      
      if (response && response.status === 'success') {
        // Update with actual server response
        setAnalytics(response.data);
        setIsEditing(false);
      } else {
        // Revert optimistic update on error
        setAnalytics(analytics);
        setError('Fehler beim Aktualisieren der Analytics');
      }
    } catch {
      // Revert optimistic update on error
      setAnalytics(analytics);
      setError('Fehler beim Aktualisieren der Analytics');
    } finally {
      setLoading(false);
    }
  }, [analytics]);

  const startEdit = useCallback((data: Analytics) => {
    setForm({
      totalLearningTime: data.totalLearningTime,
      totalCardsLearned: data.totalCardsLearned,
      totalCorrect: data.totalCorrect,
      totalWrong: data.totalWrong,
      resets: data.resets,
    });
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setForm(defaultForm);
    setError(null);
  }, []);

  const setFormField = useCallback((field: keyof CreateAnalyticsInput, value: number) => {
    setForm(prev => ({
      ...prev,
      [field]: value || 0
    }));
  }, []);

  // Computed values
  const successRate = analytics 
    ? (analytics.totalCorrect + analytics.totalWrong) > 0 
      ? (analytics.totalCorrect / (analytics.totalCorrect + analytics.totalWrong)) * 100
      : 0
    : 0;

  const totalQuestions = analytics 
    ? analytics.totalCorrect + analytics.totalWrong 
    : 0;

  const learningTimeMinutes = analytics 
    ? Math.floor(analytics.totalLearningTime / 60) 
    : 0;

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Cleanup auto-refresh on unmount
  useEffect(() => (): void => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  }, []);

  return {
    // State
    analytics,
    loading,
    error,
    isEditing,
    form,
    
    // Actions
    loadAnalytics,
    updateAnalyticsData,
    startEdit,
    cancelEdit,
    setFormField,
    
    // Live Analytics Updates
    refreshAnalytics: loadAnalytics,
    startAutoRefresh: useCallback(() => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      refreshIntervalRef.current = setInterval(() => {
        loadAnalytics();
      }, AUTO_REFRESH_INTERVAL);
    }, [loadAnalytics]),
    
    stopAutoRefresh: useCallback(() => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }, []),
    
    // Computed values
    successRate,
    totalQuestions,
    learningTimeMinutes,
  };
};
