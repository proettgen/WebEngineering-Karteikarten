/**
 * useLearningMode Hook (Enhanced)
 * 
 * Custom hook for learning mode state management and business logic.
 * Enhanced with robust error handling, retry mechanisms, and improved reliability.
 * Now matches the robustness of Card/Folder operations.
 * 
 * Features:
 * - Folder loading and selection
 * - Box/learning level management
 * - Timer functionality
 * - Step navigation (start -> folder selection -> box selection -> learning)
 * - Enhanced error handling with retry mechanisms
 * - Loading states with better UX
 * - Authentication-aware API calls
 * - Consistent with Card/Folder error handling patterns
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cardAndFolderService } from '@/services/cardAndFolderService';
import { Folder } from '@/database/folderTypes';
import { Card } from '@/database/cardTypes';
import { useEnhancedError } from './useEnhancedError';

export type LearningModeStep = 'start' | 'select-folder' | 'select-box' | 'learn';

interface BoxCount {
  level: number;
  count: number;
}

interface UseLearningModeReturn {
  // Current state
  step: LearningModeStep;
  selectedFolder: Folder | null;
  selectedLearningLevel: number | null;
  elapsedSeconds: number;
  resetTrigger: number;
  
  // Data
  folders: Folder[];
  boxCounts: BoxCount[];
  cards: Card[];
  
  // Loading states
  loadingFolders: boolean;
  loadingCards: boolean;
  loading: boolean;
  
  // Enhanced error states
  error: string | null;
  canRetry: boolean;
  isRetrying: boolean;
  
  // Actions
  startLearning: () => void;
  selectFolder: (_folder: Folder) => void;
  selectBox: (_level: number) => void;
  startBoxLearning: () => void;
  resetLearning: () => void;
  goBack: () => void;
  goBackToFolders: () => void;
  retryLastOperation: () => Promise<void>;
  refreshBoxCounts: () => Promise<void>;
  
  // Navigation
  navigateToCards: () => void;
}

export const useLearningMode = (): UseLearningModeReturn => {
  // Core state
  const [step, setStep] = useState<LearningModeStep>('start');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedLearningLevel, setSelectedLearningLevel] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // Data state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [boxCounts, setBoxCounts] = useState<BoxCount[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  
  // Loading states
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  
  // Enhanced error handling
  const { error, setError, clearError, retry, canRetry, isRetrying } = useEnhancedError(3);
  
  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Track last operation for retry
  const lastOperationRef = useRef<(() => Promise<void>) | null>(null);
  
  // Router for navigation
  const router = useRouter();
  
  // Load folders when component mounts or when transitioning to folder selection
  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    
    const operation = async () => {
      const response = await cardAndFolderService.getFolders();
      setFolders(response.data.folders);
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
      
      // Calculate box counts (learning levels 0-3)
      const counts: BoxCount[] = [];
      for (let level = 0; level <= 3; level++) {
        const count = folderCards.filter(card => card.currentLearningLevel === level).length;
        counts.push({ level, count });
      }
      setBoxCounts(counts);
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
    
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, []);
  
  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Actions
  const startLearning = useCallback(() => {
    setStep('select-folder');
    loadFolders();
  }, [loadFolders]);
  
  const selectFolder = useCallback((folder: Folder) => {
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
  
  // Cleanup timer on unmount
  useEffect(() => () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
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
