/**
 * AnalyticsMetric Styled Components
 *
 * Styled components for the AnalyticsMetric atom component.
 * Provides consistent styling for individual analytics metric displays.
 *
 * Components:
 * - MetricContainer: Main wrapper with hover effects and spacing
 * - MetricIconWrapper: Icon container with proper spacing
 * - MetricLabel: Label text with secondary color
 * - MetricValue: Value display with color variations based on type
 *
 * Features:
 * - Theme-aware styling using styled-components theme
 * - Color variants: primary, success, warning, danger
 * - Hover effects for enhanced interactivity
 * - Responsive design principles
 */

import styled from 'styled-components';

export const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.primary}40;
  }
`;

export const MetricIconWrapper = styled.div`
  margin-bottom: 4px;
`;

export const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  line-height: 1.2;
`;

export const MetricValue = styled.div<{ $color: 'primary' | 'success' | 'warning' | 'danger' }>`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  line-height: 1;
  color: ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.accept;
      case 'danger': return theme.deny;
      case 'warning': return theme.secondary;
      case 'primary':
      default: return theme.primary;
    }
  }};
`;
