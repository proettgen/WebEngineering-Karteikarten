import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";

// Ergänze einen lokalen Card-Typ mit id
type CardType = {
  id: string;
  title: string;
  question: string;
  answer: string;
  tags?: string[] | null;
  boxLevel?: number;
  // ggf. weitere Felder
};

type LearningModeProps = {
  elapsedSeconds: number;
  cards: CardType[];
  onEvaluate?: (cardId: string, correct: boolean) => void;
  onNextCard?: () => void;
  onBack?: () => void;
};

const LearningMode = ({ elapsedSeconds, cards, onEvaluate, onNextCard, onBack }: LearningModeProps) => {
  const [currentCard, setCurrentCard] = useState<CardType | null>(
    cards.length > 0 ? cards[Math.floor(Math.random() * cards.length)] : null
  );
  const [isFlipped, setIsFlipped] = useState(false);

  // Immer wenn sich cards ändert (Referenz!), neue Karte ziehen
  useEffect(() => {
    if (cards.length === 0) {
      setCurrentCard(null);
      setIsFlipped(false);
    } else {
      setCurrentCard(cards[Math.floor(Math.random() * cards.length)]);
      setIsFlipped(false);
    }
  }, [cards]);

  // Zustand für den Hinweis, ob die Karte umgedreht werden muss
  const [showFlipHint, setShowFlipHint] = useState(false);
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
    <LearningModeTemplate elapsedSeconds={elapsedSeconds}>
      <SC.Container>
        {onBack && (
          <div style={{ marginBottom: 16 }}>
            <Button $variant="secondary" onClick={onBack}>
              Zurück
            </Button>
          </div>
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
            <SC.ButtonContainer>
              <span
                style={{ display: "inline-block" }}
                onMouseDown={handleHint}
                onMouseEnter={handleHint}
                tabIndex={-1}
              >
                <Button
                  $variant="accept"
                  onClick={markCorrect}
                  disabled={!isFlipped}
                >
                  Correct
                </Button>
              </span>
              <span
                style={{ display: "inline-block" }}
                onMouseDown={handleHint}
                onMouseEnter={handleHint}
                tabIndex={-1}
              >
                <Button $variant="deny" onClick={markWrong} disabled={!isFlipped}>
                  Incorrect
                </Button>
              </span>
              <Button $variant="secondary" onClick={handleNextCard}>
                Next Card
              </Button>
            </SC.ButtonContainer>
            <div style={{ minHeight: 24, marginTop: 8 }}>
              {showFlipHint && (
                <span style={{ color: "red" }}>
                  Please flip the card first to evaluate it!
                </span>
              )}
            </div>
          </SC.LearningContainer>
        ) : (
          <div>No flashcards available.</div>
        )}
      </SC.Container>
    </LearningModeTemplate>
  );
};
export default LearningMode;
