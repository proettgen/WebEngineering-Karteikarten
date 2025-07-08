/**
 * useLearningMode Hook
 * 
 * Custom hook for learning mode state management and business logic.
 * Centralizes all learning mode operations and provides a clean API for components.
 * 
 * Features:
 * - Folder loading and selection
 * - Box/learning level management
 * - Timer functionality
 * - Step navigation (start -> folder selection -> box selection -> learning)
 * - Error handling and loading states
 * - Authentication-aware API calls
 * 
 * This hook follows the same pattern as useAnalytics for consistency.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cardAndFolderService } from '@/services/cardAndFolderService';
import { Folder } from '@/database/folderTypes';
import { Card } from '@/database/cardTypes';

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
  
  // Error states
  error: string | null;
  
  // Actions
  startLearning: () => void;
  selectFolder: (_folder: Folder) => void;
  selectBox: (_level: number) => void;
  startBoxLearning: () => void;
  resetLearning: () => void;
  goBack: () => void;
  goBackToFolders: () => void;
  
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
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Router for navigation
  const router = useRouter();
  
  // Load folders when component mounts or when transitioning to folder selection
  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    setError(null);
    
    try {
      const response = await cardAndFolderService.getFolders();
      setFolders(response.data.folders);
    } catch {
      setError('Failed to load folders. Please try again.');
    } finally {
      setLoadingFolders(false);
    }
  }, []);
  
  // Load cards and calculate box counts for selected folder
  const loadBoxCounts = useCallback(async (folderId: string) => {
    setLoadingCards(true);
    setError(null);
    
    try {
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
    } catch {
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoadingCards(false);
    }
  }, []);
  
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
  
  const resetLearning = useCallback(() => {
    stopTimer();
    setStep('start');
    setSelectedFolder(null);
    setSelectedLearningLevel(null);
    setElapsedSeconds(0);
    setResetTrigger(prev => prev + 1);
    setError(null);
  }, [stopTimer]);
  
  const goBack = useCallback(() => {
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
        break;
    }
    setError(null);
  }, [step, stopTimer]);
  
  const goBackToFolders = useCallback(() => {
    stopTimer();
    setStep('select-folder');
    setSelectedFolder(null);
    setSelectedLearningLevel(null);
    setElapsedSeconds(0);
    setError(null);
  }, [stopTimer]);
  
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
    
    // Error state
    error,
    
    // Actions
    startLearning,
    selectFolder,
    selectBox,
    startBoxLearning,
    resetLearning,
    goBack,
    goBackToFolders,
    
    // Navigation
    navigateToCards,
  };
};
