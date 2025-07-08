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
import Button from '../../atoms/Button';
import type { CreateAnalyticsInput } from '../../../database/analyticsTypes';
import * as SC from './styles';

interface AnalyticsFormProps {
  form: CreateAnalyticsInput;
  onFieldChange: (_field: keyof CreateAnalyticsInput, _value: number) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  testId?: string;
}

const formFields = [
  {
    key: 'totalLearningTime' as keyof CreateAnalyticsInput,
    label: 'Gesamte Lernzeit (Sekunden)',
    placeholder: 'Lernzeit in Sekunden eingeben',
  },
  {
    key: 'totalCardsLearned' as keyof CreateAnalyticsInput,
    label: 'Gelernte Karten',
    placeholder: 'Anzahl gelernter Karten eingeben',
  },
  {
    key: 'totalCorrect' as keyof CreateAnalyticsInput,
    label: 'Richtige Antworten',
    placeholder: 'Anzahl richtiger Antworten eingeben',
  },
  {
    key: 'totalWrong' as keyof CreateAnalyticsInput,
    label: 'Falsche Antworten',
    placeholder: 'Anzahl falscher Antworten eingeben',
  },
  {
    key: 'resets' as keyof CreateAnalyticsInput,
    label: 'Resets',
    placeholder: 'Anzahl Resets eingeben',
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
      <SC.FormTitle>Analytics bearbeiten</SC.FormTitle>
      
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
            Abbrechen
          </Button>
          <Button 
            type="submit"
            $variant="primary"
            disabled={loading}
          >
            {loading ? 'Speichern...' : 'Speichern'}
          </Button>
        </SC.ButtonRow>
      </form>
    </SC.FormContainer>
  );
});

AnalyticsForm.displayName = 'AnalyticsForm';

export default AnalyticsForm;
