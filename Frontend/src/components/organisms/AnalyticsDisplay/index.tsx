/**
 * AnalyticsDisplay Organism
 *
 * A comprehensive display component for analytics data.
 * Combines multiple molecules and atoms to show analytics metrics.
 *
 * Features:
 * - Theme-aware styling using styled-components
 * - Organized metrics display with grid layout
 * - Computed analytics (success rate, learning time)
 * - Edit functionality integration
 * - Responsive design
 *
 * Cross-references:
 * - src/components/atoms/AnalyticsMetric: Individual metric display
 * - src/hooks/useAnalytics.ts: Data source
 */

import React from 'react';

// Atoms
import AnalyticsMetric from '../../atoms/AnalyticsMetric';
import Button from '../../atoms/Button';
import Headline from '../../atoms/Headline';
import Icon from '../../atoms/Icon';
import Text from '../../atoms/Text';

// Shared Components
import { EmptyStateContainer } from '../../shared/StyledComponents';

// Types
import type { AnalyticsDisplayProps } from './types';

// Styles
import * as SC from './styles';

export const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = React.memo(({
  analytics,
  onEdit,
  isEditing = false,
  testId
}) => {
  // Computed values
  const successRate = analytics && (analytics.totalCorrect + analytics.totalWrong) > 0 
    ? ((analytics.totalCorrect / (analytics.totalCorrect + analytics.totalWrong)) * 100).toFixed(1)
    : '0';

  /**
   * Formats time in seconds to hours:minutes:seconds format
   * Always shows hours for consistency (e.g., "0h 13m 45s", "2h 13m 45s")
   * @param totalSeconds - Time in seconds
   * @returns Formatted time string (e.g., "0h 23m 45s", "2h 13m 45s")
   */
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Always show hours for consistency in analytics
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formattedLearningTime = analytics 
    ? formatTime(analytics.totalLearningTime)
    : '0h 0m 0s';

  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US');
    } catch {
      return 'Unknown';
    }
  };

  if (!analytics) {
    return (
      <SC.DisplayContainer data-testid={testId}>
        <SC.HeaderSection>
          <SC.Title>Your Learning Statistics</SC.Title>
        </SC.HeaderSection>
        <EmptyStateContainer>
          <SC.IconWrapper>
            <Icon size="xl" color="textPrimary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
                aria-label="Analytics Icon"
              >
                <path d="M280-280h80v-200h-80v200Zm160 0h80v-400h-80v400Zm160 0h80v-120h-80v120ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
              </svg>
            </Icon>
          </SC.IconWrapper>
          <Headline size="lg">Start Your Learning Journey!</Headline>
          <Text size="large">
            Your learning statistics will appear here once you begin practicing.
          </Text>
          <Text size="medium" color="textSecondary">
            Study some flashcards to see detailed insights about your progress, performance, and learning patterns.
          </Text>
        </EmptyStateContainer>
      </SC.DisplayContainer>
    );
  }

  return (
    <SC.DisplayContainer data-testid={testId}>
      <SC.HeaderSection>
        <SC.HeaderWithIcon>
          <Icon size="m" color="textPrimary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              aria-label="Statistics"
            >
              <path d="M280-280h80v-200h-80v200Zm160 0h80v-400h-80v400Zm160 0h80v-120h-80v120ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
            </svg>
          </Icon>
          <SC.Title>Learning Progress & Statistics</SC.Title>
        </SC.HeaderWithIcon>
        {onEdit && !isEditing && (
          <Button 
            onClick={() => onEdit(analytics)}
            $variant="primary"
          >
            Edit
          </Button>
        )}
      </SC.HeaderSection>

      <SC.MetricsGrid>
        <AnalyticsMetric
          label="Study Time"
          value={formattedLearningTime}
          color="primary"
          testId="metric-learning-time"
        />
        <AnalyticsMetric
          label="Cards Studied"
          value={analytics.totalCardsLearned}
          color="primary"
          testId="metric-cards-learned"
        />
        <AnalyticsMetric
          label="Correct Answers"
          value={analytics.totalCorrect}
          color="success"
          testId="metric-correct"
        />
        <AnalyticsMetric
          label="Incorrect Answers"
          value={analytics.totalWrong}
          color="danger"
          testId="metric-wrong"
        />
        <AnalyticsMetric
          label="Learning Folder Resets"
          value={analytics.resets}
          color="warning"
          testId="metric-resets"
        />
      </SC.MetricsGrid>

      <SC.SuccessRateSection>
        <SC.SuccessRateTitle>Learning Performance</SC.SuccessRateTitle>
        <AnalyticsMetric
          label="Overall Success Rate"
          value={`${successRate}%`}
          color={Number(successRate) >= 70 ? 'success' : Number(successRate) >= 50 ? 'warning' : 'danger'}
          testId="metric-success-rate"
        />
      </SC.SuccessRateSection>

      <SC.LastUpdatedText>
        Last updated: {formatLastUpdated(analytics.updatedAt)}
      </SC.LastUpdatedText>
    </SC.DisplayContainer>
  );
});

AnalyticsDisplay.displayName = 'AnalyticsDisplay';

export default AnalyticsDisplay;
