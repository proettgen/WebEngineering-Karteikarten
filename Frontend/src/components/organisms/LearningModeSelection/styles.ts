import styled from "styled-components";

/**
 * Styled Components für die LearningModeSelection-Komponente (Organism).
 *
 * Diese Datei enthält Styles für die Auswahl- und Navigationsansicht im Lernmodus.
 *
 * Übersicht der Styled Components:
 * - CenteredColumn: Zentrierte Spalte für Auswahl und Navigation
 * - BoxButtonRow: Zeile für die Auswahl der Boxen
 *
 * Verwandte Dateien:
 * - ../LearningModeSelection/index.tsx: Verwendet diese Styled Components
 * - ../LearningModeSelection/types.ts: Typdefinitionen für Props und State
 */

// Zentrierte Spalte für Auswahl und Navigation im Lernmodus
export const CenteredColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  margin-top: 64px;
`;

// Zeile für Box-Auswahl-Buttons
export const BoxButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
`;
