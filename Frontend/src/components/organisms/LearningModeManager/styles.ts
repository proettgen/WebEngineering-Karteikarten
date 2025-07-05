import styled from "styled-components";

/**
 * Styled Components für die LearningModeManager-Komponente (Organism).
 *
 * Diese Datei enthält Styles für die Anzeige des Abschlussbildschirms und die Anordnung der Buttons im Lernmodus-Manager.
 *
 * Übersicht der Styled Components:
 * - CongratsWrapper: Wrapper für die Glückwunsch-/Abschlussanzeige nach Abschluss des Lernens
 * - ButtonRow: Zeile für Buttons (z.B. Neustart, Zurück)
 *
 * Verwandte Dateien:
 * - ../LearningModeManager/index.tsx: Verwendet diese Styled Components
 * - ../LearningModeManager/types.ts: Typdefinitionen für Props und State
 */

// Wrapper für die Glückwunsch-Anzeige nach Abschluss des Lernens
export const CongratsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 24px;
`;

// Zeile für Buttons (z.B. Neustart, Zurück)
export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
`;
