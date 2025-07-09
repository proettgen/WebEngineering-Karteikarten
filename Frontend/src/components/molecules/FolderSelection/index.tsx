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
import Text from '../../atoms/Text';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import type { FolderSelectionProps } from './types';
import {
  SelectionGrid,
  FolderCard,
  FolderName,
  FolderDescription,
  EmptyState,
  LoadingState,
  InfoBox
} from './styles';

export const FolderSelection: React.FC<FolderSelectionProps> = ({
  folders,
  selectedFolderId,
  onSelect,
  loading = false,
  testId
}) => {
  // Filter folders to only show those with cards
  const foldersWithCards = folders.filter(folder => 
    folder.cardCount === undefined || folder.cardCount > 0
  );

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
            Ready to Start Learning?
          </Text>
          <Text size="medium" color="textSecondary">
            Create some folders with flashcards first, then return here to begin your learning journey!
          </Text>
        </EmptyState>
      </SelectionGrid>
    );
  }

  if (foldersWithCards.length === 0) {
    return (
      <SelectionGrid data-testid={testId}>
        <EmptyState>
          <Text size="large" weight="bold" color="textSecondary">
            No Folders Ready for Learning
          </Text>
          <Text size="medium" color="textSecondary">
            Only folders containing flashcards can be used for learning. Please add some cards to your folders first!
          </Text>
        </EmptyState>
        <InfoBox>
          <Text size="small" color="textSecondary">
            Tip: Go to &quot;Cards&quot; to add flashcards to your existing folders, then return here to start learning.
          </Text>
        </InfoBox>
      </SelectionGrid>
    );
  }

  return (
    <SelectionGrid data-testid={testId}>
      <InfoBox>
        <Text size="small" color="textSecondary">
          Only folders with flashcards are shown here for learning.
        </Text>
      </InfoBox>
      {foldersWithCards.map((folder) => {
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
