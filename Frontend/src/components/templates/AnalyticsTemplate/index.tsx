/**
 * AnalyticsTemplate
 *
 * The main template component for the analytics page.
 * Orchestrates all analytics-related components and manages the overall layout.
 *
 * Features:
 * - Responsive layout management
 * - Component orchestration
 * - State management delegation to custom hook
 * - Error boundary integration
 * - Loading state management
 *
 * Cross-references:
 * - src/hooks/useAnalytics.ts: Main state management
 * - src/components/organisms/AnalyticsDisplay: Data display
 * - src/components/molecules/AnalyticsForm: Data editing
 */

import React, { useCallback } from 'react';
import Headline from '../../atoms/Headline';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import ErrorMessage from '../../atoms/ErrorMessage';
import AnalyticsDisplay from '../../organisms/AnalyticsDisplay';
import AnalyticsForm from '../../molecules/AnalyticsForm';
import { useAnalytics } from '../../../hooks/useAnalytics';
import * as SC from './styles';

interface AnalyticsTemplateProps {
  testId?: string;
}

export const AnalyticsTemplate: React.FC<AnalyticsTemplateProps> = React.memo(({
  testId
}) => {
  const {
    analytics,
    loading,
    error,
    isEditing,
    form,
    loadAnalytics,
    updateAnalyticsData,
    startEdit,
    cancelEdit,
    setFormField,
  } = useAnalytics();

  const handleSave = useCallback(async () => {
    await updateAnalyticsData(form);
  }, [updateAnalyticsData, form]);

  const handleRetry = () => {
    loadAnalytics();
  };

  if (loading && !analytics) {
    return (
      <SC.Container data-testid={testId}>
        <SC.HeaderSection>
          <Headline>Learning Analytics</Headline>
        </SC.HeaderSection>
        <LoadingSpinner 
          size="large" 
          text="Loading analytics data..." 
          testId="analytics-loading"
        />
      </SC.Container>
    );
  }

  if (error && !analytics) {
    return (
      <SC.Container data-testid={testId}>
        <SC.HeaderSection>
          <Headline>Learning Analytics</Headline>
        </SC.HeaderSection>
        <ErrorMessage 
          message={error}
          type="error"
          onRetry={handleRetry}
          testId="analytics-error"
        />
      </SC.Container>
    );
  }

  return (
    <SC.Container data-testid={testId}>
      <SC.HeaderSection>
        <Headline>Learning Analytics</Headline>
      </SC.HeaderSection>
      
      {/* Show error if there's one during editing */}
      {error && analytics && (
        <SC.ErrorSection>
          <ErrorMessage 
            message={error}
            type="warning"
            onRetry={() => window.location.reload()}
            retryText="Reload page"
            testId="analytics-edit-error"
          />
        </SC.ErrorSection>
      )}

      {/* Edit Form */}
      {isEditing && (
        <SC.FormSection>
          <AnalyticsForm
            form={form}
            onFieldChange={setFormField}
            onSave={handleSave}
            onCancel={cancelEdit}
            loading={loading}
            testId="analytics-form"
          />
        </SC.FormSection>
      )}

      {/* Analytics Display - nur wenn nicht im Edit-Modus */}
      {!isEditing && (
        <AnalyticsDisplay
          analytics={analytics}
          onEdit={startEdit}
          isEditing={isEditing}
          testId="analytics-display"
        />
      )}

      {/* Loading overlay during updates */}
      {loading && analytics && (
        <SC.LoadingOverlay>
          <SC.LoadingContainer>
            <LoadingSpinner 
              size="large" 
              text="Saving changes..." 
              testId="analytics-save-loading"
            />
          </SC.LoadingContainer>
        </SC.LoadingOverlay>
      )}
    </SC.Container>
  );
});

AnalyticsTemplate.displayName = 'AnalyticsTemplate';

export default AnalyticsTemplate;
