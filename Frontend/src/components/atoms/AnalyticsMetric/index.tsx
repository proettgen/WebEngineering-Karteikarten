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
import Icon from '../Icon';
import * as SC from './styles';

interface AnalyticsMetricProps {
  label: string;
  value: string | number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  testId?: string;
}

// Icon definitions for different metrics
const getMetricIcon = (label: string): React.ReactNode => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes('time')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
      </svg>
    );
  }
  
  if (lowerLabel.includes('cards learned') || lowerLabel.includes('cards')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="M480-80q-33 0-56.5-23.5T400-160v-480L168-492q-27 18-57.5 5T80-531v-309q0-33 23.5-56.5T160-920h640q33 0 56.5 23.5T880-840v309q0 31-30.5 44T792-492L560-640v480q0 33-23.5 56.5T480-80Z" />
      </svg>
    );
  }
  
  if (lowerLabel.includes('correct')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>
    );
  }
  
  if (lowerLabel.includes('wrong') || lowerLabel.includes('incorrect')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    );
  }
  
  if (lowerLabel.includes('reset')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
      </svg>
    );
  }
  
  if (lowerLabel.includes('success') || lowerLabel.includes('rate')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
      </svg>
    );
  }
  
  // Default icon for unknown metrics
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
      <path d="M280-280h80v-200h-80v200Zm160 0h80v-400h-80v400Zm160 0h80v-120h-80v120ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
    </svg>
  );
};

export const AnalyticsMetric: React.FC<AnalyticsMetricProps> = React.memo(({
  label,
  value,
  color = 'primary',
  icon,
  testId
}) => (
  <SC.MetricContainer data-testid={testId}>
    <SC.MetricIconWrapper>
      <Icon size="m" color="textPrimary">
        {icon || getMetricIcon(label)}
      </Icon>
    </SC.MetricIconWrapper>
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
