/**
 * Timer Component Styles
 * 
 * Styled components for the Timer atom component.
 * Provides consistent styling and theming for time display elements.
 */

import styled from 'styled-components';

export const TimerContainer = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  gap: ${({ $size }) => {
    switch ($size) {
      case 'small': return '4px';
      case 'medium': return '6px';
      case 'large': return '8px';
    }
  }};
  color: ${({ theme }) => theme.textSecondary};
  font-size: ${({ theme, $size }) => {
    switch ($size) {
      case 'small': return theme.fontSizes.small;
      case 'medium': return theme.fontSizes.medium;
      case 'large': return theme.fontSizes.large;
    }
  }};
  font-weight: 500;
  font-variant-numeric: tabular-nums; /* Ensures consistent spacing for numbers */
`;

export const TimeDisplay = styled.span`
  font-family: 'Courier New', Courier, monospace; /* Monospace for consistent number alignment */
`;
