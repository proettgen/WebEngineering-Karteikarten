import React, { useState, useEffect } from "react";
import { storageService } from "../../../services/storageService";
import { DatabaseData } from "../../../database/dbtypes";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";

type LearningModeProps = {
  elapsedSeconds: number;
};

const LearningMode = ({ elapsedSeconds }: LearningModeProps) => {
  const [cardPool, setCardPool] = useState<
    DatabaseData["folders"][number]["cards"]
  >([]);
  const [currentCard, setCurrentCard] = useState<
    DatabaseData["folders"][number]["cards"][number] | null
  >(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Zustand für den Hinweis, ob die Karte umgedreht werden muss
  const [showFlipHint, setShowFlipHint] = useState(false);
  const handleHint = () => {
    if (!isFlipped) {
      setShowFlipHint(true);
      setTimeout(() => setShowFlipHint(false), 2000); // Hinweis verschwindet nach 2 Sekunden
    }
  };

  useEffect(() => {
    const data = storageService.getData();
    const allCards = data.folders.flatMap((folder) => folder.cards);
    setCardPool(allCards);
    if (allCards.length > 0) {
      setCurrentCard(allCards[Math.floor(Math.random() * allCards.length)]);
    }
  }, []);

  const getNextCard = () => {
    if (cardPool.length > 0) {
      const next = cardPool[Math.floor(Math.random() * cardPool.length)];
      setCurrentCard(next);
      setIsFlipped(false);
    } else {
      setCurrentCard(null);
    }
  };

  const markCorrect = () => {
    if (currentCard) {
      const updatedPool = cardPool.filter((card) => card !== currentCard);
      setCardPool(updatedPool);
      if (updatedPool.length > 0) {
        setCurrentCard(
          updatedPool[Math.floor(Math.random() * updatedPool.length)],
        );
      } else {
        setCurrentCard(null);
      }
      setIsFlipped(false);
    }
  };

  const markWrong = () => {
    getNextCard();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <LearningModeTemplate elapsedSeconds={elapsedSeconds}>
      <SC.Container>
        {currentCard ? (
          <SC.LearningContainer>
            <Card
              title={currentCard.title}
              question={currentCard.question}
              answer={currentCard.answer}
              tags={currentCard.tags}
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
              <Button $variant="secondary" onClick={getNextCard}>
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
