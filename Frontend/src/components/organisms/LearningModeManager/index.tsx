import React, { useState, useEffect } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { storageService } from "@/services/storageService";
import { LearningModeManagerProps } from "./types";

const clampBox = (level: number) => Math.max(0, Math.min(3, level));

const LearningModeManager = ({ folder, boxLevel, elapsedSeconds, onBack }: LearningModeManagerProps) => {
  // Pool für das aktuelle Fach im State
  const [cards, setCards] = useState<any[]>([]);

  // Initialisierung: Pool aus Storage laden
  useEffect(() => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    setCards(
      freshFolder
        ? freshFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
  }, [folder.id, boxLevel]);

  // Karte bewerten: Im Storage verschieben, im State entfernen
  const handleEvaluate = (cardId: string, correct: boolean) => {
    // Hole aktuelle Karte aus dem Storage
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    if (!freshFolder) return;
    const card = freshFolder.cards.find((c: any) => c.id === cardId);
    if (!card) return;
    let newLevel = card.boxLevel ?? 0;
    if (correct) newLevel = clampBox(newLevel + 1);
    else newLevel = clampBox(newLevel - 1);
    // Verschiebe nur die bewertete Karte im Storage
    storageService.updateSingleCardBoxLevel(freshFolder.id, cardId, newLevel);

    // Lade den Pool aus dem Storage neu, damit wirklich nur die Karten mit aktuellem boxLevel angezeigt werden
    const afterUpdateFolders = storageService.getData().folders;
    const afterUpdateFolder = afterUpdateFolders.find((f: any) => f.id === folder.id);
    setCards(
      afterUpdateFolder
        ? afterUpdateFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
  };

  // Pool explizit aus Storage neu laden (z.B. bei Next Card)
  const handleNextCard = () => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    setCards(
      freshFolder
        ? freshFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
  };

  // Optional: Pool auch bei onBack neu laden (wenn gewünscht)
  const handleBack = () => {
    handleNextCard();
    onBack();
  };

  return (
    <LearningMode
      elapsedSeconds={elapsedSeconds}
      cards={cards}
      onEvaluate={handleEvaluate}
      onNextCard={handleNextCard}
      onBack={handleBack}
    />
  );
};

export default LearningModeManager;
