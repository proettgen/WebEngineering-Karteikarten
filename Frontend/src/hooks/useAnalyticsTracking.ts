/**
 * Analytics Tracking Hook - Learning-Analytics Integration
 *
 * Custom React hook for automatic tracking of learning actions and their
 * live synchronization with analytics. This hook provides the connection between
 * Learning Mode and Analytics.
 *
 * Features:
 * - Session-based tracking of learning activities
 * - Automatic synchronization with backend analytics
 * - Batch updates for performance optimization
 * - Error handling and retry logic
 * - Optimistic updates for better user experience
 *
 * Integration Points:
 * - useLearningMode: Timer and card evaluation integration
 * - LearningModeManager: Reset and progress tracking
 * - useAnalytics: Live updates of analytics display
 *
 * Usage:
 * ```typescript
 * const { 
 *   startSession, 
 *   endSession, 
 *   trackCardEvaluation, 
 *   trackReset,
 *   sessionStats 
 * } = useAnalyticsTracking();
 * ```
 *
 * Cross-references:
 * - src/hooks/useLearningMode.ts: Learning Mode State Management
 * - src/hooks/useAnalytics.ts: Analytics State Management
 * - src/services/analyticsService.ts: Analytics API Calls
 * - Backend: /api/analytics/track-* endpoints
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';
import type { Analytics } from '@/database/analyticsTypes';

/**
 * Session data for current learning session tracking
 */
export interface AnalyticsSession {
  isActive: boolean;
  startTime: number;
  cardsStudied: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
}

/**
 * Hook return interface for useAnalyticsTracking
 */
export interface UseAnalyticsTrackingReturn {
  // Session State
  session: AnalyticsSession;
  isSessionActive: boolean;
  
  // Session Control
  startSession: () => void;
  endSession: () => Promise<Analytics | null>;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Live Tracking
  trackCardEvaluation: (_correct: boolean) => Promise<void>;
  trackTimeSpent: (_seconds: number) => Promise<void>;
  trackReset: (_resetType: 'folder' | 'learning_session') => Promise<Analytics | null>;
  
  // Batch Operations
  submitSessionBatch: () => Promise<Analytics | null>;
  
  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Default session state
 */
const defaultSession: AnalyticsSession = {
  isActive: false,
  startTime: 0,
  cardsStudied: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timeSpent: 0,
};

/**
 * Analytics Tracking Hook für Live-Synchronisation
 * 
 * Verwaltet das Tracking von Learning-Sessions und synchronisiert Änderungen
 * automatisch mit dem Backend. Optimiert für Performance und UX.
 */
export const useAnalyticsTracking = (): UseAnalyticsTrackingReturn => {
  // Session State
  const [session, setSession] = useState<AnalyticsSession>(defaultSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Timer reference for automatic time tracking
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSyncRef = useRef<number>(Date.now());

  // Batch update settings
  const BATCH_INTERVAL = 30000; // 30 seconds
  const batchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Submits collected session data as a batch to the backend
   */
  const submitSessionBatch = useCallback(async (): Promise<Analytics | null> => {
    if (!session.isActive || session.cardsStudied === 0) {
      return null; // No data to submit
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyticsService.trackStudySession({
        timeSpent: session.timeSpent,
        cardsStudied: session.cardsStudied,
        correctAnswers: session.correctAnswers,
        wrongAnswers: session.wrongAnswers,
      });

      // Reset session counters after successful submission
      setSession(prev => ({
        ...prev,
        cardsStudied: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        // Keep timer and active state
      }));

      setLastUpdated(new Date());
      lastSyncRef.current = Date.now();
      
      // Session batch submitted successfully
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit session batch';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  /**
   * Starts a new learning session
   */
  const startSession = useCallback(() => {
    const now = Date.now();
    
    setSession({
      isActive: true,
      startTime: now,
      cardsStudied: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeSpent: 0,
    });

    lastSyncRef.current = now;
    setError(null);

    // Start automatic time tracking
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setSession(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    // Schedule batch updates
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    
    const scheduleBatchUpdate = () => {
      batchTimeoutRef.current = setTimeout(async () => {
        await submitSessionBatch();
        if (session.isActive) {
          scheduleBatchUpdate(); // Reschedule if session is still active
        }
      }, BATCH_INTERVAL);
    };
    
    scheduleBatchUpdate();

    // Analytics tracking session started
  }, [session.isActive, submitSessionBatch]);

  /**
   * Ends the current learning session and sends final data
   */
  const endSession = useCallback(async (): Promise<Analytics | null> => {
    if (!session.isActive) {
      return null;
    }

    // Stop timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchTimeoutRef.current = null;
    }

    // Submit final session data
    const finalResult = await submitSessionBatch();

    // Reset session
    setSession(defaultSession);

    // console.log('Analytics tracking session ended');
    return finalResult;
  }, [session.isActive, submitSessionBatch]);

  /**
   * Pauses the session (stops timer)
   */
  const pauseSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setSession(prev => ({
      ...prev,
      isActive: false
    }));

    // console.log('Analytics tracking session paused');
  }, []);

  /**
   * Resumes the session (restarts timer)
   */
  const resumeSession = useCallback(() => {
    if (!session.isActive && session.startTime > 0) {
      setSession(prev => ({
        ...prev,
        isActive: true
      }));

      // Restart timer
      timerRef.current = setInterval(() => {
        setSession(prev => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);

      // console.log('Analytics tracking session resumed');
    }
  }, [session.isActive, session.startTime]);

  /**
   * Tracks card evaluation (correct/wrong)
   */
  const trackCardEvaluation = useCallback(async (correct: boolean): Promise<void> => {
    if (!session.isActive) {
      // console.warn('Cannot track card evaluation: no active session');
      return;
    }

    setSession(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (correct ? 0 : 1),
    }));

    // console.log(`Card evaluation tracked: ${correct ? 'correct' : 'wrong'}`);
  }, [session.isActive]);

  /**
   * Tracks explicit time spans (for manual time updates)
   */
  const trackTimeSpent = useCallback(async (seconds: number): Promise<void> => {
    if (!session.isActive) {
      // console.warn('Cannot track time: no active session');
      return;
    }

    setSession(prev => ({
      ...prev,
      timeSpent: prev.timeSpent + seconds
    }));

    // console.log(`Time tracked: +${seconds} seconds`);
  }, [session.isActive]);

  /**
   * Tracks reset actions
   */
  const trackReset = useCallback(async (resetType: 'folder' | 'learning_session'): Promise<Analytics | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyticsService.trackReset(resetType);
      setLastUpdated(new Date());
      
      // console.log(`Reset tracked: ${resetType}`);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track reset';
      setError(errorMessage);
      // console.error('Error tracking reset:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
  }, []);

  return {
    // Session State
    session,
    isSessionActive: session.isActive,
    
    // Session Control
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    
    // Live Tracking
    trackCardEvaluation,
    trackTimeSpent,
    trackReset,
    
    // Batch Operations
    submitSessionBatch,
    
    // State
    loading,
    error,
    lastUpdated,
  };
};

export default useAnalyticsTracking;
