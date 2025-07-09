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
 * - Navigates to the next card (onNextCard)
 * - Shows a flip hint if the card hasn't been flipped yet
 * - Shows a back button to exit learning mode (onBack)
 *
 * Props (see ./types.ts for details):
 * - elapsedSeconds: Time elapsed in learning mode (for timer display)
 * - cards: Array of cards to learn (only cards from current box)
 * - onEvaluate: Callback when a card is evaluated as correct/wrong
 * - onNextCard: Callback when switching to next card
 * - onBack: Callback to exit learning mode
 * - currentLearningLevel: Current learning level/box stage (0-3)
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
const LearningMode: React.FC<LearningModeProps> = React.memo(({ elapsedSeconds: _elapsedSeconds, cards, onEvaluate, onNextCard, onBack, currentLearningLevel: _currentLearningLevel }) => {
  // State for the currently displayed card (randomly selected from stack)
  const [currentCard, setCurrentCard] = useState<CardType | null>(
    cards.length > 0 ? cards[Math.floor(Math.random() * cards.length)] : null
  );
  // State for whether the card is flipped (answer visible)
  const [isFlipped, setIsFlipped] = useState(false);
  // State for whether the flip hint should be shown
  const [showFlipHint, setShowFlipHint] = useState(false);
  // State to solve flicker problem - prevents rendering of old card
  const [isEvaluating, setIsEvaluating] = useState(false);
  /**
   * Effect: When the card stack changes, select a new random card and reset flip state.
   * If no cards are available, set currentCard to null.
   */
  useEffect(() => {
    setIsEvaluating(false); // Reset evaluation state
    if (cards.length === 0) {
      setCurrentCard(null);
      setIsFlipped(false);
    } else {
      setCurrentCard(cards[Math.floor(Math.random() * cards.length)]);
      setIsFlipped(false);
    }
  }, [cards]);
  
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
   */
  const markCorrect = () => {
    if (currentCard && onEvaluate) {
      // Set evaluation state for smooth transition
      setIsEvaluating(true);
      setIsFlipped(false);
      onEvaluate(currentCard.id, true);
    }
  };
  
  /**
   * Marks the current card as answered incorrectly and calls the callback.
   */
  const markWrong = () => {
    if (currentCard && onEvaluate) {
      // Set evaluation state for smooth transition
      setIsEvaluating(true);
      setIsFlipped(false);
      onEvaluate(currentCard.id, false);
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
   * and resets flip state. Calls the onNextCard callback.
   */
  const handleNextCard = () => {
    if (cards.length > 1) {
      // Draw a different card than the current one
      let nextCard: CardType | null = null;
      const otherCards = cards.filter(card => card.id !== currentCard?.id);
      if (otherCards.length > 0) {
        nextCard = otherCards[Math.floor(Math.random() * otherCards.length)];
      } else {
        nextCard = cards[Math.floor(Math.random() * cards.length)];
      }
      setCurrentCard(nextCard);
      setIsFlipped(false);
    } else if (cards.length === 1) {
      setCurrentCard(cards[0]);
      setIsFlipped(false);
    }
    if (onNextCard) onNextCard();
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
                <Button $variant="secondary" onClick={handleNextCard}>
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
              You&apos;ve successfully completed all cards in this learning box!
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