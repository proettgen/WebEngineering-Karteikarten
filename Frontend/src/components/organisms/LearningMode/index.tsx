"use client";

import React, { useState, useEffect } from "react";
import { storageService } from "../../../services/storageService";
import { DatabaseData } from "../../../database/dbtypes";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";

export default function LearningMode() {
  const [cardPool, setCardPool] = useState<DatabaseData["folders"][number]["cards"]>([]);
  const [currentCard, setCurrentCard] = useState<DatabaseData["folders"][number]["cards"][number] | null>(null);
  const [isAnswerShown, setIsAnswerShown] = useState(false);

  useEffect(() => {
    const data = storageService.getData();
    // Alle Karteikarten aus allen Ordnern zusammenführen
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
      setIsAnswerShown(false);
    } else {
      setCurrentCard(null);
    }
  };

  const markCorrect = () => {
    if (currentCard) {
      // Entferne die aktuelle Karte aus dem Pool
      const updatedPool = cardPool.filter(card => card !== currentCard);
      setCardPool(updatedPool);
      if (updatedPool.length > 0) {
        setCurrentCard(updatedPool[Math.floor(Math.random() * updatedPool.length)]);
      } else {
        setCurrentCard(null);
      }
      setIsAnswerShown(false);
    }
  };

  const markWrong = () => {
    // Bei Falsch bleibt die Karte im Pool und es wird einfach die nächste Karte geladen.
    getNextCard();
  };

  return (
    <SC.Container>
      {currentCard ? (
        <>
          <SC.Title>{currentCard.title}</SC.Title>
          <SC.Question>{currentCard.question}</SC.Question>
          {isAnswerShown && <SC.Answer>{currentCard.answer}</SC.Answer>}
          {!isAnswerShown ? (
            <Button onClick={() => setIsAnswerShown(true)}>
              Antwort anzeigen
            </Button>
          ) : (
            <>
              <Button $variant="accept" onClick={markCorrect}>
                Richtig
              </Button>
              <Button $variant="deny" onClick={markWrong}>
                Falsch
              </Button>
            </>
          )}
          <Button $variant="secondary" onClick={getNextCard}>
            Nächste Karte
          </Button>
        </>
      ) : (
        <div>Keine Karteikarten verfügbar.</div>
      )}
    </SC.Container>
  );
}