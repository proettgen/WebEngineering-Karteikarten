/**
 * LearningModeTemplate (Modernized)
 *
 * The main template component for the learning mode page.
 * Orchestrates all learning-related components and manages the overall layout.
 *
 * Features:
 * - Authentication protection
 * - State management via custom hook
 * - Error handling and loading states
 * - Consistent with AnalyticsTemplate pattern
 */

import React, { useCallback } from 'react';

// Atoms
import Button from '../../atoms/Button';
import ErrorMessage from '../../atoms/ErrorMessage';
import Headline from '../../atoms/Headline';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import Timer from '../../atoms/Timer';

// Molecules
import BoxSelection from '../../molecules/BoxSelection';
import FolderSelection from '../../molecules/FolderSelection';

// Organisms
import LearningModeManager from '../../organisms/LearningModeManager';

// Hooks & Utils
import { useLearningMode } from '../../../hooks/useLearningMode';

// Types
import type { FolderWithCardCount } from '../../../hooks/types';

// Styles
import * as SC from './styles';

interface LearningModeTemplateProps {
  testId?: string;
}

const LearningModeTemplateComponent: React.FC<LearningModeTemplateProps> = React.memo(({
  testId
}) => {
  const {
    step,
    selectedFolder,
    selectedLearningLevel,
    elapsedSeconds,
    resetTrigger,
    folders,
    boxCounts,
    masteredCount,
    loadingFolders,
    loadingCards,
    loading,
    error,
    canRetry,
    isRetrying,
    startLearning,
    selectFolder,
    selectBox,
    startBoxLearning,
    resetLearning,
    goBack,
    goBackToFolders,
    retryLastOperation,
    refreshBoxCounts,
    navigateToCards,
  } = useLearningMode();

  const handleFolderSelect = useCallback((folder: FolderWithCardCount) => {
    selectFolder(folder);
  }, [selectFolder]);

  const handleBoxSelect = useCallback((level: number) => {
    selectBox(level);
  }, [selectBox]);

  const handleStartBoxLearning = useCallback(() => {
    startBoxLearning();
  }, [startBoxLearning]);

  const handleNavigateToCards = useCallback(() => {
    navigateToCards();
  }, [navigateToCards]);

  if (loading && step === 'start') {
    return (
      <SC.Container data-testid={testId}>
        <SC.LoadingContainer>
          <LoadingSpinner 
            size="large" 
            text="Loading learning mode..." 
          />
        </SC.LoadingContainer>
      </SC.Container>
    );
  }

  return (
    <SC.Container data-testid={testId}>
      <SC.Header>
        <Headline size="md">Learning Mode</Headline>
        {step === 'learn' && typeof selectedLearningLevel === "number" && (
          <SC.BoxLevel>
            {`Box ${selectedLearningLevel + 1} (${boxCounts.find(b => b.level === selectedLearningLevel)?.count ?? 0})`}
          </SC.BoxLevel>
        )}
        {step === 'learn' && typeof elapsedSeconds === "number" && (
          <SC.TimerRow>
            <Timer seconds={elapsedSeconds} size="medium" />
          </SC.TimerRow>
        )}
      </SC.Header>

      <SC.Content>
        {error && (
          <ErrorMessage 
            message={error} 
            type="error"
            onRetry={canRetry ? retryLastOperation : undefined}
            retryText={isRetrying ? "Retrying..." : "Retry"}
          />
        )}

        {step === 'start' && (
          <SC.StartSection>
            <SC.WelcomeText>
              Welcome to Learning Mode! Choose a folder and start learning your flashcards 
              using the scientifically proven spaced repetition system.
            </SC.WelcomeText>
            <SC.ButtonGroup>
              <Button 
                $variant="primary" 
                onClick={startLearning}
              >
                Start Learning Mode
              </Button>
              <Button 
                $variant="secondary" 
                onClick={handleNavigateToCards}
              >
                Edit Flashcards Before Learning
              </Button>
            </SC.ButtonGroup>
          </SC.StartSection>
        )}

        {step === 'select-folder' && (
          <SC.SelectionSection>
            <SC.StepTitle>Select a Folder</SC.StepTitle>
            <SC.StepDescription>
              Choose the folder containing the flashcards you want to study.
            </SC.StepDescription>
            
            <FolderSelection
              folders={folders}
              selectedFolderId={selectedFolder?.id || null}
              onSelect={handleFolderSelect}
              loading={loadingFolders}
              testId="folder-selection"
            />
            
            <SC.ButtonGroup>
              <Button 
                $variant="secondary" 
                onClick={goBack}
              >
                Back
              </Button>
            </SC.ButtonGroup>
          </SC.SelectionSection>
        )}

        {step === 'select-box' && selectedFolder && (
          <SC.SelectionSection>
            <SC.StepTitle>Select Learning Box</SC.StepTitle>
            <SC.StepDescription>
              Choose which learning box to study. Higher boxes contain cards you know better.
            </SC.StepDescription>
            
            <BoxSelection
              boxes={boxCounts}
              selectedLevel={selectedLearningLevel}
              onSelect={handleBoxSelect}
              masteredCount={masteredCount}
              loading={loadingCards}
              testId="box-selection"
              folderInfo={selectedFolder ? {
                id: selectedFolder.id,
                name: selectedFolder.name,
                totalCards: selectedFolder.cardCount || 0
              } : undefined}
            />
            
            <SC.ButtonGroup>
              <Button 
                $variant="primary" 
                onClick={handleStartBoxLearning}
                disabled={selectedLearningLevel === null || loadingCards}
              >
                Start Learning
              </Button>
              <Button 
                $variant="secondary" 
                onClick={goBack}
              >
                Back to Folders
              </Button>
            </SC.ButtonGroup>
          </SC.SelectionSection>
        )}

        {step === 'learn' && selectedFolder && selectedLearningLevel !== null && (
          <SC.LearningSection>
            <LearningModeManager
              key={resetTrigger}
              folder={selectedFolder}
              currentLearningLevel={selectedLearningLevel}
              elapsedSeconds={elapsedSeconds}
              onBack={goBack}
              onRestart={resetLearning}
              onBackToFolders={goBackToFolders}
              onRefreshCounts={refreshBoxCounts}
            />
          </SC.LearningSection>
        )}
      </SC.Content>
    </SC.Container>
  );
});

LearningModeTemplateComponent.displayName = 'LearningModeTemplate';

export { LearningModeTemplateComponent as LearningModeTemplate };
export default LearningModeTemplateComponent;