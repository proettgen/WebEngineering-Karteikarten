import React, { useState, useCallback } from 'react';
import { UseAuthFormConfig, UseAuthFormReturn, FormField, AuthFormData } from './types';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getSyncValidationError
} from './validation';

// Helper for confirm password validation in profile mode
const getProfileConfirmPasswordError = (newPassword: string, confirmPassword: string) => {
  if (!newPassword.trim()) return undefined;
  if (!confirmPassword.trim()) return "Please confirm your new password.";
  if (newPassword !== confirmPassword) return "Passwords do not match.";
  return undefined;
};

const getFieldValidation = async (
  name: string,
  value: string,
  fields: Record<string, FormField>,
  mode: string
): Promise<string | undefined> => {
  if (name === 'username') {
    return await validateUsername(value, mode);
  } else if (name === 'email') {
    return await validateEmail(value, mode);
  } else if (name === 'password') {
    return validatePassword(value);
  } else if (name === 'newPassword') {
    return validatePassword(value, false);
  } else if (name === 'currentPassword') {
    if (mode === 'profile' && !value.trim()) return "Current password is required to save changes.";
    if (!value.trim()) return "Password is required.";
    return undefined;
  } else if (name === 'confirmPassword') {
    if (mode === 'profile') {
      const newPassword = fields.newPassword?.value || '';
      return getProfileConfirmPasswordError(newPassword, value);
    }
    return validateConfirmPassword(fields.password?.value || '', value);
  } else {
    return undefined;
  }
  }


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

    // Prepare allValues for cross-field validation
    const allValues = Object.keys(fields).reduce((acc, key) => {
      acc[key] = key === name ? processedValue : fields[key].value;
      return acc;
    }, {} as Record<string, string>);

    let syncError: string | undefined;

    if (name === 'confirmPassword' && mode === 'profile') {
      syncError = getProfileConfirmPasswordError(allValues.newPassword || '', processedValue);
    } else {
      syncError = getSyncValidationError(name, processedValue, allValues, mode);
    }

    updateField(name, {
      value: processedValue,
      touched: true,
      error: syncError,
      success: !syncError && !!processedValue.trim()
    });

    // Re-validate confirmPassword if password/newPassword changes
    if (
      (name === 'password' && mode === 'register') ||
      (name === 'newPassword' && mode === 'profile')
    ) {
      const confirmValue = allValues.confirmPassword || '';
      const confirmError =
        mode === 'profile'
          ? getProfileConfirmPasswordError(processedValue, confirmValue)
          : validateConfirmPassword(processedValue, confirmValue);

      updateField('confirmPassword', {
        error: confirmError,
        success: !confirmError && !!confirmValue && !!processedValue.trim()
      });
    }

    // Clear confirmPassword when newPassword is cleared in profile mode
    if (name === 'newPassword' && mode === 'profile' && !processedValue.trim()) {
      updateField('confirmPassword', {
        value: '',
        error: undefined,
        success: false,
        touched: false
      });
    }
  }, [fields, mode, updateField]);

  const handleBlur = useCallback(async (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const processedValue = name === 'email' ? value.trim() : value;

    updateField(name, { touched: true, loading: true });

    let error: string | undefined;
    try {
      error = await getFieldValidation(name, processedValue, fields, mode);

      // Re-validate confirmPassword if password/newPassword blur
      if (
        (name === 'password' && mode === 'register' && fields.confirmPassword?.value) ||
        (name === 'newPassword' && mode === 'profile' && fields.confirmPassword?.value)
      ) {
        const confirmValue = fields.confirmPassword.value;
        const confirmError =
          mode === 'profile'
            ? getProfileConfirmPasswordError(processedValue, confirmValue)
            : validateConfirmPassword(processedValue, confirmValue);

        updateField('confirmPassword', {
          error: confirmError,
          success: !confirmError && !!confirmValue && !!processedValue.trim()
        });
      }
    } catch {
      error = 'Validation failed. Please try again.';
    }

    updateField(name, {
      error,
      success:
        !error &&
        (['email', 'username', 'newPassword'].includes(name)
          ? mode === 'profile'
            ? !!processedValue.trim()
            : true
          : !!processedValue.trim()),
      loading: false
    });
  }, [fields, mode, updateField]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const fieldNames = Object.keys(fields);

    // Mark all fields as touched and loading
    fieldNames.forEach(name => {
      updateField(name, { touched: true, loading: true });
    });

    // Validate all fields
    const validationResults = await Promise.all(
      fieldNames.map(async name => {
        const value = fields[name].value;
        let error: string | undefined;
        try {
          error = await getFieldValidation(name, value, fields, mode);
        } catch {
          error = 'Validation failed. Please try again.';
        }
        updateField(name, {
          error,
          success:
            !error &&
            (['email', 'username', 'newPassword'].includes(name)
              ? mode === 'profile'
                ? !!value.trim()
                : true
              : !!value.trim()),
          loading: false
        });
        return error;
      })
    );

    const hasErrors = validationResults.some(Boolean);

    if (!hasErrors) {
      try {
        const formData = Object.keys(fields).reduce((acc, key) => {
          acc[key as keyof AuthFormData] = fields[key].value;
          return acc;
        }, {} as AuthFormData);

        await onSubmit(formData);
      } catch {
        // Swallow submit errors
      }
    }

    setIsSubmitting(false);
  }, [fields, onSubmit, updateField, mode]);

  const isValid =
    Object.values(fields).every(
      field => !field.error && (field.value.trim() || field.value === '')
    ) &&
    Object.keys(fields)
      .filter(key => key !== 'email')
      .every(key => fields[key].value.trim());

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