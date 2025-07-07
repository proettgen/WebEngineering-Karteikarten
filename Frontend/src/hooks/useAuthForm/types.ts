import React from 'react';

export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
  success: boolean;
  loading: boolean;
}

export interface AuthFormData {
  usernameOrEmail?: string;  // For login
  username?: string;         // For register
  email?: string;            // For register
  password?: string;         // For login/register (optional for profile mode)
  confirmPassword?: string;
  newPassword?: string;      // For profile
  currentPassword?: string;  // For profile
}

export interface UseAuthFormConfig {
  mode: 'login' | 'register' | 'profile';
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