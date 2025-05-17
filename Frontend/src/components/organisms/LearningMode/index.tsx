import React, { useState, useEffect } from "react";
import { storageService } from "../../../services/storageService";
import { DatabaseData } from "../../../database/dbtypes";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";

const LearningMode = () => {
  const [cardPool, setCardPool] = useState<
    DatabaseData["folders"][number]["cards"]
  >([]);
  const [currentCard, setCurrentCard] = useState<
    DatabaseData["folders"][number]["cards"][number] | null
  >(null);
  const [isFlipped, setIsFlipped] = useState(false);

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
            <Button $variant="accept" onClick={markCorrect}>
              Richtig
            </Button>
            <Button $variant="deny" onClick={markWrong}>
              Falsch
            </Button>
            <Button $variant="secondary" onClick={getNextCard}>
              Nächste Karte
            </Button>
          </SC.ButtonContainer>
        </SC.LearningContainer>
      ) : (
        <div>Keine Karteikarten verfügbar.</div>
      )}
    </SC.Container>
  );
};
export default LearningMode;
