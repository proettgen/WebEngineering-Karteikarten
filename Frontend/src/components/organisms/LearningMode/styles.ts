import styled from "styled-components";

// Container für die gesamte Lernmodus-Ansicht
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

// Container für Buttons unter der Karte
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
`;

// Wrapper für Flip-Hinweis oder Icons
export const HintWrapper = styled.span`
  display: inline-block;
`;

// Bereich für Flip-Hinweis unter der Karte
export const HintArea = styled.div`
  min-height: 24px;
  margin-top: 8px;
`;