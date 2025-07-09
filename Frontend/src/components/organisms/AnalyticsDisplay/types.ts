/**
 * AnalyticsDisplay Type Definitions
 *
 * TypeScript interface definitions for the AnalyticsDisplay organism component.
 * Defines props structure for analytics data visualization and interaction.
 *
 * Interface Overview:
 * - AnalyticsDisplayProps: Main props interface for the component
 *
 * Props Details:
 * - analytics: Analytics data object or null for loading/empty states
 * - onEdit: Optional callback function for editing analytics data
 * - isEditing: Optional boolean flag indicating edit mode state
 * - testId: Optional test identifier for automated testing
 *
 * Cross-references:
 * - ../../../database/analyticsTypes.ts: Analytics data type definitions
 * - ./index.tsx: Component implementation using these types
 * - ./styles.ts: Styled components for visual presentation
 */

import type { Analytics } from '../../../database/analyticsTypes';

export interface AnalyticsDisplayProps {
  analytics: Analytics | null;
  onEdit?: (_analytics: Analytics) => void;
  isEditing?: boolean;
  testId?: string;
}
