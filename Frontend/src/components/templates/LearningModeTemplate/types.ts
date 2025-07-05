import type { ReactNode } from "react";

/**
 * Typdefinitionen für das LearningModeTemplate (Template-Komponente).
 *
 * Diese Datei enthält die zentralen Typen für das Layout-Template des Lernmodus.
 *
 * Übersicht der Typen:
 * - LearningModeTemplateProps: Props für das Template (siehe ./index.tsx)
 *
 * Cross-Referenzen:
 * - ./index.tsx: Verwendet diese Typen für Props
 * - ./styles.ts: Styled Components für das Layout
 */

// Props für das LearningModeTemplate
export type LearningModeTemplateProps = {
  children: ReactNode; // Die eigentlichen Inhalte, die im Template angezeigt werden
  elapsedSeconds?: number; // Optional: Zeit für Timer-Anzeige
  boxLevel?: number; // Optional: Box-Stufe für Anzeige
  boxCount?: number; // Optional: Anzahl Karten in der aktuellen Box
};
