/**
 * FolderSelection Component Styles
 * 
 * Styled components for the FolderSelection molecule component.
 * Provides consistent styling for folder selection interface.
 */

import styled from 'styled-components';

export const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  width: 100%;
  margin: 20px 0;
`;

export const FolderCard = styled.button<{ $isSelected: boolean }>`
  background-color: ${({ theme, $isSelected }) => 
    $isSelected ? `${theme.primary}15` : theme.surface
  };
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.primary : theme.border
  };
  border-radius: 12px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 120px;
  justify-content: center;

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
`;

export const FolderName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  word-break: break-word;
`;

export const FolderDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const LoadingState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
`;

export const InfoBox = styled.div`
  grid-column: 1 / -1;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  text-align: center;
`;
