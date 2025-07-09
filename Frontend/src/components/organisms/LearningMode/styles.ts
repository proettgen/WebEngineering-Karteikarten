import styled from "styled-components";

/**
 * LearningMode Styled Components
 *
 * This file contains all layout and styling elements used in learning mode
 * for displaying and interacting with cards.
 *
 * These components are imported in index.tsx and used for layout.
 *
 * Styled Components Overview:
 * - Container: Wrapper for the entire learning mode view
 * - Title: Heading for card title
 * - Question: Question text on the card
 * - Answer: Answer text on the card
 * - LearningContainer: Wrapper for card and buttons
 * - ButtonContainer: (optional) Wrapper for buttons below the card
 * - TopRow: Row for the back button
 * - ButtonRow: Row for evaluation and navigation buttons
 * - HintArea: Area for flip hint
 * - HintWrapper: Wrapper for hint text
 *
 * Related Files:
 * - ../LearningMode/index.tsx: Uses these styled components
 * - ../LearningMode/types.ts: Type definitions for props and cards
 */

// Container for the entire learning mode view
export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 100px);
`;

// Überschrift für den Kartentitel
export const Title = styled.h1`
  margin-bottom: 10px;
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
`;

// Frage-Text
export const Question = styled.h2`
  margin-bottom: 20px;
`;

// Antwort-Text
export const Answer = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

// Container für die eigentliche Karte und Buttons
export const LearningContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

// Container für Buttons unter der Karte (optional, aktuell nicht genutzt)
export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

// Zeile für den Zurück-Button
export const TopRow = styled.div`
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

// Zeile für Bewertungs- und Navigationsbuttons
export const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
  
  /* Ensure all buttons have consistent sizing */
  > button {
    min-width: 120px;
    height: 44px;
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

// Wrapper für den Hinweistext oder Icons
export const HintWrapper = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.deny};
  font-size: 1rem;
  margin-top: 4px;
`;

// Bereich für Flip-Hinweis unter der Karte
export const HintArea = styled.div`
  min-height: 24px;
  margin-top: 8px;
`;

// Container für den Evaluating-Status
export const EvaluatingContainer = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

// Wrapper für das Complete-Icon
export const CompleteIconWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;