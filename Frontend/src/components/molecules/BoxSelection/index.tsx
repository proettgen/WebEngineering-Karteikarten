/**
 * BoxSelection Molecule Component
 * 
 * A reusable component for selecting learning boxes/levels.
 * Extracted from LearningModeTemplate for better reusability and atomic design compliance.
 * 
 * Features:
 * - Displays multiple selectable boxes with counts
 * - Consistent selection UI across the app
 * - Accessible with proper keyboard navigation
 * - Theme-aware styling matching Card components
 */

import React from 'react';
import styled from 'styled-components';
import Text from '../../atoms/Text';

interface BoxCount {
  level: number;
  count: number;
}

interface BoxSelectionProps {
  boxes: BoxCount[];
  selectedLevel: number | null;
  onSelect: (_level: number) => void;
  loading?: boolean;
  testId?: string;
}

const BoxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  margin: 20px 0;
`;

const BoxCard = styled.button<{ $isSelected: boolean; $disabled: boolean }>`
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

const BoxNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
`;

const BoxCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

const BoxDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

const getBoxDescription = (level: number): string => {
  switch (level) {
    case 0: return "New cards";
    case 1: return "Learning cards";
    case 2: return "Review cards";
    case 3: return "Mastered cards";
    default: return `Level ${level + 1} cards`;
  }
};

export const BoxSelection: React.FC<BoxSelectionProps> = ({
  boxes,
  selectedLevel,
  onSelect,
  loading = false,
  testId
}) => {
  if (boxes.length === 0) {
    return (
      <BoxGrid data-testid={testId}>
        <EmptyState>
          <Text size="medium" color="textSecondary">
            No learning boxes available for this folder.
          </Text>
        </EmptyState>
      </BoxGrid>
    );
  }

  return (
    <BoxGrid data-testid={testId}>
      {boxes.map(({ level, count }) => {
        const isSelected = selectedLevel === level;
        const isDisabled = loading || count === 0;

        return (
          <BoxCard
            key={level}
            $isSelected={isSelected}
            $disabled={isDisabled}
            onClick={() => !isDisabled && onSelect(level)}
            disabled={isDisabled}
            aria-pressed={isSelected}
            aria-describedby={`box-${level}-description`}
          >
            <BoxNumber>Box {level + 1}</BoxNumber>
            <BoxCount>{count} cards</BoxCount>
            <BoxDescription id={`box-${level}-description`}>
              {getBoxDescription(level)}
            </BoxDescription>
          </BoxCard>
        );
      })}
    </BoxGrid>
  );
};

export default BoxSelection;
