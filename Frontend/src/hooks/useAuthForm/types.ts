import React from 'react';

export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
  success: boolean;
  loading: boolean;
}

export interface AuthFormData {
  username: string;
  email?: string;
  password: string;
  confirmPassword?: string;
}

export interface UseAuthFormConfig {
  mode: 'login' | 'register';
  initialValues: AuthFormData;
  onSubmit: (_data: AuthFormData) => Promise<void>;
}

export interface UseAuthFormReturn {
  fields: Record<keyof AuthFormData, FormField>;
  handleChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (_event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (_event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isValid: boolean;
}