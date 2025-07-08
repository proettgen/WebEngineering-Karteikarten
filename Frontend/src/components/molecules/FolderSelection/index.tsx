/**
 * FolderSelection Molecule Component
 * 
 * A reusable component for selecting folders in a grid layout.
 * Extracted from LearningModeTemplate for better reusability and atomic design compliance.
 * Consistent with BoxSelection and Card components styling.
 * 
 * Features:
 * - Grid layout for folder selection
 * - Consistent selection UI across the app
 * - Loading and empty states
 * - Accessible with proper keyboard navigation
 * - Theme-aware styling
 */

import React from 'react';
import styled from 'styled-components';
import Text from '../../atoms/Text';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import { Folder } from '@/database/folderTypes';

interface FolderSelectionProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelect: (_folder: Folder) => void;
  loading?: boolean;
  testId?: string;
}

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  width: 100%;
  margin: 20px 0;
`;

const FolderCard = styled.button<{ $isSelected: boolean }>`
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

const FolderName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  word-break: break-word;
`;

const FolderDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
`;

export const FolderSelection: React.FC<FolderSelectionProps> = ({
  folders,
  selectedFolderId,
  onSelect,
  loading = false,
  testId
}) => {
  if (loading) {
    return (
      <SelectionGrid data-testid={testId}>
        <LoadingState>
          <LoadingSpinner 
            size="medium" 
            text="Loading folders..." 
          />
        </LoadingState>
      </SelectionGrid>
    );
  }

  if (folders.length === 0) {
    return (
      <SelectionGrid data-testid={testId}>
        <EmptyState>
          <Text size="large" weight="bold" color="textSecondary">
            No folders available
          </Text>
          <Text size="medium" color="textSecondary">
            Create some folders with flashcards first to start learning.
          </Text>
        </EmptyState>
      </SelectionGrid>
    );
  }

  return (
    <SelectionGrid data-testid={testId}>
      {folders.map((folder) => {
        const isSelected = selectedFolderId === folder.id;

        return (
          <FolderCard
            key={folder.id}
            $isSelected={isSelected}
            onClick={() => onSelect(folder)}
            aria-pressed={isSelected}
            aria-describedby={`folder-${folder.id}-description`}
          >
            <FolderName>{folder.name}</FolderName>
            <FolderDescription id={`folder-${folder.id}-description`}>
              Click to select this folder
            </FolderDescription>
          </FolderCard>
        );
      })}
    </SelectionGrid>
  );
};

export default FolderSelection;
