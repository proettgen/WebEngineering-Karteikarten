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

// Atoms
import Icon from '../../atoms/Icon';
import Text from '../../atoms/Text';

// Types
import type { BoxSelectionProps } from './types';

// Styles
import {
  BoxGrid,
  BoxCard,
  BoxNumber,
  BoxIconWrapper,
  BoxCountText,
  BoxDescription,
  EmptyState,
  MasteredCardsDisplay,
  MasteredIconWrapper,
  MasteredText,
  MasteredCount,
  MasteredLabel
} from './styles';

const getBoxDescription = (level: number): string => {
  switch (level) {
    case 0: return "Fresh cards ready to learn";
    case 1: return "Recently practiced cards";
    case 2: return "Cards needing review";
    case 3: return "Well-learned cards";
    default: return `Level ${level + 1} cards`;
  }
};

const getBoxIcon = (level: number): React.ReactNode => {
  switch (level) {
    case 0: 
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40 97L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l320-186q19-11 40-11t40 11l320 186q19 11 29.5 29t10.5 40v318q0 22-10.5 40T880-252L560-86q-19 11-40 11t-40-11Z" />
        </svg>
      );
    case 1:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-43-61v-82q-35 0-59-26t-24-61v-44L149-459q-5 20-7 39.5t-2 39.5q0 118 81 200.5T437-141Zm294-108q22-24 38.5-51t28-56.5q11.5-29.5 17-60.5t5.5-63q0-106-58-192.5T607-799v18q0 35-24 61t-59 26h-87v87q0 17-11.5 28.5T397-567h-43v87h130q17 0 28.5 11.5T524-440v127h43q29 0 51 17t29 44Z" />
        </svg>
      );
    case 2:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
        </svg>
      );
    case 3:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
        </svg>
      );
  }
};

/**
 * BoxSelection Component
 * 
 * Displays a grid of learning boxes (0-4) with card counts and selection functionality.
 * Each box represents a different difficulty/mastery level.
 * 
 * @param boxes - Array of box counts for each learning level
 * @param selectedLevel - Currently selected learning level (if any)
 * @param onSelect - Callback when a box is selected
 * @param masteredCount - Number of mastered cards (Box 5, not displayed)
 * @param loading - Loading state for the component
 * @param testId - Test ID for testing purposes
 */
export const BoxSelection: React.FC<BoxSelectionProps> = React.memo(({
  boxes,
  selectedLevel,
  onSelect,
  masteredCount = 0,
  loading = false,
  testId
}) => {
  if (boxes.length === 0) {
    return (
      <div>
        <BoxGrid data-testid={testId}>
          <EmptyState>
            <Text size="medium" color="textSecondary">
              No learning boxes available for this folder.
            </Text>
          </EmptyState>
        </BoxGrid>
        {masteredCount > 0 && (
          <MasteredCardsDisplay>
            <MasteredIconWrapper>
              <Icon size="l" color="primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              </Icon>
            </MasteredIconWrapper>
            <MasteredText>
              <MasteredCount>{masteredCount} cards</MasteredCount>
              <MasteredLabel>Already mastered</MasteredLabel>
            </MasteredText>
          </MasteredCardsDisplay>
        )}
      </div>
    );
  }

  return (
    <div>
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
              <BoxIconWrapper>
                <Icon size="m" color="textPrimary">
                  {getBoxIcon(level)}
                </Icon>
              </BoxIconWrapper>
              <BoxCountText>{count} cards</BoxCountText>
              <BoxDescription id={`box-${level}-description`}>
                {getBoxDescription(level)}
              </BoxDescription>
            </BoxCard>
          );
        })}
      </BoxGrid>
      {masteredCount > 0 && (
        <MasteredCardsDisplay>
          <MasteredIconWrapper>
            <Icon size="l" color="primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
              </svg>
            </Icon>
          </MasteredIconWrapper>
          <MasteredText>
            <MasteredCount>{masteredCount} cards</MasteredCount>
            <MasteredLabel>Already mastered</MasteredLabel>
          </MasteredText>
        </MasteredCardsDisplay>
      )}
    </div>
  );
});

BoxSelection.displayName = 'BoxSelection';

export default BoxSelection;
