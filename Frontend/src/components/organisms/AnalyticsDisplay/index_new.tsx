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
import Button from '../../atoms/Button';
import AnalyticsMetric from '../../atoms/AnalyticsMetric';
import type { Analytics } from '../../../database/analyticsTypes';
import * as SC from './styles';

interface AnalyticsDisplayProps {
  analytics: Analytics | null;
  onEdit?: (_analytics: Analytics) => void;
  isEditing?: boolean;
  testId?: string;
}

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

  const learningTimeMinutes = analytics 
    ? Math.floor(analytics.totalLearningTime / 60)
    : 0;

  const learningTimeSeconds = analytics 
    ? analytics.totalLearningTime % 60
    : 0;

  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('de-DE');
    } catch {
      return 'Unbekannt';
    }
  };

  if (!analytics) {
    return (
      <SC.DisplayContainer data-testid={testId}>
        <SC.HeaderSection>
          <SC.Title>Ihre Lernstatistiken</SC.Title>
        </SC.HeaderSection>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          Keine Analytics-Daten verfügbar
        </div>
      </SC.DisplayContainer>
    );
  }

  return (
    <SC.DisplayContainer data-testid={testId}>
      <SC.HeaderSection>
        <SC.Title>Ihre Lernstatistiken</SC.Title>
        {onEdit && !isEditing && (
          <Button 
            onClick={() => onEdit(analytics)}
            $variant="primary"
          >
            Bearbeiten
          </Button>
        )}
      </SC.HeaderSection>

      <SC.MetricsGrid>
        <AnalyticsMetric
          label="Gesamte Lernzeit"
          value={`${learningTimeMinutes}m ${learningTimeSeconds}s`}
          color="primary"
          testId="metric-learning-time"
        />
        <AnalyticsMetric
          label="Gelernte Karten"
          value={analytics.totalCardsLearned}
          color="primary"
          testId="metric-cards-learned"
        />
        <AnalyticsMetric
          label="Richtige Antworten"
          value={analytics.totalCorrect}
          color="success"
          testId="metric-correct"
        />
        <AnalyticsMetric
          label="Falsche Antworten"
          value={analytics.totalWrong}
          color="danger"
          testId="metric-wrong"
        />
        <AnalyticsMetric
          label="Resets"
          value={analytics.resets}
          color="warning"
          testId="metric-resets"
        />
      </SC.MetricsGrid>

      <SC.SuccessRateSection>
        <SC.SuccessRateTitle>Erfolgsquote</SC.SuccessRateTitle>
        <AnalyticsMetric
          label="Erfolgsquote"
          value={`${successRate}%`}
          color={Number(successRate) >= 70 ? 'success' : Number(successRate) >= 50 ? 'warning' : 'danger'}
          testId="metric-success-rate"
        />
      </SC.SuccessRateSection>

      <SC.LastUpdatedText>
        Zuletzt aktualisiert: {formatLastUpdated(analytics.updatedAt)}
      </SC.LastUpdatedText>
    </SC.DisplayContainer>
  );
});

AnalyticsDisplay.displayName = 'AnalyticsDisplay';

export default AnalyticsDisplay;
