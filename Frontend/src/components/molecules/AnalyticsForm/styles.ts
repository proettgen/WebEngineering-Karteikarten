/**
 * AnalyticsForm Styled Components
 *
 * Styled components for the AnalyticsForm molecule component.
 * Provides consistent form styling for analytics data input and editing.
 *
 * Components:
 * - FormContainer: Main form wrapper with surface styling
 * - FormTitle: Section title with proper typography
 * - FormGrid: Responsive grid layout for form fields
 * - FormField: Individual field container with column layout
 * - Label: Form field labels with consistent styling
 * - Input: Form input elements with focus states
 * - ButtonRow: Action button container with proper spacing
 *
 * Features:
 * - Theme-aware styling for consistency
 * - Responsive grid layout adapts to screen size
 * - Focus states for accessibility
 * - Proper spacing and visual hierarchy
 */

import styled from 'styled-components';

export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const FormTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0 0 16px 0;
  font-weight: 600;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;
