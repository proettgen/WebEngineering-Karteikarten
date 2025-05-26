import React from 'react';
import { useState, useCallback } from 'react';
import { UseAuthFormConfig, UseAuthFormReturn, FormField, AuthFormData } from './types';
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword, getSyncValidationError } from './validation';

export const useAuthForm = (config: UseAuthFormConfig): UseAuthFormReturn => {
  const { mode, initialValues, onSubmit } = config;
  
  const [fields, setFields] = useState<Record<string, FormField>>(() => {
    const initialFields: Record<string, FormField> = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key as keyof AuthFormData] || '',
        error: undefined,
        touched: false,
        success: false,
        loading: false
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((fieldName: string, updates: Partial<FormField>) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], ...updates }
    }));
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const processedValue = name === 'email' ? value.replace(/\s/g, '') : value;
    
    // Get all current values for cross-field validation
    const allValues = Object.keys(fields).reduce((acc, key) => {
      acc[key] = key === name ? processedValue : fields[key].value;
      return acc;
    }, {} as Record<string, string>);

    const syncError = getSyncValidationError(name, processedValue, allValues);
    
    updateField(name, {
      value: processedValue,
      touched: true,
      error: syncError,
      success: !syncError && !!processedValue.trim()
    });

    // Re-validate confirmPassword if password changes
    if (name === 'password' && mode === 'register') {
      const confirmError = validateConfirmPassword(processedValue, allValues.confirmPassword || '');
      updateField('confirmPassword', {
        error: confirmError,
        success: !confirmError && !!allValues.confirmPassword
      });
    }
  }, [fields, mode, updateField]);

  const handleBlur = useCallback(async (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const processedValue = name === 'email' ? value.trim() : value;

    updateField(name, { touched: true, loading: true });

    let error: string | undefined;

    try {
      if (name === 'username') {
        error = await validateUsername(processedValue);
      } else if (name === 'email') {
        error = await validateEmail(processedValue);
      } else if (name === 'password') {
        error = validatePassword(processedValue);
        // Re-validate confirm password if it exists
        if (mode === 'register' && fields.confirmPassword?.value) {
          const confirmError = validateConfirmPassword(processedValue, fields.confirmPassword.value);
          updateField('confirmPassword', { error: confirmError, success: !confirmError });
        }
      } else if (name === 'confirmPassword') {
        error = validateConfirmPassword(fields.password.value, processedValue);
      }
    } catch {
      error = 'Validation failed. Please try again.';
    }

    updateField(name, {
      error,
      success: !error && (name === 'email' ? true : !!processedValue.trim()),
      loading: false
    });
  }, [fields, mode, updateField]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const fieldNames = Object.keys(fields);
    fieldNames.forEach(name => {
      updateField(name, { touched: true, loading: true });
    });

    // Validate all fields
    const validationPromises = fieldNames.map(async (name) => {
      const value = fields[name].value;
      let error: string | undefined;

      switch (name) {
        case 'username':
          error = await validateUsername(value);
          break;
        case 'email':
          error = await validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(fields.password.value, value);
          break;
      }

      updateField(name, {
        error,
        success: !error && (name === 'email' ? true : !!value.trim()),
        loading: false
      });

      return { name, error };
    });

    const validationResults = await Promise.all(validationPromises);
    const hasErrors = validationResults.some(result => !!result.error);

    if (!hasErrors) {
      try {
        const formData = Object.keys(fields).reduce((acc, key) => {
          acc[key as keyof AuthFormData] = fields[key].value;
          return acc;
        }, {} as AuthFormData);

        await onSubmit(formData);
      } catch {
        // Handle submission error here
        //TODO: show error to user
      }
    }

    setIsSubmitting(false);
  }, [fields, onSubmit, updateField]);

  const isValid = Object.values(fields).every(field => 
    !field.error && (field.value.trim() || field.value === '') // Allow empty optional fields
  ) && Object.keys(fields).filter(key => key !== 'email').every(key => 
    fields[key].value.trim() // Required fields must have values
  );

  return {
    fields: fields as Record<keyof AuthFormData, FormField>,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid
  };
};

export * from './types';