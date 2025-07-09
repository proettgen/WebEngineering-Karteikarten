import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import Headline from "@/components/atoms/Headline";
import Text from "@/components/atoms/Text";
import Icon from "@/components/atoms/Icon";
import { EmptyStateContainer } from "@/components/shared/StyledComponents";
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
const LearningMode = ({ elapsedSeconds: _elapsedSeconds, cards, onEvaluate, onNextCard, onBack, currentLearningLevel: _currentLearningLevel }: LearningModeProps) => {
  // State für die aktuell angezeigte Karte (wird zufällig aus dem Stapel gewählt)
  const [currentCard, setCurrentCard] = useState<CardType | null>(
    cards.length > 0 ? cards[Math.floor(Math.random() * cards.length)] : null
  );
  // State, ob die Karte umgedreht (Antwort sichtbar) ist
  const [isFlipped, setIsFlipped] = useState(false);
  // State, ob der Flip-Hinweis angezeigt werden soll
  const [showFlipHint, setShowFlipHint] = useState(false);
  // State um das Flicker-Problem zu lösen - verhindert Rendering der alten Karte
  const [isEvaluating, setIsEvaluating] = useState(false);
  /**
   * Effekt: Wenn sich der Kartenstapel ändert, wähle eine neue zufällige Karte und setze den Flip-Zustand zurück.
   * Wenn keine Karten mehr vorhanden sind, setze currentCard auf null.
   */
  useEffect(() => {
    setIsEvaluating(false); // Reset evaluation state
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
      // Setze evaluation state um smooth transition zu ermöglichen
      setIsEvaluating(true);
      setIsFlipped(false);
      onEvaluate(currentCard.id, true);
    }
  };
  /**
   * Markiert die aktuelle Karte als falsch beantwortet und ruft das Callback auf.
   */
  const markWrong = () => {
    if (currentCard && onEvaluate) {
      // Setze evaluation state um smooth transition zu ermöglichen
      setIsEvaluating(true);
      setIsFlipped(false);
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

  return (
    <SC.Container>
      {onBack && (
        <SC.TopRow>
          <Button $variant="secondary" onClick={onBack}>
            Back
          </Button>
        </SC.TopRow>
      )}
        {currentCard && !isEvaluating ? (
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
                  <Icon size="s" color="textPrimary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                  </Icon>
                  I Got It Right
                </Button>
              </SC.HintWrapper>
              <SC.HintWrapper onMouseDown={handleHint} onMouseEnter={handleHint} tabIndex={-1}>
                <Button $variant="deny" onClick={markWrong} disabled={!isFlipped}>
                  <Icon size="s" color="textPrimary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </Icon>
                  I Got It Wrong
                </Button>
              </SC.HintWrapper>
              <SC.HintWrapper>
                <Button $variant="secondary" onClick={handleNextCard}>
                  <Icon size="s" color="textPrimary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                    </svg>
                  </Icon>
                  Next Card
                </Button>
              </SC.HintWrapper>
            </SC.ButtonRow>
            <SC.HintArea>
              {showFlipHint && (
                <Text color="deny">Please flip the card first to see the answer before evaluating!</Text>
              )}
            </SC.HintArea>            </SC.LearningContainer>
        ) : !isEvaluating ? (
          <EmptyStateContainer>
            <SC.CompleteIconWrapper>
              <Icon size="xl" color="textPrimary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  aria-label="Box Complete"
                >
                  <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40 97L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l320-186q19-11 40-11t40 11l320 186q19 11 29.5 29t10.5 40v318q0 22-10.5 40T880-252L560-86q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z" />
                </svg>
              </Icon>
            </SC.CompleteIconWrapper>
            <Headline size="lg">Congratulations!</Headline>
            <Text size="large">
              You&apos;ve successfully completed all cards in this learning box!
            </Text>
            <Text size="medium" color="textSecondary">
              Great progress! Use the &quot;Back&quot; button to choose another box or return to folder selection to continue your learning journey.
            </Text>
          </EmptyStateContainer>
        ) : (
          <SC.EvaluatingContainer>
            <Headline size="md">Evaluating...</Headline>
          </SC.EvaluatingContainer>
        )}
    </SC.Container>
  );
};
export default LearningMode;