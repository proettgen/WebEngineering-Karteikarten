import React, { useState, useEffect } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { apiService } from "@/services/apiService";
import { LearningModeManagerProps } from "./types";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import * as SC from "./styles";

const clampBox = (level: number) => Math.max(0, Math.min(3, level)); // Hilfsfunktion: begrenzt Box-Level auf 0-3
const LAST_BOX = 3; // Maximale Box-Stufe
/**
 * LearningModeManager-Komponente
 * Steuert den Ablauf des Lernvorgangs für einen Ordner und eine bestimmte Box-Stufe.
 * - Lädt und filtert die Karten für die aktuelle Box
 * - Verarbeitet Bewertungen (richtig/falsch) und verschiebt Karten entsprechend
 * - Erkennt, wenn alle Karten in der letzten Box sind (Lernziel erreicht)
 * - Bietet Funktionen zum Neustart und Rückkehr zur Auswahl
 */
const LearningModeManager = ({ folder, boxLevel, elapsedSeconds, onBack, onRestart, onBackToFolders }: LearningModeManagerProps) => {
  // State für die aktuell zu lernenden Karten
  const [cards, setCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State, ob der Lernvorgang abgeschlossen ist
  const [isCompleted, setIsCompleted] = useState(false);
  // State für die benötigte Zeit bis zum Abschluss
  const [completedTime, setCompletedTime] = useState<number | null>(null);
  // Schlüssel zum Erzwingen eines Remounts (z.B. nach Reset)
  const [resetKey, setResetKey] = useState(0);
  /**
   * Effekt: Lädt die Karten für die aktuelle Box und setzt Abschluss-Status zurück, wenn Ordner, Box oder Reset sich ändern.
   */
  useEffect(() => {
    setLoadingCards(true);
    apiService.getCardsByFolder(folder.id)
      .then((res) => {
        // Typ: { data: { cards: any[] } }
        const allCards = (res as { data: { cards: any[] } }).data.cards || [];
        setCards(allCards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel));
        setError(null);
      })
      .catch(() => setError("Fehler beim Laden der Karten"))
      .finally(() => {
        setIsCompleted(false);
        setCompletedTime(null);
        setLoadingCards(false);
      });
  }, [folder.id, boxLevel, resetKey]);
  /**
   * Bewertet eine Karte als richtig/falsch, verschiebt sie in die nächste/letzte Box und prüft, ob alle Karten gelernt wurden.
   */

  const handleEvaluate = async (cardId: string, correct: boolean) => {
    // Finde die Karte
    const card = cards.find((c: any) => c.id === cardId);
    if (!card) return;
    let newLevel = card.boxLevel ?? 0;
    if (correct) newLevel = clampBox(newLevel + 1);
    else newLevel = clampBox(newLevel - 1);
    try {
      await apiService.updateCardInFolder(folder.id, cardId, { boxLevel: newLevel });
      // Karten neu laden
      setLoadingCards(true);
      const res = await apiService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      const newCards = allCards.filter((c: any) => (c.boxLevel ?? 0) === boxLevel);
      setCards(newCards);
      // Prüfen, ob alle Karten in der letzten Box sind (Lernziel erreicht)
      const allInLastBox = allCards.length > 0 && allCards.every((c: any) => (c.boxLevel ?? 0) === LAST_BOX);
      if (allInLastBox) {
        setIsCompleted(true);
        setCompletedTime(elapsedSeconds);
      }
    } catch {
      setError("Fehler beim Aktualisieren der Karte");
    } finally {
      setLoadingCards(false);
    }
  };
  /**
   * Lädt die Karten für die aktuelle Box neu (z.B. nach Bewertung oder Zurück).
   */
  const handleNextCard = async () => {
    setLoadingCards(true);
    try {
      const res = await apiService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      setCards(allCards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel));
    } catch {
      setError("Fehler beim Nachladen der Karten");
    } finally {
      setLoadingCards(false);
    }
  };
  /**
   * Geht zurück zur vorherigen Ansicht und lädt die Karten neu.
   */
  const handleBack = () => {
    handleNextCard();
    onBack();
  };
  /**
   * Setzt alle Karten im aktuellen Ordner auf Box 0 zurück (Neustart).
   */
  const resetAllCardsToBox0 = async () => {
    setLoadingCards(true);
    try {
      const res = await apiService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      await Promise.all(
        allCards.map((card: any) =>
          apiService.updateCardInFolder(folder.id, card.id, { boxLevel: 0 })
        )
      );
    } catch {
      setError("Fehler beim Zurücksetzen der Karten");
    } finally {
      setLoadingCards(false);
    }
  };
  /**
   * Startet den Lernmodus neu (setzt alle Karten zurück und erhöht den Reset-Key).
   */
  const handleRestart = async () => {
    await resetAllCardsToBox0();
    setResetKey(prev => prev + 1);
    if (typeof onRestart === "function") onRestart();
  };
  /**
   * Geht zurück zur Ordnerauswahl oder zur vorherigen Ansicht.
   */
  const handleBackToFolders = () => {
    if (typeof onBackToFolders === "function") onBackToFolders();
    else handleBack();
  };

  // Wenn alle Karten gelernt wurden, könnte hier eine Abschlussanzeige gerendert werden
  if (loadingCards) {
    return <LearningModeTemplate><div style={{textAlign: "center", padding: 32}}><p>Karten werden geladen ...</p></div></LearningModeTemplate>;
  }
  if (error) {
    return <LearningModeTemplate><div style={{textAlign: "center", padding: 32}}><p>{error}</p></div></LearningModeTemplate>;
  }
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