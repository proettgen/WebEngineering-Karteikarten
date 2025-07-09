/**
 * Learning Mode Management Hook
 * 
 * @description Custom React hook for managing learning mode state, navigation, and business logic.
 * Provides robust error handling, retry mechanisms, and analytics integration for the learning experience.
 * 
 * @features
 * - Folder loading and selection with error handling
 * - Box/learning level management
 * - Learning session timer functionality with analytics tracking
 * - Step navigation (start → folder selection → box selection → learning)
 * - Authentication-aware API calls with automatic retry
 * - Analytics integration for learning progress tracking
 * 
 * @cross-references
 * - {@link cardAndFolderService} - Backend API communication
 * - {@link analyticsService} - Learning analytics tracking
 * - {@link useEnhancedError} - Error handling and user feedback
 * - {@link LearningModeTemplate} - Main UI component using this hook
 * 
 * @returns {UseLearningModeReturn} Complete learning mode state and control functions
 * 
 * @example
 * ```tsx
 * const {
 *   step,
 *   folders,
 *   selectedFolder,
 *   loadFolders,
 *   selectFolder,
 *   startLearning
 * } = useLearningMode();
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cardAndFolderService } from '@/services/cardAndFolderService';
import { analyticsService } from '@/services/analyticsService';
import { Card } from '@/database/cardTypes';
import { useEnhancedError } from './useEnhancedError';
import type { 
  LearningModeStep, 
  FolderWithCardCount, 
  BoxCount, 
  UseLearningModeReturn 
} from './types';

export const useLearningMode = (): UseLearningModeReturn => {
  // Core state
  const [step, setStep] = useState<LearningModeStep>('start');
  const [selectedFolder, setSelectedFolder] = useState<FolderWithCardCount | null>(null);
  const [selectedLearningLevel, setSelectedLearningLevel] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // Data state
  const [folders, setFolders] = useState<FolderWithCardCount[]>([]);
  const [boxCounts, setBoxCounts] = useState<BoxCount[]>([]);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  
  // Loading states
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  
  // Enhanced error handling
  const { error, setError, clearError, retry, canRetry, isRetrying } = useEnhancedError(3);
  
  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Analytics tracking for learning sessions
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastAnalyticsUpdateRef = useRef<number>(0);
  const ANALYTICS_UPDATE_INTERVAL = 30000; // Update analytics every 30 seconds
  
  // Track last operation for retry
  const lastOperationRef = useRef<(() => Promise<void>) | null>(null);
  
  // Router for navigation
  const router = useRouter();
  
  // Page visibility protection for analytics (handles tab switching, minimizing, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Final analytics update when page becomes hidden (navigation, tab switch, etc.)
        if (sessionStartTimeRef.current) {
          const timeNotYetTracked = Math.floor((Date.now() - lastAnalyticsUpdateRef.current) / 1000);
          
          if (timeNotYetTracked > 0) {
            analyticsService.incrementAnalytics({
              totalLearningTime: timeNotYetTracked,
            }).catch(() => {
              // Silent failure during visibility change
            });
            
            lastAnalyticsUpdateRef.current = Date.now();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load folders when component mounts or when transitioning to folder selection
  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    
    const operation = async () => {
      const response = await cardAndFolderService.getFolders();
      const folderList = response.data.folders;
      
      // Load card counts for each folder in parallel for better performance
      const foldersWithCounts = await Promise.all(
        folderList.map(async (folder) => {
          try {
            const cardsResponse = await cardAndFolderService.getCardsByFolder(folder.id);
            return {
              ...folder,
              cardCount: cardsResponse.data?.cards?.length || 0
            };
          } catch {
            // If we can't get cards for a folder, assume 0 cards
            // This ensures folders without cards are filtered out
            return {
              ...folder,
              cardCount: 0
            };
          }
        })
      );
      
      setFolders(foldersWithCounts);
    };

    lastOperationRef.current = operation;

    try {
      await operation();
      clearError();
    } catch (err) {
      setError(err as Error, 'network');
    } finally {
      setLoadingFolders(false);
    }
  }, [setError, clearError]);
  
  // Load cards and calculate box counts for selected folder
  const loadBoxCounts = useCallback(async (folderId: string) => {
    setLoadingCards(true);
    
    const operation = async () => {
      const response = await cardAndFolderService.getCardsByFolder(folderId);
      const folderCards = response.data?.cards || [];
      setCards(folderCards);
      
      // Calculate box counts (learning levels 0-4, but only show 0-3)
      // Level 4 is the invisible "mastered" level
      const counts: BoxCount[] = [];
      for (let level = 0; level <= 3; level++) {
        const count = folderCards.filter(card => card.currentLearningLevel === level).length;
        counts.push({ level, count });
      }
      setBoxCounts(counts);
      
      // Calculate mastered cards count (Level 4 - invisible)
      const masteredCardsCount = folderCards.filter(card => card.currentLearningLevel === 4).length;
      setMasteredCount(masteredCardsCount);
    };

    lastOperationRef.current = operation;

    try {
      await operation();
      clearError();
    } catch (err) {
      setError(err as Error, 'network');
    } finally {
      setLoadingCards(false);
    }
  }, [setError, clearError]);
  
  // Retry mechanism for failed operations
  const retryLastOperation = useCallback(async () => {
    if (lastOperationRef.current && canRetry) {
      await retry(lastOperationRef.current);
    }
  }, [retry, canRetry]);
  
  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set session start time for analytics tracking
    sessionStartTimeRef.current = Date.now();
    lastAnalyticsUpdateRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const newSeconds = prev + 1;
        
        // Periodically update analytics with learning time
        const now = Date.now();
        if (now - lastAnalyticsUpdateRef.current >= ANALYTICS_UPDATE_INTERVAL) {
          const timeSpentSinceLastUpdate = Math.floor((now - lastAnalyticsUpdateRef.current) / 1000);
          
          // Performance Best Practice: Batch analytics updates to reduce API calls
          // Error Handling Best Practice: Non-blocking background updates with graceful failure
          analyticsService.incrementAnalytics({
            totalLearningTime: timeSpentSinceLastUpdate,
          }).catch(() => {
            // Security Best Practice: Don't expose sensitive analytics errors to console
            // UX Best Practice: Silent failure prevents disrupting the learning experience
          });
          
          lastAnalyticsUpdateRef.current = now;
        }
        
        return newSeconds;
      });
    }, 1000);
  }, []);
  
  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Final analytics update when stopping timer
    if (sessionStartTimeRef.current) {
      const timeNotYetTracked = Math.floor((Date.now() - lastAnalyticsUpdateRef.current) / 1000);
      
      // Performance Best Practice: Final cleanup to prevent unnecessary API calls
      // Accessibility Best Practice: Ensure timer cleanup for screen readers
      if (timeNotYetTracked > 0) {
        analyticsService.incrementAnalytics({
          totalLearningTime: timeNotYetTracked,
        }).catch(() => {
          // Error Handling Best Practice: Graceful degradation for analytics failures
        });
      }
      
      sessionStartTimeRef.current = null;
    }
  }, []);
  
  // Actions
  const startLearning = useCallback(() => {
    setStep('select-folder');
    loadFolders();
  }, [loadFolders]);
  
  const selectFolder = useCallback((folder: FolderWithCardCount) => {
    setSelectedFolder(folder);
    setStep('select-box');
    loadBoxCounts(folder.id);
  }, [loadBoxCounts]);
  
  const selectBox = useCallback((level: number) => {
    setSelectedLearningLevel(level);
  }, []);
  
  const startBoxLearning = useCallback(() => {
    if (selectedLearningLevel !== null) {
      setStep('learn');
      startTimer();
    }
  }, [selectedLearningLevel, startTimer]);
  
  const resetLearning = useCallback(async () => {
    stopTimer();
    setSelectedLearningLevel(null);
    setElapsedSeconds(0);
    setResetTrigger(prev => prev + 1);
    clearError();

    // Track learning session reset (only for individual session resets, not folder resets)
    // Note: Folder resets are tracked in LearningModeManager to avoid double counting
    // Only track reset if this is not called from a folder reset (handleRestart)
    // This prevents double counting when the user clicks "Restart" in LearningModeManager
    
    // We don't track reset here anymore to avoid double counting
    // All resets are now tracked in LearningModeManager.handleRestart
    
    // Stay in the same folder and go back to box selection instead of start
    if (selectedFolder) {
      setStep('select-box');
      await loadBoxCounts(selectedFolder.id);
    } else {
      setStep('start');
      setSelectedFolder(null);
    }
  }, [stopTimer, clearError, selectedFolder, loadBoxCounts]);
  // Refresh box counts for selected folder (called after card evaluation)
  const refreshBoxCounts = useCallback(async () => {
    if (selectedFolder) {
      await loadBoxCounts(selectedFolder.id);
    }
  }, [selectedFolder, loadBoxCounts]);
  
  const goBack = useCallback(async () => {
    switch (step) {
      case 'select-folder':
        setStep('start');
        break;
      case 'select-box':
        setStep('select-folder');
        setSelectedFolder(null);
        break;
      case 'learn':
        stopTimer();
        setStep('select-box');
        setSelectedLearningLevel(null);
        setElapsedSeconds(0);
        // Refresh box counts when going back from learning to box selection
        if (selectedFolder) {
          await loadBoxCounts(selectedFolder.id);
        }
        break;
    }
    clearError();
  }, [step, stopTimer, clearError, selectedFolder, loadBoxCounts]);
  
  const goBackToFolders = useCallback(() => {
    stopTimer();
    setStep('select-folder');
    setSelectedFolder(null);
    setSelectedLearningLevel(null);
    setElapsedSeconds(0);
    clearError();
  }, [stopTimer, clearError]);
  
  const navigateToCards = useCallback(() => {
    if (selectedFolder) {
      router.push(`/cards?folderId=${selectedFolder.id}`);
    } else {
      router.push('/cards');
    }
  }, [selectedFolder, router]);
  
  // Browser navigation/close protection for analytics
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Final analytics update when user navigates away or closes browser
      if (sessionStartTimeRef.current) {
        const timeNotYetTracked = Math.floor((Date.now() - lastAnalyticsUpdateRef.current) / 1000);
        
        if (timeNotYetTracked > 0) {
          // Use sendBeacon for reliable analytics during page unload
          const data = new FormData();
          data.append('totalLearningTime', timeNotYetTracked.toString());
          
          // Try sendBeacon first (most reliable for page unload)
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/increment', data);
          } else {
            // Fallback for older browsers
            try {
              analyticsService.incrementAnalytics({
                totalLearningTime: timeNotYetTracked,
              });
            } catch {
              // Silent failure during unload
            }
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Memory Management Best Practice: Cleanup timer to prevent memory leaks
  // Performance Best Practice: Clear intervals on component unmount
  // React Best Practice: Return cleanup function from useEffect
  // Analytics Best Practice: Ensure final analytics update on any component unmount
  useEffect(() => () => {
    // Cleanup timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Final analytics update when component unmounts (e.g., navigation to other pages)
    if (sessionStartTimeRef.current) {
      const timeNotYetTracked = Math.floor((Date.now() - lastAnalyticsUpdateRef.current) / 1000);
      
      if (timeNotYetTracked > 0) {
        // Use fire-and-forget approach for cleanup analytics to avoid blocking unmount
        analyticsService.incrementAnalytics({
          totalLearningTime: timeNotYetTracked,
        }).catch(() => {
          // Silent failure on cleanup - don't block unmount process
        });
      }
      
      sessionStartTimeRef.current = null;
      lastAnalyticsUpdateRef.current = 0;
    }
  }, []);
  
  return {
    // Current state
    step,
    selectedFolder,
    selectedLearningLevel,
    elapsedSeconds,
    resetTrigger,
    
    // Data
    folders,
    boxCounts,
    masteredCount,
    cards,
    
    // Loading states
    loadingFolders,
    loadingCards,
    loading: loadingFolders || loadingCards,
    
    // Enhanced error states
    error: error?.message || null,
    canRetry,
    isRetrying,
    
    // Actions
    startLearning,
    selectFolder,
    selectBox,
    startBoxLearning,
    resetLearning,
    goBack,
    goBackToFolders,
    retryLastOperation,
    refreshBoxCounts,
    
    // Navigation
    navigateToCards,
  };
};
