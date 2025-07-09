import type { CreateAnalyticsInput } from '../../../database/analyticsTypes';

export interface AnalyticsFormProps {
  form: CreateAnalyticsInput;
  onFieldChange: (_field: keyof CreateAnalyticsInput, _value: number) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  testId?: string;
}
