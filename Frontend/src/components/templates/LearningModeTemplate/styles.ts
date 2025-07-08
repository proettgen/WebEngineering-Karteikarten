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

// Main content area
export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// Loading container
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

// Start section
export const StartSection = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

// Welcome text
export const WelcomeText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 32px;
`;

// Selection sections
export const SelectionSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

// Step title
export const StepTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
  text-align: center;
`;

// Step description
export const StepDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;
`;

// Button group
export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Box grid for learning level selection
export const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 32px 0;
`;

// Individual box card
export const BoxCard = styled.div<{ $isSelected: boolean }>`
  background: ${({ theme, $isSelected }) => 
    $isSelected ? theme.primary + '20' : theme.cardBackground || '#ffffff'};
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.primary : theme.border || '#e0e0e0'};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Box number
export const BoxNumber = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textPrimary};
  margin: 0 0 8px 0;
  font-weight: 600;
`;

// Box count
export const BoxCount = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
  margin: 0 0 8px 0;
  font-weight: 700;
`;

// Box description
export const BoxDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

// Learning section
export const LearningSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;