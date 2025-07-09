import React, { useState, useEffect, useCallback } from "react";
import LearningMode from "@/components/organisms/LearningMode";
import { cardAndFolderService } from "@/services/cardAndFolderService";
import { analyticsService } from "@/services/analyticsService";
import { LearningModeManagerProps } from "./types";
import Button from "@/components/atoms/Button";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import * as SC from "./styles";

const clampBox = (level: number) => Math.max(0, Math.min(4, level)); // Hilfsfunktion: begrenzt Box-Level auf 0-4 (Box 5 ist unsichtbar)
const LAST_VISIBLE_BOX = 3; // Box 4 (letzte sichtbare Box)
const MASTERED_BOX = 4; // Box 5 (unsichtbare "gemeisterte" Box)

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
const LearningModeManager: React.FC<LearningModeManagerProps> = React.memo(({
  folder,
  currentLearningLevel,
  elapsedSeconds,
  onBack,
  onRestart,
  onBackToFolders,
  onRefreshCounts,
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
          allCards.filter((card: any) => (card.currentLearningLevel ?? 0) === currentLearningLevel),
        );
        setError(null);
      })
      .catch(() => setError("Error loading cards"))
      .finally(() => {
        setIsCompleted(false);
        setCompletedTime(null);
        setLoadingCards(false);
      });
  }, [folder.id, currentLearningLevel, resetKey]);
  /**
   * Bewertet eine Karte als richtig/falsch, verschiebt sie in die nächste/letzte Box und prüft, ob alle Karten gelernt wurden.
   * Box 0-3: Sichtbare Boxen, Box 4: Unsichtbare "gemeisterte" Box
   * Speziallogik: Karten in Box 3 wandern nur bei korrekter Antwort in Box 4 (unsichtbar)
   */
  const handleEvaluate = useCallback(async (cardId: string, correct: boolean) => {
    // Finde die Karte
    const card = cards.find((c: any) => c.id === cardId);
    if (!card) return;
    
    let newLevel = card.currentLearningLevel ?? 0;
    
    if (correct) {
      // Bei korrekter Antwort: Eine Box höher (Box 3 -> Box 4 unsichtbar)
      newLevel = clampBox(newLevel + 1);
    } else {
      // Bei falscher Antwort: Eine Box niedriger, aber mindestens Box 0
      newLevel = clampBox(newLevel - 1);
    }
    
    try {
      // Optimierte Kartenaktualisierung: Entferne die bewertete Karte sofort aus dem lokalen State
      const updatedCards = cards.filter((c: any) => c.id !== cardId);
      setCards(updatedCards);
      
      // Backend-Update im Hintergrund
      await cardAndFolderService.updateCardInFolder(folder.id, cardId, {
        currentLearningLevel: newLevel,
      });

      // PHASE 4: Live Analytics Tracking - Track card evaluation
      try {
        await analyticsService.incrementAnalytics({
          totalCardsLearned: 1,
          totalCorrect: correct ? 1 : 0,
          totalWrong: correct ? 0 : 1,
        });
      } catch (analyticsError) {
        // Analytics tracking is optional - don't break the learning flow
        // eslint-disable-next-line no-console
        console.warn('Failed to track analytics for card evaluation:', analyticsError);
      }
      
      // Rufe das Callback auf, um Box-Counts zu aktualisieren
      if (onRefreshCounts) {
        await onRefreshCounts();
      }
      
      // Prüfen, ob alle Karten in Box 4 (unsichtbar) sind (Lernziel erreicht)
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      const allInMasteredBox =
        allCards.length > 0 &&
        allCards.every((c: any) => (c.currentLearningLevel ?? 0) === MASTERED_BOX);
      
      if (allInMasteredBox) {
        setIsCompleted(true);
        setCompletedTime(elapsedSeconds);
      }
    } catch {
      setError("Error updating card");
      // Bei Fehler: Karten neu laden
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      setCards(allCards.filter((c: any) => (c.currentLearningLevel ?? 0) === currentLearningLevel));
    }
  }, [cards, folder.id, elapsedSeconds, onRefreshCounts, currentLearningLevel]);

  /**
   * Lädt die Karten für die aktuelle Box neu (z.B. nach Bewertung oder Zurück).
   */
  const handleNextCard = useCallback(async () => {
    // Nur Loading-State setzen, wenn wir wirklich neu laden müssen
    try {
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      setCards(
        allCards.filter((card: any) => (card.currentLearningLevel ?? 0) === currentLearningLevel),
      );
    } catch {
      setError("Error reloading cards");
    }
  }, [folder.id, currentLearningLevel]);
  
  /**
   * Geht zurück zur vorherigen Ansicht und lädt die Karten neu.
   */
  const handleBack = useCallback(() => {
    handleNextCard();
    onBack();
  }, [handleNextCard, onBack]);

  /**
   * Setzt alle Karten im aktuellen Ordner auf Box 0 zurück (Neustart).
   */
  const resetAllCardsToBox0 = useCallback(async () => {
    setLoadingCards(true);
    try {
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      await Promise.all(
        allCards.map((card: any) =>
          cardAndFolderService.updateCardInFolder(folder.id, card.id, {
            currentLearningLevel: 0,
          }),
        ),
      );
    } catch {
      setError("Error resetting cards");
    } finally {
      setLoadingCards(false);
    }
  }, [folder.id]);

  /**
   * Setzt alle Karten aus Box 5 (unsichtbar) zurück in Box 4 (sichtbar).
   * Dies wird verwendet, wenn der Benutzer "Back to Folders" wählt.
   */
  const resetMasteredCardsToLastBox = useCallback(async () => {
    try {
      const res = await cardAndFolderService.getCardsByFolder(folder.id);
      const allCards = (res as { data: { cards: any[] } }).data.cards || [];
      
      // Nur Karten aus Box 5 zurück in Box 4 setzen
      const masteredCards = allCards.filter((card: any) => (card.currentLearningLevel ?? 0) === MASTERED_BOX);
      
      await Promise.all(
        masteredCards.map((card: any) =>
          cardAndFolderService.updateCardInFolder(folder.id, card.id, {
            currentLearningLevel: LAST_VISIBLE_BOX,
          }),
        ),
      );
    } catch {
      setError("Error resetting mastered cards");
    }
  }, [folder.id]);

  /**
   * Startet den Lernmodus neu (setzt alle Karten zurück und erhöht den Reset-Key).
   */
  const handleRestart = useCallback(async () => {
    await resetAllCardsToBox0();
    setResetKey((prev) => prev + 1);

    // PHASE 4: Live Analytics Tracking - Track folder reset
    try {
      await analyticsService.trackReset('folder');
    } catch (analyticsError) {
      // Analytics tracking is optional - don't break the learning flow
      // eslint-disable-next-line no-console
      console.warn('Failed to track analytics for folder reset:', analyticsError);
    }

    // Aktualisiere Box-Counts nach dem Reset
    if (onRefreshCounts) {
      await onRefreshCounts();
    }
    if (typeof onRestart === "function") onRestart();
  }, [resetAllCardsToBox0, onRefreshCounts, onRestart]);

  /**
   * Geht zurück zur Ordnerauswahl. Wenn das Lernen abgeschlossen ist, werden alle Karten
   * aus Box 5 (unsichtbar) zurück in Box 4 (sichtbar) gesetzt, da sie mit der Zeit vergessen werden.
   */
  const handleBackToFolders = useCallback(async () => {
    // Wenn das Lernen abgeschlossen ist, setze alle gemeisterten Karten zurück in Box 4
    if (isCompleted) {
      await resetMasteredCardsToLastBox();
      // Aktualisiere Box-Counts nach dem Reset
      if (onRefreshCounts) {
        await onRefreshCounts();
      }
    }
    
    if (typeof onBackToFolders === "function") onBackToFolders();
    else handleBack();
  }, [onBackToFolders, handleBack, isCompleted, resetMasteredCardsToLastBox, onRefreshCounts]);

  // Wenn alle Karten gelernt wurden, könnte hier eine Abschlussanzeige gerendert werden
  if (loadingCards) {
    return (
      <SC.CenteredContainer>
        <p>Loading cards ...</p>
      </SC.CenteredContainer>
    );
  }
  if (error) {
    return (
      <SC.CenteredContainer>
        <p>{error}</p>
      </SC.CenteredContainer>
    );
  }
  if (isCompleted) {
    return (
      <SC.CongratsWrapper>
        <Headline size="lg">Congratulations!</Headline>
        <Text size="medium">
          You have successfully mastered all flashcards in this folder!
        </Text>
        <Text size="medium" color="textSecondary">
          All cards have been answered correctly and are now fully learned.
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
        <Text size="small" color="textSecondary">
          Choose &quot;Learn again&quot; to start from scratch, or &quot;Back to folder selection&quot; to keep your progress and continue later.
        </Text>
      </SC.CongratsWrapper>
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
      currentLearningLevel={currentLearningLevel}
    />
  );
});

LearningModeManager.displayName = 'LearningModeManager';

export default LearningModeManager;
