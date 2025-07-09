import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import Icon from "@/components/atoms/Icon";
import { EmptyStateContainer } from "@/components/shared/StyledComponents";
import { CardType, LearningModeProps } from "./types";
/**
 * LearningMode Component
 *
 * Component for interacting with individual learning cards in learning mode.
 * This component is part of the "LearningMode" feature and is used by the parent
 * LearningModeManager component. It handles display and interaction with a single
 * card (question/answer, flip, evaluation, navigation to next card).
 *
 * Key Responsibilities:
 * - Displays a random card from the current card stack (props.cards)
 * - Allows flipping the card (question <-> answer)
 * - Evaluates the card as correct/wrong (buttons), calls onEvaluate callback
 * - Navigates to the next card (Next Card button) with smart logic:
 *   * Only available before flipping (once flipped, must evaluate)
 *   * Only available when multiple cards exist (prevents same card loop)
 *   * Always selects a different card than the current one
 * - Shows a flip hint if the card hasn't been flipped yet
 * - Shows a back button to exit learning mode (onBack)
 *
 * Props (see ./types.ts for details):
 * - elapsedSeconds: Time elapsed in learning mode (for timer display)
 * - cards: Array of cards to learn (only cards from current box)
 * - onEvaluate: Callback when a card is evaluated as correct/wrong
 * - onBack: Callback to exit learning mode
 * - currentLearningLevel: Current learning level/box stage (0-4)
 *
 * This component is purely for UI and interaction with a card, but not for loading
 * or evaluating cards in the backend. The logic for loading and evaluating cards
 * is in LearningModeManager.
 *
 * Related Files:
 * - ./styles.ts: Styled Components for layout and styling
 * - ./types.ts: Type definitions for props and cards
 * - ../LearningModeManager/index.tsx: Parent logic for learning mode
 * - @/components/templates/LearningModeTemplate: Layout wrapper for learning mode
 */
const LearningMode: React.FC<LearningModeProps> = React.memo(({ elapsedSeconds: _elapsedSeconds, cards, onEvaluate, onBack, currentLearningLevel: _currentLearningLevel }) => {
  // State for the currently displayed card (will be set in useEffect)
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  // State for whether the card is flipped (answer visible)
  const [isFlipped, setIsFlipped] = useState(false);
  // State for whether the flip hint should be shown
  const [showFlipHint, setShowFlipHint] = useState(false);
  // State to solve flicker problem - prevents rendering of old card
  const [isEvaluating, setIsEvaluating] = useState(false);
  /**
   * Selects a random card from the available cards, ensuring it's different from the current card.
   * Returns null if no cards are available or no different card can be found.
   */
  const selectDifferentCard = (availableCards: CardType[], currentCardId?: string): CardType | null => {
    if (availableCards.length === 0) {
      return null;
    }
    
    if (availableCards.length === 1) {
      // If only one card exists, return it only if it's not the current card
      // (This handles the case where we're switching from a different card set)
      return availableCards[0].id !== currentCardId ? availableCards[0] : null;
    }
    
    // Multiple cards: filter out the current card and select randomly from the rest
    const otherCards = availableCards.filter(card => card.id !== currentCardId);
    if (otherCards.length > 0) {
      return otherCards[Math.floor(Math.random() * otherCards.length)];
    }
    
    // Fallback: should not happen if we have multiple cards, but return null for safety
    return null;
  };

  /**
   * Effect: When the card stack changes significantly, select a new card and reset flip state.
   * If no cards are available, set currentCard to null.
   * This effect only triggers when the cards array changes in length or composition,
   * not on every re-render, allowing for smooth optimistic updates.
   */
  useEffect(() => {
    setIsEvaluating(false); // Reset evaluation state
    
    if (cards.length === 0) {
      setCurrentCard(null);
      setIsFlipped(false);
      return;
    }
    
    // If we don't have a current card, select one
    if (!currentCard) {
      const newCard = selectDifferentCard(cards, undefined);
      const finalCard = newCard || (cards.length > 0 ? cards[0] : null);
      setCurrentCard(finalCard);
      setIsFlipped(false);
      return;
    }
    
    // If current card is no longer in the cards array, select a new one
    const currentCardStillExists = cards.some(card => card.id === currentCard.id);
    if (!currentCardStillExists) {
      const newCard = selectDifferentCard(cards, currentCard.id);
      const finalCard = newCard || (cards.length > 0 ? cards[0] : null);
      setCurrentCard(finalCard);
      setIsFlipped(false);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length, cards.map(c => c.id).join(',')]);
  
  /**
   * Shows a brief hint that the card can be flipped (e.g., on mouseover).
   * The hint disappears automatically after 2 seconds.
   */
  const handleHint = () => {
    if (!isFlipped) {
      setShowFlipHint(true);
      setTimeout(() => setShowFlipHint(false), 2000); // Hint disappears after 2 seconds
    }
  };
  
  /**
   * Marks the current card as answered correctly and calls the callback.
   * Immediately shows the next card for smooth user experience (optimistic update).
   */
  const markCorrect = () => {
    if (currentCard && onEvaluate) {
      // Set evaluation state for smooth transition
      setIsEvaluating(true);
      setIsFlipped(false);
      
      // Optimistic update: immediately show next card for smooth UX
      const nextCard = selectDifferentCard(cards, currentCard.id);
      
      // Call the evaluation callback (this updates the backend)
      onEvaluate(currentCard.id, true);
      
      // Immediately switch to the next card if available
      setTimeout(() => {
        setIsEvaluating(false);
        if (nextCard) {
          setCurrentCard(nextCard);
        } else {
          // No more cards available in this box
          setCurrentCard(null);
        }
      }, 300); // Short delay for smooth transition animation
    }
  };
  
  /**
   * Marks the current card as answered incorrectly and calls the callback.
   * Immediately shows the next card for smooth user experience (optimistic update).
   */
  const markWrong = () => {
    if (currentCard && onEvaluate) {
      // Set evaluation state for smooth transition
      setIsEvaluating(true);
      setIsFlipped(false);
      
      // Optimistic update: immediately show next card for smooth UX
      const nextCard = selectDifferentCard(cards, currentCard.id);
      
      // Call the evaluation callback (this updates the backend)
      onEvaluate(currentCard.id, false);
      
      // Immediately switch to the next card if available
      setTimeout(() => {
        setIsEvaluating(false);
        if (nextCard) {
          setCurrentCard(nextCard);
        } else {
          // No more cards available in this box
          setCurrentCard(null);
        }
      }, 300); // Short delay for smooth transition animation
    }
  };
  
  /**
   * Flips the card (question <-> answer).
   */
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  /**
   * Selects the next card from the stack (different from current, if possible)
   * and resets flip state. Only works if there are multiple cards, the current 
   * card is not flipped, and a different card is actually available.
   */
  const handleNextCard = () => {
    // Only allow next card if card is not flipped and there are multiple cards
    if (isFlipped || cards.length <= 1) {
      return;
    }
    
    // Use the improved selection logic to ensure a different card
    const nextCard = selectDifferentCard(cards, currentCard?.id);
    
    // Only proceed if we found a genuinely different card
    if (nextCard && nextCard.id !== currentCard?.id) {
      setCurrentCard(nextCard);
      setIsFlipped(false);
    }
    // If no different card is found, do nothing (keep current card)
  };

  return (
    <SC.Container>
      {onBack && (
        <SC.TopRow>
          <Button $variant="secondary" onClick={onBack}>
            Back
          </Button>
        </SC.TopRow>
      )}
        {currentCard && !isEvaluating ? (
          <SC.LearningContainer>
            <Card
              title={currentCard.title}
              question={currentCard.question}
              answer={currentCard.answer}
              tags={currentCard.tags ?? []}
              showEditButton={false}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
            <SC.ButtonRow>
              <SC.HintWrapper onMouseDown={handleHint} onMouseEnter={handleHint} tabIndex={-1}>
                <Button $variant="accept" onClick={markCorrect} disabled={!isFlipped}>
                  <Icon size="s" color="textPrimary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                  </Icon>
                  I Got It Right
                </Button>
              </SC.HintWrapper>
              <SC.HintWrapper onMouseDown={handleHint} onMouseEnter={handleHint} tabIndex={-1}>
                <Button $variant="deny" onClick={markWrong} disabled={!isFlipped}>
                  <Icon size="s" color="textPrimary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </Icon>
                  I Got It Wrong
                </Button>
              </SC.HintWrapper>
              <SC.HintWrapper>
                <Button 
                  $variant="secondary" 
                  onClick={handleNextCard}
                  disabled={isFlipped || cards.length <= 1}
                >
                  <Icon size="s" color="textPrimary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                    </svg>
                  </Icon>
                  Next Card
                </Button>
              </SC.HintWrapper>
            </SC.ButtonRow>
            <SC.HintArea>
              {showFlipHint && (
                <Text color="deny">Please flip the card first to see the answer before evaluating!</Text>
              )}
              {isFlipped && (
                <Text color="deny" size="small">
                  Please evaluate this card before moving to the next one.
                </Text>
              )}
              {!isFlipped && cards.length <= 1 && (
                <Text color="textSecondary" size="small">
                  Only one card remaining in this box.
                </Text>
              )}
            </SC.HintArea>
          </SC.LearningContainer>
        ) : !isEvaluating ? (
          <EmptyStateContainer>
            <SC.CompleteIconWrapper>
              <Icon size="xl" color="textPrimary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  aria-label="Box Complete"
                >
                  <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40 97L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l320-186q19-11 40-11t40 11l320 186q19 11 29.5 29t10.5 40v318q0 22-10.5 40T880-252L560-86q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z" />
                </svg>
              </Icon>
            </SC.CompleteIconWrapper>
            <Headline size="lg">Congratulations!</Headline>
            <Text size="large">
              You&apos;ve completed all cards in this learning box!
            </Text>
            <Text size="medium" color="textSecondary">
              Great progress! Use the &quot;Back&quot; button to choose another box or return to folder selection to continue your learning journey.
            </Text>
          </EmptyStateContainer>
        ) : (
          <SC.EvaluatingContainer>
            <Headline size="md">Evaluating...</Headline>
          </SC.EvaluatingContainer>
        )}
    </SC.Container>
  );
});

LearningMode.displayName = 'LearningMode';

export default LearningMode;