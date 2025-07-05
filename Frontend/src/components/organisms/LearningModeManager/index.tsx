import React, { useState, useEffect } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { cardAndFolderService } from "@/services/cardAndFolderService";
import { LearningModeManagerProps } from "./types";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import * as SC from "./styles";

const clampBox = (level: number) => Math.max(0, Math.min(3, level)); // Hilfsfunktion: begrenzt Box-Level auf 0-3
const LAST_BOX = 3; // Maximale Box-Stufe
/**
 * Organism-Komponente für den eigentlichen Lernvorgang einer Box.
 *
 * Diese Komponente übernimmt die Logik für das Lernen der Karten in einer bestimmten Box eines Ordners:
 * - Lädt und filtert die Karten für die aktuelle Box (API-Aufruf)
 * - Verarbeitet Bewertungen (richtig/falsch) und verschiebt Karten in die nächste/andere Box (API-Aufruf)
 * - Erkennt, wenn alle Karten in der letzten Box sind (Lernziel erreicht) und zeigt eine Abschlussanzeige
 * - Bietet Funktionen zum Neustart (alle Karten zurücksetzen) und Rückkehr zur Auswahl
 *
 * State:
 * - cards: Karten in der aktuellen Box
 * - loadingCards, error: Lade- und Fehlerstatus
 * - isCompleted, completedTime: Abschlussstatus und benötigte Zeit
 * - resetKey: Schlüssel zum Erzwingen eines Remounts (z.B. nach Reset)
 *
 * Diese Komponente bindet die Komponente LearningMode ein und gibt ihr die Karten und Callbacks.
 * Sie ist für die gesamte Logik des Lernvorgangs einer Box zuständig.
 */
const LearningModeManager = ({
  folder,
  boxLevel,
  elapsedSeconds,
  onBack,
  onRestart,
  onBackToFolders,
}: LearningModeManagerProps) => {
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
    cardAndFolderService
      .getCardsByFolder(folder.id)
      .then((res) => {
        // Typ: { data: { cards: any[] } }
        const allCards = (res as { data: { cards: any[] } }).data.cards || [];
        setCards(
          allCards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel),
        );
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
      await cardAndFolderService.updateCardInFolder(folder.id, cardId, {
        boxLevel: newLevel,
      });
      // Karten neu laden
      setLoadingCards(true);
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      const newCards = allCards.filter(
        (c: any) => (c.boxLevel ?? 0) === boxLevel,
      );
      setCards(newCards);
      // Prüfen, ob alle Karten in der letzten Box sind (Lernziel erreicht)
      const allInLastBox =
        allCards.length > 0 &&
        allCards.every((c: any) => (c.boxLevel ?? 0) === LAST_BOX);
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
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      setCards(
        allCards.filter((card: any) => (card.boxLevel ?? 0) === boxLevel),
      );
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
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      await Promise.all(
        allCards.map((card: any) =>
          cardAndFolderService.updateCardInFolder(folder.id, card.id, {
            boxLevel: 0,
          }),
        ),
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
    setResetKey((prev) => prev + 1);
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
    return (
      <LearningModeTemplate>
        <div style={{ textAlign: "center", padding: 32 }}>
          <p>Karten werden geladen ...</p>
        </div>
      </LearningModeTemplate>
    );
  }
  if (error) {
    return (
      <LearningModeTemplate>
        <div style={{ textAlign: "center", padding: 32 }}>
          <p>{error}</p>
        </div>
      </LearningModeTemplate>
    );
  }
  if (isCompleted) {
    return (
      <LearningModeTemplate elapsedSeconds={completedTime ?? elapsedSeconds}>
        <SC.CongratsWrapper>
          <Headline size="lg">Congratulations!</Headline>
          <Text size="medium">
            You have successfully learned all flashcards.
          </Text>
          {typeof completedTime === "number" && (
            <Text size="medium">
              {`Total time: ${Math.floor(completedTime / 60)}:${String(completedTime % 60).padStart(2, "0")}`}
            </Text>
          )}
          <SC.ButtonRow>
            <Button $variant="primary" onClick={handleRestart}>
              Learn again
            </Button>
            <Button $variant="secondary" onClick={handleBackToFolders}>
              Back to folder selection
            </Button>
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
