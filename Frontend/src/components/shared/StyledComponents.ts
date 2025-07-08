/**
 * Shared Styled Components
 * 
 * Common UI patterns and components used across Learning Mode, Card Management, and other features.
 * Extracted to eliminate code duplication and ensure consistency across the app.
 * 
 * Features:
 * - Reusable button styles matching existing Card/Folder patterns
 * - Common layout components
 * - Consistent spacing and theming
 * - Accessible component patterns
 */

import styled, { css } from 'styled-components';

/**
 * Common button styles used in Card, Folder, Learning Mode, etc.
 * Replaces duplicated button styling across components.
 */
export const CommonButton = styled.button<{ 
  $variant?: 'primary' | 'secondary' | 'accept' | 'deny';
  $size?: 'small' | 'medium' | 'large';
}>`
  background-color: ${({ theme, $variant = 'primary' }) => {
    switch ($variant) {
      case 'accept': return theme.accept;
      case 'deny': return theme.deny;
      case 'secondary': return 'transparent';
      default: return theme.primary;
    }
  }};
  border: ${({ theme, $variant = 'primary' }) => 
    $variant === 'secondary' ? `1px solid ${theme.border}` : 'none'
  };
  color: ${({ theme, $variant = 'primary' }) => 
    $variant === 'secondary' ? theme.textPrimary : theme.onPrimary
  };
  padding: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '6px 12px';
      case 'large': return '12px 24px';
      default: return '8px 16px';
    }
  }};
  border-radius: ${({ $size = 'medium' }) => 
    $size === 'small' ? '4px' : '6px'
  };
  cursor: pointer;
  font-size: ${({ theme, $size = 'medium' }) => {
    switch ($size) {
      case 'small': return theme.fontSizes.small;
      case 'large': return theme.fontSizes.large;
      default: return theme.fontSizes.medium;
    }
  }};
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
  }
`;

/**
 * Circular icon button used in Cards, Folders, Learning Mode, etc.
 * Replaces duplicated icon button styling.
 */
export const CircularIconButton = styled.button<{ 
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'primary' | 'secondary';
}>`
  background-color: ${({ $variant = 'secondary' }) => 
    $variant === 'primary' ? 'currentColor' : 'transparent'
  };
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
  width: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '32px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  height: ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small': return '32px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.textSecondary};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
  }

  svg {
    width: ${({ $size = 'medium' }) => {
      switch ($size) {
        case 'small': return '16px';
        case 'large': return '24px';
        default: return '20px';
      }
    }};
    height: ${({ $size = 'medium' }) => {
      switch ($size) {
        case 'small': return '16px';
        case 'large': return '24px';
        default: return '20px';
      }
    }};
    fill: currentColor;
    pointer-events: none;
  }
`;

/**
 * Card-like container used for selections, displays, etc.
 * Matches the Card component styling for consistency.
 */
export const CardContainer = styled.div<{ 
  $isSelectable?: boolean;
  $isSelected?: boolean;
  $disabled?: boolean;
}>`
  background-color: ${({ theme, $isSelected }) => 
    $isSelected ? `${theme.primary}15` : theme.surface
  };
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.primary : theme.border
  };
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  cursor: ${({ $isSelectable, $disabled }) => {
    if ($disabled) return 'not-allowed';
    if ($isSelectable) return 'pointer';
    return 'default';
  }};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};

  ${({ $isSelectable, $disabled }) => $isSelectable && !$disabled && css`
    &:hover {
      border-color: ${({ theme }) => theme.primary};
      background-color: ${({ theme }) => `${theme.primary}10`};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
    }
  `}
`;

/**
 * Common grid layout for selections, card lists, etc.
 */
export const ResponsiveGrid = styled.div<{ 
  $minWidth?: string;
  $gap?: string;
}>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${({ $minWidth = '250px' }) => $minWidth}, 1fr));
  gap: ${({ $gap = '16px' }) => $gap};
  width: 100%;
`;

/**
 * Loading overlay for async operations
 */
export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/**
 * Empty state container
 */
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.background};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  gap: 16px;
`;

/**
 * Section spacing for consistent layouts
 */
export const Section = styled.div<{ $spacing?: 'small' | 'medium' | 'large' }>`
  margin-bottom: ${({ $spacing = 'medium' }) => {
    switch ($spacing) {
      case 'small': return '16px';
      case 'large': return '40px';
      default: return '24px';
    }
  }};
`;

/**
 * Button group for action layouts
 */
export const ButtonGroup = styled.div<{ 
  $direction?: 'row' | 'column';
  $gap?: string;
  $justify?: 'start' | 'center' | 'end' | 'space-between';
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  gap: ${({ $gap = '12px' }) => $gap};
  justify-content: ${({ $justify = 'start' }) => $justify};
  align-items: center;
  flex-wrap: wrap;
`;
