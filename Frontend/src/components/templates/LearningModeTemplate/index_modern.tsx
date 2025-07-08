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
import Headline from '../../atoms/Headline';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import ErrorMessage from '../../atoms/ErrorMessage';
import Button from '../../atoms/Button';
import LearningModeManager from '../../organisms/LearningModeManager';
import { useLearningMode } from '../../../hooks/useLearningMode';
import * as SC from './styles';

interface LearningModeTemplateProps {
  testId?: string;
}

export const LearningModeTemplate: React.FC<LearningModeTemplateProps> = React.memo(({
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
    loadingFolders,
    loadingCards,
    loading,
    error,
    startLearning,
    selectFolder,
    selectBox,
    startBoxLearning,
    resetLearning,
    goBack,
    goBackToFolders,
    navigateToCards,
  } = useLearningMode();

  const handleFolderSelect = useCallback((folder: any) => {
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

  const formatTime = useCallback((seconds: number) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, []);

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
            {`Box ${selectedLearningLevel + 1}${boxCounts.find(b => b.level === selectedLearningLevel)?.count ? ` (${boxCounts.find(b => b.level === selectedLearningLevel)?.count})` : ""}`}
          </SC.BoxLevel>
        )}
        {step === 'learn' && typeof elapsedSeconds === "number" && (
          <SC.TimerRow>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
              aria-label="Clock"
            >
              <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
            </svg>
            <SC.Timer>{formatTime(elapsedSeconds)}</SC.Timer>
          </SC.TimerRow>
        )}
      </SC.Header>

      <SC.Content>
        {error && (
          <ErrorMessage message={error} />
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
            
            {loadingFolders ? (
              <SC.LoadingContainer>
                <LoadingSpinner 
                  size="medium" 
                  text="Loading folders..." 
                />
              </SC.LoadingContainer>
            ) : (
              <SC.SelectionSection>
                {folders.map((folder) => (
                  <SC.BoxCard 
                    key={folder.id}
                    $isSelected={false}
                    onClick={() => handleFolderSelect(folder)}
                  >
                    <SC.BoxNumber>{folder.name}</SC.BoxNumber>
                    <SC.BoxDescription>Click to select this folder</SC.BoxDescription>
                  </SC.BoxCard>
                ))}
              </SC.SelectionSection>
            )}
            
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
            
            {loadingCards ? (
              <SC.LoadingContainer>
                <LoadingSpinner 
                  size="medium" 
                  text="Loading cards..." 
                />
              </SC.LoadingContainer>
            ) : (
              <SC.BoxGrid>
                {boxCounts.map(({ level, count }) => (
                  <SC.BoxCard 
                    key={level}
                    $isSelected={selectedLearningLevel === level}
                    onClick={() => handleBoxSelect(level)}
                  >
                    <SC.BoxNumber>Box {level + 1}</SC.BoxNumber>
                    <SC.BoxCount>{count} cards</SC.BoxCount>
                    <SC.BoxDescription>
                      {level === 0 && "New cards"}
                      {level === 1 && "Learning cards"}
                      {level === 2 && "Review cards"}
                      {level === 3 && "Mastered cards"}
                    </SC.BoxDescription>
                  </SC.BoxCard>
                ))}
              </SC.BoxGrid>
            )}
            
            <SC.ButtonGroup>
              <Button 
                $variant="secondary" 
                onClick={goBack}
              >
                Back to Folders
              </Button>
              <Button 
                $variant="primary" 
                onClick={handleStartBoxLearning}
                disabled={selectedLearningLevel === null || loadingCards}
              >
                Start Learning
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
            />
          </SC.LearningSection>
        )}
      </SC.Content>
    </SC.Container>
  );
});

LearningModeTemplate.displayName = 'LearningModeTemplate';

export default LearningModeTemplate;
