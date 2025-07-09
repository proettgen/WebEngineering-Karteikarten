/**
 * AnalyticsForm Molecule
 *
 * A form component for editing analytics data.
 * Combines multiple atoms to create a cohesive editing interface.
 *
 * Features:
 * - Theme-aware styling using styled-components
 * - Controlled inputs for all analytics fields
 * - Input validation and formatting
 * - Responsive layout with grid
 * - Save/Cancel actions
 *
 * Cross-references:
 * - src/hooks/useAnalytics.ts: Form state management
 * - src/components/atoms: Button components
 */

import React from 'react';

// Atoms
import Button from '../../atoms/Button';

// Types
import type { CreateAnalyticsInput } from '../../../database/analyticsTypes';
import type { AnalyticsFormProps } from './types';

// Styles
import * as SC from './styles';

const formFields = [
  {
    key: 'totalLearningTime' as keyof CreateAnalyticsInput,
    label: 'Total Learning Time (seconds)',
    placeholder: 'Enter learning time in seconds',
  },
  {
    key: 'totalCardsLearned' as keyof CreateAnalyticsInput,
    label: 'Cards Learned',
    placeholder: 'Enter number of cards learned',
  },
  {
    key: 'totalCorrect' as keyof CreateAnalyticsInput,
    label: 'Correct Answers',
    placeholder: 'Enter number of correct answers',
  },
  {
    key: 'totalWrong' as keyof CreateAnalyticsInput,
    label: 'Wrong Answers',
    placeholder: 'Enter number of wrong answers',
  },
  {
    key: 'resets' as keyof CreateAnalyticsInput,
    label: 'Resets',
    placeholder: 'Enter number of resets',
  },
];

export const AnalyticsForm: React.FC<AnalyticsFormProps> = React.memo(({
  form,
  onFieldChange,
  onSave,
  onCancel,
  loading = false,
  testId
}) => {
  const handleInputChange = (field: keyof CreateAnalyticsInput) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value) || 0;
      onFieldChange(field, value);
    };

  return (
    <SC.FormContainer data-testid={testId}>
      <SC.FormTitle>Edit Analytics</SC.FormTitle>
      
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <SC.FormGrid>
          {formFields.map(({ key, label, placeholder }) => (
            <SC.FormField key={key}>
              <SC.Label>{label}:</SC.Label>
              <SC.Input 
                type="number" 
                value={String(form[key] || 0)} 
                onChange={handleInputChange(key)} 
                placeholder={placeholder}
              />
            </SC.FormField>
          ))}
        </SC.FormGrid>
        
        <SC.ButtonRow>
          <Button 
            type="button"
            onClick={onCancel}
            $variant="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            $variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </SC.ButtonRow>
      </form>
    </SC.FormContainer>
  );
});

AnalyticsForm.displayName = 'AnalyticsForm';

export default AnalyticsForm;
