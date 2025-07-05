import styled from "styled-components";

/**
 * Styled Components für die LearningMode-Komponente (Organism).
 *
 * Diese Datei enthält alle Layout- und Style-Elemente, die im Lernmodus für die Anzeige und Interaktion mit einer Karte verwendet werden.
 *
 * Die Komponenten werden in index.tsx importiert und dort für das Layout genutzt.
 *
 * Übersicht der Styled Components:
 * - Container: Wrapper für die gesamte Lernmodus-Ansicht
 * - Title: Überschrift für den Kartentitel
 * - Question: Frage-Text auf der Karte
 * - Answer: Antwort-Text auf der Karte
 * - LearningContainer: Wrapper für Karte und Buttons
 * - ButtonContainer: (optional) Wrapper für Buttons unter der Karte
 * - TopRow: Zeile für den Zurück-Button
 * - ButtonRow: Zeile für Bewertungs- und Navigationsbuttons
 * - HintArea: Bereich für Flip-Hinweis
 * - HintWrapper: Wrapper für den Hinweistext
 *
 * Verwandte Dateien:
 * - ../LearningMode/index.tsx: Verwendet diese Styled Components
 * - ../LearningMode/types.ts: Typdefinitionen für Props und Karten
 */

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