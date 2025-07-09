import type { Analytics } from '../../../database/analyticsTypes';

export interface AnalyticsDisplayProps {
  analytics: Analytics | null;
  onEdit?: (_analytics: Analytics) => void;
  isEditing?: boolean;
  testId?: string;
}
