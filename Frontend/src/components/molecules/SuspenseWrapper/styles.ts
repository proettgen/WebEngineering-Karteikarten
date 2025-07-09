/**
 * SuspenseWrapper Component Styles
 * 
 * Styled components for the SuspenseWrapper molecule component.
 * Provides consistent styling for loading states wrapped in Suspense.
 */

import styled from 'styled-components';

export const SuspenseContainer = styled.div<{ $minHeight?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${({ $minHeight }) => $minHeight || '200px'};
  width: 100%;
  background-color: ${({ theme }) => theme.background};
`;
