import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import { CardType, LearningModeProps } from "./types";
/**
 * Organism-Komponente für die Interaktion mit einer einzelnen Lernkarte im Lernmodus.
 *
 * Diese Komponente ist Teil des "LearningMode"-Features und wird von der übergeordneten Komponente
 * LearningModeManager (siehe ../LearningModeManager/index.tsx) verwendet. Sie ist für die Anzeige und Interaktion
 * mit einer einzelnen Karte zuständig (Frage/Antwort, Flip, Bewertung, Navigation zur nächsten Karte).
 *
 * Wichtige Verantwortlichkeiten:
 * - Zeigt eine zufällige Karte aus dem aktuellen Kartenstapel an (props.cards)
 * - Ermöglicht das Umdrehen der Karte (Frage <-> Antwort)
 * - Bewertet die Karte als richtig/falsch (Buttons), ruft dazu das Callback onEvaluate auf
 * - Navigiert zur nächsten Karte (onNextCard)
 * - Zeigt einen Flip-Hinweis an, falls die Karte noch nicht umgedreht wurde
 * - Zeigt einen Zurück-Button, um den Lernmodus zu verlassen (onBack)
 *
 * Props (siehe ./types.ts für Details):
 * - elapsedSeconds: Zeit, die im Lernmodus bereits vergangen ist (für Timer-Anzeige)
 * - cards: Array der zu lernenden Karten (nur Karten der aktuellen Box)
 * - onEvaluate: Callback, wenn eine Karte als richtig/falsch bewertet wird
 * - onNextCard: Callback, wenn zur nächsten Karte gewechselt wird
 * - onBack: Callback, um den Lernmodus zu verlassen
 * - currentLearningLevel: Aktuelles Lernlevel/Box-Stufe (0-3)
 *
 * Diese Komponente ist rein für die UI und Interaktion mit einer Karte zuständig, aber nicht für das Laden oder Bewerten der Karten im Backend.
 * Die Logik für das Laden und Bewerten der Karten liegt in LearningModeManager (../LearningModeManager/index.tsx).
 *
 * Verwendete Hilfsdateien:
 * - ./styles.ts: Styled Components für das Layout und Styling
 * - ./types.ts: Typdefinitionen für Props und Karten
 * - ../LearningModeManager/index.tsx: Übergeordnete Logik für den Lernmodus einer Box
 * - @/components/templates/LearningModeTemplate: Layout-Wrapper für den Lernmodus (Header, Timer, Box-Anzeige)
 */
const LearningMode = ({ elapsedSeconds, cards, onEvaluate, onNextCard, onBack, currentLearningLevel }: LearningModeProps) => {
  // State für die aktuell angezeigte Karte (wird zufällig aus dem Stapel gewählt)
  const [currentCard, setCurrentCard] = useState<CardType | null>(
    cards.length > 0 ? cards[Math.floor(Math.random() * cards.length)] : null
  );
  // State, ob die Karte umgedreht (Antwort sichtbar) ist
  const [isFlipped, setIsFlipped] = useState(false);
  // State, ob der Flip-Hinweis angezeigt werden soll
  const [showFlipHint, setShowFlipHint] = useState(false);
  /**
   * Effekt: Wenn sich der Kartenstapel ändert, wähle eine neue zufällige Karte und setze den Flip-Zustand zurück.
   * Wenn keine Karten mehr vorhanden sind, setze currentCard auf null.
   */
  useEffect(() => {
    if (cards.length === 0) {
      setCurrentCard(null);
      setIsFlipped(false);
    } else {
      setCurrentCard(cards[Math.floor(Math.random() * cards.length)]);
      setIsFlipped(false);
    }
  }, [cards]);
  /**
   * Zeigt einen kurzen Hinweis an, dass die Karte umgedreht werden kann (z.B. bei Mouseover).
   * Der Hinweis verschwindet nach 2 Sekunden automatisch.
   */
  const handleHint = () => {
    if (!isFlipped) {
      setShowFlipHint(true);
      setTimeout(() => setShowFlipHint(false), 2000); // Hinweis verschwindet nach 2 Sekunden
    }
  };
  /**
   * Markiert die aktuelle Karte als richtig beantwortet und ruft das Callback auf.
   */
  const markCorrect = () => {
    if (currentCard && onEvaluate) {
      onEvaluate(currentCard.id, true);
    }
  };
  /**
   * Markiert die aktuelle Karte als falsch beantwortet und ruft das Callback auf.
   */
  const markWrong = () => {
    if (currentCard && onEvaluate) {
      onEvaluate(currentCard.id, false);
    }
  };
  /**
   * Dreht die Karte um (Frage <-> Antwort).
   */
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  /**
   * Wählt die nächste Karte aus dem Stapel aus (andere als die aktuelle, falls möglich) und setzt den Flip-Zustand zurück.
   * Ruft das onNextCard-Callback auf.
   */
  const handleNextCard = () => {
    if (cards.length > 1) {
      // Ziehe eine andere Karte als die aktuelle
      let nextCard: CardType | null = null;
      const otherCards = cards.filter(card => card.id !== currentCard?.id);
      if (otherCards.length > 0) {
        nextCard = otherCards[Math.floor(Math.random() * otherCards.length)];
      } else {
        nextCard = cards[Math.floor(Math.random() * cards.length)];
      }
      setCurrentCard(nextCard);
      setIsFlipped(false);
    } else if (cards.length === 1) {
      setCurrentCard(cards[0]);
      setIsFlipped(false);
    }
    if (onNextCard) onNextCard();
  };

  // Anzahl Karten in der aktuellen Box berechnen (für Anzeige im Template)
  const boxCardCount = cards.filter(card => (card.currentLearningLevel ?? 0) === currentLearningLevel).length;

  return (
    <LearningModeTemplate elapsedSeconds={elapsedSeconds} currentLearningLevel={currentLearningLevel} boxCount={boxCardCount}>
      <SC.Container>
        {onBack && (
          <SC.TopRow>
            <Button $variant="secondary" onClick={onBack}>
              Back
            </Button>
          </SC.TopRow>
        )}
        {currentCard ? (
          <SC.LearningContainer>
            <Card
              title={currentCard.title}
              question={currentCard.question}
              answer={currentCard.answer}
              tags={currentCard.tags ?? []}
              showEditButton={false}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
            <SC.ButtonRow>
              <SC.HintWrapper onMouseDown={handleHint} onMouseEnter={handleHint} tabIndex={-1}>
                <Button $variant="accept" onClick={markCorrect} disabled={!isFlipped}>
                  Correct
                </Button>
              </SC.HintWrapper>
              <SC.HintWrapper onMouseDown={handleHint} onMouseEnter={handleHint} tabIndex={-1}>
                <Button $variant="deny" onClick={markWrong} disabled={!isFlipped}>
                  Incorrect
                </Button>
              </SC.HintWrapper>
              <Button $variant="secondary" onClick={handleNextCard}>
                Next Card
              </Button>
            </SC.ButtonRow>
            <SC.HintArea>
              {showFlipHint && (
                <Text color="deny">Please flip the card first to evaluate it!</Text>
              )}
            </SC.HintArea>
          </SC.LearningContainer>
        ) : (
          <Headline size="md">No more flashcards in current box available.</Headline>
        )}
      </SC.Container>
    </LearningModeTemplate>
  );
};
export default LearningMode;