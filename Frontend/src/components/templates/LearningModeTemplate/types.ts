import type { ReactNode } from "react";

// Typen für das LearningModeTemplate
export type LearningModeTemplateProps = {
  children: ReactNode;
  elapsedSeconds?: number; // optional für Rückwärtskompatibilität
  boxLevel?: number; // optional für Box-Anzeige
};
