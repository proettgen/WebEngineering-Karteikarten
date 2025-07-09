/**
 * Analytics Dashboard Template
 *
 * @description Main template component for the analytics dashboard page. Provides
 * comprehensive learning statistics visualization with data editing capabilities
 * and responsive layout management.
 *
 * @features
 * - Responsive analytics dashboard layout
 * - Real-time learning statistics display
 * - Interactive data editing with form validation
 * - Error boundary integration with user feedback
 * - Loading state management with smooth transitions
 * - Authentication-aware data access
 *
 * @architecture
 * - Template-level: Page layout and component orchestration
 * - Organism-level: {@link AnalyticsDisplay} for data visualization
 * - Molecule-level: {@link AnalyticsForm} for data editing
 * - Atom-level: {@link ErrorMessage}, {@link LoadingSpinner} for UI feedback
 *
 * @cross-references
 * - {@link useAnalytics} - Analytics data state management
 * - {@link AnalyticsDisplay} - Main statistics visualization component
 * - {@link AnalyticsForm} - Data editing and input component
 * - `/app/analytics/page.tsx` - Next.js page consuming this template
 *
 * @props None - Uses internal hooks for state management
 *
 * @example
 * ```tsx
 * // Used in app/analytics/page.tsx
 * export default function AnalyticsPage() {
 *   return <AnalyticsTemplate />;
 * }
 * ```
 */

import React, { useCallback } from 'react';

// Atoms
import ErrorMessage from '../../atoms/ErrorMessage';
import Headline from '../../atoms/Headline';
import LoadingSpinner from '../../atoms/LoadingSpinner';

// Molecules
import AnalyticsForm from '../../molecules/AnalyticsForm';

// Organisms
import AnalyticsDisplay from '../../organisms/AnalyticsDisplay';

// Hooks & Utils
import { useAnalytics } from '../../../hooks/useAnalytics';

// Styles
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
