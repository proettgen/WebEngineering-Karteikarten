import styled from "styled-components";

/**
 * Styled Components für das LearningModeTemplate (Template-Komponente).
 *
 * Diese Datei enthält Styles für das Layout des Lernmodus-Templates, insbesondere für Header, Timer und Box-Anzeige.
 *
 * Übersicht der Styled Components:
 * - Container: Wrapper für die gesamte Seite im Lernmodus
 * - Header: Kopfzeile mit Titel, Timer und Box-Anzeige
 * - Title: Titel-Überschrift (optional)
 * - Timer: Timer-Anzeige
 * - TimerRow: Zeile für Timer und Icon
 * - BoxLevel: Anzeige der aktuellen Box-Stufe
 *
 * Verwandte Dateien:
 * - ./index.tsx: Verwendet diese Styled Components
 * - ./types.ts: Typdefinitionen für Props
 */

// Container für die gesamte Seite im Lernmodus
export const Container = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
  padding: 24px;
`;

// Kopfzeile mit Titel, Timer und Box-Anzeige
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 12px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border || '#e0e0e0'};
  background: transparent;
`;

// Titel-Überschrift (optional, kann für eigene Titel genutzt werden)
export const Title = styled.h1`
  margin: 0 0 0 16px;
`;

// Timer-Anzeige
export const Timer = styled.span`
  font-size: 1.2rem;
  margin-right: 32px;
  color: ${({ theme }) => theme.primary};
  font-variant-numeric: tabular-nums;
`;

// Zeile für Timer und Icon
export const TimerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Anzeige der aktuellen Box-Stufe
export const BoxLevel = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.primary};
  margin: 0 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;