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

// Atoms
import LoadingSpinner from '../../atoms/LoadingSpinner';
import Text from '../../atoms/Text';
import Icon from '../../atoms/Icon';

// Types
import type { FolderSelectionProps } from './types';

// Styles
import {
  SelectionGrid,
  FolderCard,
  FolderName,
  FolderDescription,
  EmptyState,
  LoadingState,
  InfoBox
} from './styles';

export const FolderSelection: React.FC<FolderSelectionProps> = React.memo(({
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size="s" color="textSecondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
          </Icon>
          <Text size="small" color="textSecondary">
            Only folders with flashcards are shown here for learning.
          </Text>
        </div>
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
});

FolderSelection.displayName = 'FolderSelection';

export default FolderSelection;
