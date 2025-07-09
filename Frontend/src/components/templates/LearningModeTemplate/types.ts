import type { ReactNode } from "react";

/**
 * LearningModeTemplate Type Definitions
 *
 * This file contains the central types for the learning mode layout template.
 *
 * Type Overview:
 * - LearningModeTemplateProps: Props for the template component
 *
 * Cross-References:
 * - ./index.tsx: Uses these types for props
 * - ./styles.ts: Styled components for layout
 */

// Props for the LearningModeTemplate component
export type LearningModeTemplateProps = {
  children: ReactNode; // The actual content to be displayed in the template
  elapsedSeconds?: number; // Optional: Time for timer display
  currentLearningLevel?: number; // Optional: Learning level/box stage for display
  boxCount?: number; // Optional: Number of cards in the current box
};
