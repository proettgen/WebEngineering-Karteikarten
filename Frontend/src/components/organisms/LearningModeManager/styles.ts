import styled from "styled-components";

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
