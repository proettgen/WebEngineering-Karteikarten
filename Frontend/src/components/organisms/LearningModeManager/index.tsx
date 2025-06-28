/*
import React, { useState, useEffect } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { storageService } from "@/services/storageService";
import { LearningModeManagerProps } from "./types";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import * as SC from "./styles";

const clampBox = (level: number) => Math.max(0, Math.min(3, level)); // Hilfsfunktion: begrenzt Box-Level auf 0-3
const LAST_BOX = 3; // Maximale Box-Stufe
*/
/**
 * LearningModeManager-Komponente
 * Steuert den Ablauf des Lernvorgangs für einen Ordner und eine bestimmte Box-Stufe.
 * - Lädt und filtert die Karten für die aktuelle Box
 * - Verarbeitet Bewertungen (richtig/falsch) und verschiebt Karten entsprechend
 * - Erkennt, wenn alle Karten in der letzten Box sind (Lernziel erreicht)
 * - Bietet Funktionen zum Neustart und Rückkehr zur Auswahl
 */
/*
const LearningModeManager = ({ folder, boxLevel, elapsedSeconds, onBack, onRestart, onBackToFolders }: LearningModeManagerProps) => {
  // State für die aktuell zu lernenden Karten
  const [cards, setCards] = useState<any[]>([]);
  // State, ob der Lernvorgang abgeschlossen ist
  const [isCompleted, setIsCompleted] = useState(false);
  // State für die benötigte Zeit bis zum Abschluss
  const [completedTime, setCompletedTime] = useState<number | null>(null);
  // Schlüssel zum Erzwingen eines Remounts (z.B. nach Reset)
  const [resetKey, setResetKey] = useState(0);
*/
  /**
   * Effekt: Lädt die Karten für die aktuelle Box und setzt Abschluss-Status zurück, wenn Ordner, Box oder Reset sich ändern.
   */
  /*
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
*/
  /**
   * Bewertet eine Karte als richtig/falsch, verschiebt sie in die nächste/letzte Box und prüft, ob alle Karten gelernt wurden.
   */

  /*
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
    // Prüfen, ob alle Karten in der letzten Box sind (Lernziel erreicht)
    const allInLastBox = afterUpdateFolder && afterUpdateFolder.cards.length > 0 && afterUpdateFolder.cards.every((card: any) => (card.boxLevel ?? 0) === LAST_BOX);
    if (allInLastBox) {
      setIsCompleted(true);
      setCompletedTime(elapsedSeconds);
    }
  };
*/
  /**
   * Lädt die Karten für die aktuelle Box neu (z.B. nach Bewertung oder Zurück).
   */
  /*
  const handleNextCard = () => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    setCards(
      freshFolder
        ? freshFolder.cards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel)
        : []
    );
  };
*/
  /**
   * Geht zurück zur vorherigen Ansicht und lädt die Karten neu.
   */
  /*
  const handleBack = () => {
    handleNextCard();
    onBack();
  };
*/
  /**
   * Setzt alle Karten im aktuellen Ordner auf Box 0 zurück (Neustart).
   */
  /*
  const resetAllCardsToBox0 = () => {
    const freshFolders = storageService.getData().folders;
    const freshFolder = freshFolders.find((f: any) => f.id === folder.id);
    if (!freshFolder) return;
    freshFolder.cards.forEach((card: any) => {
      storageService.updateSingleCardBoxLevel(freshFolder.id, card.id, 0);
    });
  };
*/
  /**
   * Startet den Lernmodus neu (setzt alle Karten zurück und erhöht den Reset-Key).
   */
  /*
  const handleRestart = () => {
    resetAllCardsToBox0();
    setResetKey(prev => prev + 1);
    if (typeof onRestart === "function") onRestart();
  };
*/
  /**
   * Geht zurück zur Ordnerauswahl oder zur vorherigen Ansicht.
   */
  /*
  const handleBackToFolders = () => {
    if (typeof onBackToFolders === "function") onBackToFolders();
    else handleBack();
  };

  // Wenn alle Karten gelernt wurden, könnte hier eine Abschlussanzeige gerendert werden
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

  // Haupt-Rendering: Übergibt die Karten und Callbacks an die LearningMode-Komponente
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
*/