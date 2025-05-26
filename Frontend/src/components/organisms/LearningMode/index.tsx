import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import { CardType, LearningModeProps } from "./types";

const LearningMode = ({ elapsedSeconds, cards, onEvaluate, onNextCard, onBack, boxLevel }: LearningModeProps) => {
  const [currentCard, setCurrentCard] = useState<CardType | null>(
    cards.length > 0 ? cards[Math.floor(Math.random() * cards.length)] : null
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFlipHint, setShowFlipHint] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      setCurrentCard(null);
      setIsFlipped(false);
    } else {
      setCurrentCard(cards[Math.floor(Math.random() * cards.length)]);
      setIsFlipped(false);
    }
  }, [cards]);

  const handleHint = () => {
    if (!isFlipped) {
      setShowFlipHint(true);
      setTimeout(() => setShowFlipHint(false), 2000); // Hinweis verschwindet nach 2 Sekunden
    }
  };

  const markCorrect = () => {
    if (currentCard && onEvaluate) {
      onEvaluate(currentCard.id, true);
    }
  };

  const markWrong = () => {
    if (currentCard && onEvaluate) {
      onEvaluate(currentCard.id, false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (cards.length > 1) {
      // Ziehe eine andere Karte als die aktuelle
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
    <LearningModeTemplate elapsedSeconds={elapsedSeconds} boxLevel={boxLevel}>
      <SC.Container>
        {onBack && (
          <SC.TopRow>
            <Button $variant="secondary" onClick={onBack}>
              Back
            </Button>
          </SC.TopRow>
        )}
        {currentCard ? (
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
                  Correct
                </Button>
              </SC.HintWrapper>
              <SC.HintWrapper onMouseDown={handleHint} onMouseEnter={handleHint} tabIndex={-1}>
                <Button $variant="deny" onClick={markWrong} disabled={!isFlipped}>
                  Incorrect
                </Button>
              </SC.HintWrapper>
              <Button $variant="secondary" onClick={handleNextCard}>
                Next Card
              </Button>
            </SC.ButtonRow>
            <SC.HintArea>
              {showFlipHint && (
                <Text color="deny">Please flip the card first to evaluate it!</Text>
              )}
            </SC.HintArea>
          </SC.LearningContainer>
        ) : (
          <Headline size="md">No more flashcards in current box available.</Headline>
        )}
      </SC.Container>
    </LearningModeTemplate>
  );
};
export default LearningMode;
