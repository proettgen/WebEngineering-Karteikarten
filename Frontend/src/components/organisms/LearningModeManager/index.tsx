import React, { useState, useEffect, useCallback } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { cardAndFolderService } from "@/services/cardAndFolderService";
import { analyticsService } from "@/services/analyticsService";
import { LearningModeManagerProps } from "./types";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import * as SC from "./styles";

/**
 * Ensures box level stays within valid range (0-4)
 * Box 5 (level 4) is invisible and represents mastered cards
 */
const clampBox = (level: number) => Math.max(0, Math.min(4, level));

/**
 * Box level constants for learning system
 * - LAST_VISIBLE_BOX: Box 4 (highest visible box level)
 * - MASTERED_BOX: Box 5 (invisible box for mastered cards)
 */
const LAST_VISIBLE_BOX = 3;
const MASTERED_BOX = 4;

/**
 * LearningModeManager Component
 *
 * Manages the actual learning process for cards in a selected box.
 * This component handles the core learning logic including:
 * - Loading and filtering cards for the current box (API call)
 * - Processing right/wrong evaluations and moving cards between boxes (API call)
 * - Detecting when all cards reach the final box (learning goal achieved)
 * - Providing restart functionality and navigation options
 *
 * State Management:
 * - cards: Cards currently in the selected box
 * - loadingCards, error: Loading and error states
 * - isCompleted, completedTime: Completion status and elapsed time
 * - resetKey: Key for forcing component remount (e.g., after reset)
 *
 * This component integrates with the LearningMode component and provides
 * cards and callback functions for the learning interface.
 */
const LearningModeManager: React.FC<LearningModeManagerProps> = React.memo(({
  folder,
  currentLearningLevel,
  elapsedSeconds,
  onBack,
  onRestart,
  onBackToFolders,
  onRefreshCounts,
}: LearningModeManagerProps) => {
  // State for cards currently being learned
  const [cards, setCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for learning completion status
  const [isCompleted, setIsCompleted] = useState(false);
  
  // State for tracking completion time
  const [completedTime, setCompletedTime] = useState<number | null>(null);
  
  // Key for forcing component remount (e.g., after reset)
  const [resetKey, setResetKey] = useState(0);
  /**
   * Effect: Loads cards for the current box and resets completion status
   * when folder, box level, or reset key changes.
   */
  useEffect(() => {
    setLoadingCards(true);
    cardAndFolderService
      .getCardsByFolder(folder.id)
      .then((res) => {
        // Type: { data: { cards: any[] } }
        const allCards = (res as { data: { cards: any[] } }).data.cards || [];
        setCards(
          allCards.filter((card: any) => (card.currentLearningLevel ?? 0) === currentLearningLevel),
        );
        setError(null);
      })
      .catch(() => setError("Error loading cards"))
      .finally(() => {
        setIsCompleted(false);
        setCompletedTime(null);
        setLoadingCards(false);
      });
  }, [folder.id, currentLearningLevel, resetKey]);
  /**
   * Evaluates a card as correct/incorrect, moves it to the next/previous box,
   * and checks if all cards have been learned.
   * 
   * This function now performs all backend updates in the background without
   * immediately updating the local card state, allowing the LearningMode
   * component to handle UI transitions smoothly.
   * 
   * Box Logic:
   * - Boxes 0-3: Visible boxes for learning progression
   * - Box 4: Invisible "mastered" box for completed cards
   * - Special rule: Cards in box 3 only move to box 4 when answered correctly
   * 
   * @param cardId - ID of the card being evaluated
   * @param correct - Whether the answer was correct
   */
  const handleEvaluate = useCallback(async (cardId: string, correct: boolean) => {
    // Find the card being evaluated
    const card = cards.find((c: any) => c.id === cardId);
    if (!card) return;
    
    let newLevel = card.currentLearningLevel ?? 0;
    
    if (correct) {
      // Correct answer: Move one box higher (box 3 -> box 4 invisible)
      newLevel = clampBox(newLevel + 1);
    } else {
      // Wrong answer: Move one box lower, but minimum box 0
      newLevel = clampBox(newLevel - 1);
    }
    
    try {
      // Remove the evaluated card from the local state for next useEffect trigger
      // This ensures the card list gets updated eventually for the LearningMode
      const updatedCards = cards.filter((c: any) => c.id !== cardId);
      
      // Update backend in background
      await cardAndFolderService.updateCardInFolder(folder.id, cardId, {
        currentLearningLevel: newLevel,
      });

      // Live Analytics Tracking - Track card evaluation
      try {
        await analyticsService.incrementAnalytics({
          totalCardsLearned: 1,
          totalCorrect: correct ? 1 : 0,
          totalWrong: correct ? 0 : 1,
        });
      } catch (analyticsError) {
        // Analytics tracking is optional - don't break the learning flow
        // eslint-disable-next-line no-console
        console.warn('Failed to track analytics for card evaluation:', analyticsError);
      }
      
      // Call callback to update box counts
      if (onRefreshCounts) {
        await onRefreshCounts();
      }
      
      // Update local card state after a delay to allow smooth UI transition
      setTimeout(() => {
        setCards(updatedCards);
      }, 500); // Delay to allow LearningMode to handle the transition
      
      // Check if all cards are in box 4 (invisible) - learning goal achieved
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      const allInMasteredBox =
        allCards.length > 0 &&
        allCards.every((c: any) => (c.currentLearningLevel ?? 0) === MASTERED_BOX);
      
      if (allInMasteredBox) {
        setIsCompleted(true);
        setCompletedTime(elapsedSeconds);
      }
    } catch {
      setError("Error updating card");
      // On error: Reload cards
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      setCards(allCards.filter((c: any) => (c.currentLearningLevel ?? 0) === currentLearningLevel));
    }
  }, [cards, folder.id, elapsedSeconds, onRefreshCounts, currentLearningLevel]);

  /**
   * Navigates back to the previous view.
   */
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  /**
   * Resets all cards in the current folder to box 0 (restart learning).
   */
  const resetAllCardsToBox0 = useCallback(async () => {
    setLoadingCards(true);
    try {
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      await Promise.all(
        allCards.map((card: any) =>
          cardAndFolderService.updateCardInFolder(folder.id, card.id, {
            currentLearningLevel: 0,
          }),
        ),
      );
    } catch {
      setError("Error resetting cards");
    } finally {
      setLoadingCards(false);
    }
  }, [folder.id]);

  /**
   * Resets mastered cards from box 5 (invisible) back to box 4 (visible).
   * This is used when the user chooses "Back to Folders" to preserve learning progress.
   */
  const resetMasteredCardsToLastBox = useCallback(async () => {
    try {
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      
      // Only reset cards from box 5 back to box 4
      const masteredCards = allCards.filter((card: any) => (card.currentLearningLevel ?? 0) === MASTERED_BOX);
      
      await Promise.all(
        masteredCards.map((card: any) =>
          cardAndFolderService.updateCardInFolder(folder.id, card.id, {
            currentLearningLevel: LAST_VISIBLE_BOX,
          }),
        ),
      );
    } catch {
      setError("Error resetting mastered cards");
    }
  }, [folder.id]);

  /**
   * Restarts the learning mode by resetting all cards and incrementing the reset key.
   */
  const handleRestart = useCallback(async () => {
    await resetAllCardsToBox0();
    setResetKey((prev) => prev + 1);

    // Live Analytics Tracking - Track folder reset
    try {
      await analyticsService.trackReset('folder');
    } catch (analyticsError) {
      // Analytics tracking is optional - don't break the learning flow
      // eslint-disable-next-line no-console
      console.warn('Failed to track analytics for folder reset:', analyticsError);
    }

    // Update box counts after reset
    if (onRefreshCounts) {
      await onRefreshCounts();
    }
    if (typeof onRestart === "function") onRestart();
  }, [resetAllCardsToBox0, onRefreshCounts, onRestart]);

  /**
   * Navigates back to folder selection. If learning is completed, moves all
   * mastered cards from box 5 (invisible) back to box 4 (visible) since 
   * cards can be forgotten over time.
   */
  const handleBackToFolders = useCallback(async () => {
    // If learning is completed, reset all mastered cards back to box 4
    if (isCompleted) {
      await resetMasteredCardsToLastBox();
      // Update box counts after reset
      if (onRefreshCounts) {
        await onRefreshCounts();
      }
    }
    
    if (typeof onBackToFolders === "function") onBackToFolders();
    else handleBack();
  }, [onBackToFolders, handleBack, isCompleted, resetMasteredCardsToLastBox, onRefreshCounts]);

  // Render completion screen when all cards are mastered
  if (loadingCards) {
    return (
      <SC.CenteredContainer>
        <p>Loading cards ...</p>
      </SC.CenteredContainer>
    );
  }
  if (error) {
    return (
      <SC.CenteredContainer>
        <p>{error}</p>
      </SC.CenteredContainer>
    );
  }
  if (isCompleted) {
    return (
      <SC.CongratsWrapper>
        <Headline size="lg">Congratulations!</Headline>
        <Text size="medium">
          You have mastered all flashcards in this folder!
        </Text>
        <Text size="medium" color="textSecondary">
          All cards have been answered correctly and are now fully learned.
        </Text>
        {typeof completedTime === "number" && (
          <Text size="medium">
            {`Total time: ${Math.floor(completedTime / 60)}:${String(completedTime % 60).padStart(2, "0")}`}
          </Text>
        )}
        <SC.ButtonRow>
          <Button $variant="primary" onClick={handleRestart}>
            Learn again
          </Button>
          <Button $variant="secondary" onClick={handleBackToFolders}>
            Back to folder selection
          </Button>
        </SC.ButtonRow>
        <Text size="small" color="textSecondary">
          Choose &quot;Learn again&quot; to start from scratch, or &quot;Back to folder selection&quot; to keep your progress and continue later.
        </Text>
      </SC.CongratsWrapper>
    );
  }

  // Main render: Pass cards and callbacks to LearningMode component
  return (
    <LearningMode
      elapsedSeconds={elapsedSeconds}
      cards={cards}
      onEvaluate={handleEvaluate}
      onBack={handleBack}
      currentLearningLevel={currentLearningLevel}
    />
  );
});

LearningModeManager.displayName = 'LearningModeManager';

export default LearningModeManager;
