/**
 * AnalyticsMetric Atom
 *
 * A reusable component for displaying individual analytics metrics.
 * Follows atomic design principles for maximum reusability.
 *
 * Features:
 * - Theme-aware styling using styled-components
 * - Color-coded values for different metric types
 * - Consistent spacing and typography
 * - Responsive design
 *
 * Cross-references:
 * - src/components/organisms/AnalyticsDisplay: Main consumer
 * - src/components/atoms: Other atomic components
 */

import React from 'react';
import * as SC from './styles';

interface AnalyticsMetricProps {
  label: string;
  value: string | number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  testId?: string;
}

export const AnalyticsMetric: React.FC<AnalyticsMetricProps> = React.memo(({
  label,
  value,
  color = 'primary',
  testId
}) => (
  <SC.MetricContainer data-testid={testId}>
    <SC.MetricValue $color={color}>
      {value}
    </SC.MetricValue>
    <SC.MetricLabel>
      {label}
    </SC.MetricLabel>
  </SC.MetricContainer>
));

AnalyticsMetric.displayName = 'AnalyticsMetric';

export default AnalyticsMetric;
