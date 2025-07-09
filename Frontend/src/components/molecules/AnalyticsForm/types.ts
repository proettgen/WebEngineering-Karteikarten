/**
 * AnalyticsForm Type Definitions
 *
 * This file contains type definitions for the AnalyticsForm component.
 *
 * Type Overview:
 * - AnalyticsFormProps: Props for the AnalyticsForm component
 *
 * Cross-References:
 * - ./index.tsx: Uses these types for props
 * - ../../../database/analyticsTypes.ts: Analytics data types
 */

import type { CreateAnalyticsInput } from '../../../database/analyticsTypes';

// Props for the AnalyticsForm component
export interface AnalyticsFormProps {
  form: CreateAnalyticsInput; // Form data for analytics
  onFieldChange: (_field: keyof CreateAnalyticsInput, _value: number) => void; // Callback for field changes
  onSave: () => void; // Callback for save action
  onCancel: () => void; // Callback for cancel action
  loading?: boolean; // Loading state
  testId?: string; // Test ID for testing
}
