/**
 * BoxSelection Component Styles
 * 
 * Styled components for the BoxSelection molecule component.
 * Provides consistent styling for box selection interface and mastered cards display.
 */

import styled from 'styled-components';

// Container für Folder-Informationen - kompakter und weniger auffällig
export const FolderInfoContainer = styled.div`
  background: ${({ theme }) => `${theme.primary}05`};
  border: 1px solid ${({ theme }) => `${theme.primary}15`};
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
`;

export const FolderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => `${theme.primary}15`};
  border-radius: 4px;
  color: ${({ theme }) => theme.primary};
  flex-shrink: 0;
`;

export const FolderDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FolderName = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  margin: 0;
`;

export const FolderStats = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
`;

export const FolderStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
`;

export const BoxCard = styled.button<{ $isSelected: boolean; $disabled: boolean }>`
  background-color: ${({ theme, $isSelected }) => 
    $isSelected ? `${theme.primary}15` : theme.surface
  };
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.primary : theme.border
  };
  border-radius: 12px;
  padding: 20px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
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

  &:disabled {
    cursor: not-allowed;
  }
`;

export const BoxNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
`;

export const BoxIconWrapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
`;

export const BoxCountText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

export const BoxDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

export const MasteredCardsDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px 24px;
  background-color: ${({ theme }) => `${theme.success}15`};
  border: 2px solid ${({ theme }) => `${theme.success}30`};
  border-radius: 12px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

export const MasteredIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MasteredText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
`;

export const MasteredCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  color: ${({ theme }) => theme.success};
`;

export const MasteredLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
`;
