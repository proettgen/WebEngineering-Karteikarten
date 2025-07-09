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
    key: 'totalCardsLearned' as keyof CreateAnalyticsInput,
    label: 'Cards Studied',
    placeholder: 'Enter number of cards studied',
    isTime: false,
  },
  {
    key: 'totalCorrect' as keyof CreateAnalyticsInput,
    label: 'Correct Answers',
    placeholder: 'Enter number of correct answers',
    isTime: false,
  },
  {
    key: 'totalWrong' as keyof CreateAnalyticsInput,
    label: 'Incorrect Answers',
    placeholder: 'Enter number of incorrect answers',
    isTime: false,
  },
  {
    key: 'resets' as keyof CreateAnalyticsInput,
    label: 'Learning Folder Resets',
    placeholder: 'Enter number of learning folder resets',
    isTime: false,
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
  // State for separate time inputs
  const [timeInputs, setTimeInputs] = React.useState(() => {
    const totalSeconds = form.totalLearningTime || 0;
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  });

  // Update totalLearningTime when time inputs change
  React.useEffect(() => {
    const totalSeconds = (timeInputs.hours * 3600) + (timeInputs.minutes * 60) + timeInputs.seconds;
    onFieldChange('totalLearningTime', totalSeconds);
  }, [timeInputs, onFieldChange]);

  const handleInputChange = (field: keyof CreateAnalyticsInput) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value) || 0;
      onFieldChange(field, value);
    };

  const handleTimeInputChange = (timeUnit: 'hours' | 'minutes' | 'seconds') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(0, Number(e.target.value) || 0);
      setTimeInputs(prev => ({
        ...prev,
        [timeUnit]: timeUnit === 'hours' ? Math.min(99999, value) : 
                   timeUnit === 'minutes' || timeUnit === 'seconds' ? Math.min(59, value) : value
      }));
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
          {/* Study Time Section */}
          <SC.TimeSection>
            <SC.Label>Study Time:</SC.Label>
            <SC.TimeInputRow>
              <SC.TimeInputGroup>
                <SC.Input 
                  type="number" 
                  value={timeInputs.hours}
                  onChange={handleTimeInputChange('hours')}
                  placeholder="0"
                  min="0"
                  max="99999"
                />
                <SC.TimeLabel>h</SC.TimeLabel>
              </SC.TimeInputGroup>
              <SC.TimeInputGroup>
                <SC.Input 
                  type="number" 
                  value={timeInputs.minutes}
                  onChange={handleTimeInputChange('minutes')}
                  placeholder="0"
                  min="0"
                  max="59"
                />
                <SC.TimeLabel>m</SC.TimeLabel>
              </SC.TimeInputGroup>
              <SC.TimeInputGroup>
                <SC.Input 
                  type="number" 
                  value={timeInputs.seconds}
                  onChange={handleTimeInputChange('seconds')}
                  placeholder="0"
                  min="0"
                  max="59"
                />
                <SC.TimeLabel>s</SC.TimeLabel>
              </SC.TimeInputGroup>
            </SC.TimeInputRow>
          </SC.TimeSection>

          {/* Other Fields */}
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
