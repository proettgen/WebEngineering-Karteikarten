import React, { useState, useEffect } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { storageService } from "@/services/storageService";
import { LearningModeManagerProps } from "./types";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import * as SC from "./styles";

const clampBox = (level: number) => Math.max(0, Math.min(3, level));
const LAST_BOX = 3;

const LearningModeManager = ({ folder, boxLevel, elapsedSeconds, onBack, onRestart, onBackToFolders }: LearningModeManagerProps) => {
  const [cards, setCards] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedTime, setCompletedTime] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    setCards(
      freshFolder
        ? freshFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
    setIsCompleted(false);
    setCompletedTime(null);
  }, [folder.id, boxLevel, resetKey]);

  const handleEvaluate = (cardId: string, correct: boolean) => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    if (!freshFolder) return;
    const card = freshFolder.cards.find((c: any) => c.id === cardId);
    if (!card) return;
    let newLevel = card.boxLevel ?? 0;
    if (correct) newLevel = clampBox(newLevel + 1);
    else newLevel = clampBox(newLevel - 1);
    storageService.updateSingleCardBoxLevel(freshFolder.id, cardId, newLevel);
    const afterUpdateFolders = storageService.getData().folders;
    const afterUpdateFolder = afterUpdateFolders.find((f: any) => f.id === folder.id);
    const newCards = afterUpdateFolder
      ? afterUpdateFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
      : [];
    setCards(newCards);
    const allInLastBox = afterUpdateFolder && afterUpdateFolder.cards.length > 0 && afterUpdateFolder.cards.every((card: any) => (card.boxLevel ?? 0) === LAST_BOX);
    if (allInLastBox) {
      setIsCompleted(true);
      setCompletedTime(elapsedSeconds);
    }
  };

  const handleNextCard = () => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    setCards(
      freshFolder
        ? freshFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
  };

  const handleBack = () => {
    handleNextCard();
    onBack();
  };

  const resetAllCardsToBox0 = () => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    if (!freshFolder) return;
    freshFolder.cards.forEach((card: any) => {
      storageService.updateSingleCardBoxLevel(freshFolder.id, card.id, 0);
    });
  };

  const handleRestart = () => {
    resetAllCardsToBox0();
    setResetKey(prev => prev + 1);
    if (typeof onRestart === "function") onRestart();
  };

  const handleBackToFolders = () => {
    if (typeof onBackToFolders === "function") onBackToFolders();
    else handleBack();
  };

  if (isCompleted) {
    return (
      <LearningModeTemplate elapsedSeconds={completedTime ?? elapsedSeconds}>
        <SC.CongratsWrapper>
          <Headline size="lg">Congratulations!</Headline>
          <Text size="medium">You have successfully learned all flashcards.</Text>
          {typeof completedTime === "number" && (
            <Text size="medium">
              {`Total time: ${Math.floor(completedTime / 60)}:${String(completedTime % 60).padStart(2, "0")}`}
            </Text>
          )}
          <SC.ButtonRow>
            <Button $variant="primary" onClick={handleRestart}>Learn again</Button>
            <Button $variant="secondary" onClick={handleBackToFolders}>Back to folder selection</Button>
          </SC.ButtonRow>
        </SC.CongratsWrapper>
      </LearningModeTemplate>
    );
  }

  return (
    <LearningMode
      elapsedSeconds={elapsedSeconds}
      cards={cards}
      onEvaluate={handleEvaluate}
      onNextCard={handleNextCard}
      onBack={handleBack}
      boxLevel={boxLevel}
    />
  );
};

export default LearningModeManager;
