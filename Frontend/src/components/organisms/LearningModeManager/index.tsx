import React, { useState } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { storageService } from "@/services/storageService";

type Folder = {
  id: string;
  cards: any[];
  // Füge hier weitere Eigenschaften hinzu, falls benötigt
};

type LearningModeManagerProps = {
  folder: Folder;
  boxLevel: number;
  elapsedSeconds: number;
  onBack: () => void;
};

const clampBox = (level: number) => Math.max(0, Math.min(3, level));

const LearningModeManager = ({ folder, boxLevel, elapsedSeconds, onBack }: LearningModeManagerProps) => {
  // Initialisiere mit Karten aus dem Folder
  const [cards, setCards] = useState(
    folder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
  );

  const handleEvaluate = (cardId: string, correct: boolean) => {
    // Hole immer das aktuelle Folder-Objekt aus dem Storage
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);

    if (!freshFolder) return;

    // Verschiebe NUR die bewertete Karte ins nächste/vorherige Fach
    const updatedCards = freshFolder.cards.map((card: any) => {
      if (card.id === cardId) {
        let newLevel = card.boxLevel ?? 0;
        if (correct) newLevel = clampBox(newLevel + 1);
        else newLevel = clampBox(newLevel - 1);
        return { ...card, boxLevel: newLevel };
      }
      return card;
    });

    // Update im Storage
    storageService.updateCardBoxLevel(freshFolder.id, updatedCards);

    // Aktualisiere den Pool für das aktuelle Fach (erneut aus Storage laden!)
    const afterUpdateFolders = storageService.getData().folders;
    const afterUpdateFolder = afterUpdateFolders.find((f: any) => f.id === folder.id);
    setCards(
      afterUpdateFolder
        ? afterUpdateFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
  };

  return (
    <LearningMode
      elapsedSeconds={elapsedSeconds}
      cards={cards}
      onEvaluate={handleEvaluate}
      onBack={onBack}
    />
  );
};

export default LearningModeManager;
