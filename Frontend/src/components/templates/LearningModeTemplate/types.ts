import type { ReactNode } from "react";

// Typen für das LearningModeTemplate
export type LearningModeTemplateProps = {
  children: ReactNode; // Die eigentlichen Inhalte, die im Template angezeigt werden
  elapsedSeconds?: number; // Optional: Zeit für Timer-Anzeige
  boxLevel?: number; // Optional: Box-Stufe für Anzeige
  boxCount?: number; // Optional: Anzahl Karten in der aktuellen Box
};
