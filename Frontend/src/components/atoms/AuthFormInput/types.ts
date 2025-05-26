import React from 'react';
import { FormField } from '@/hooks/useAuthForm';

export interface AuthFormInputProps {
  name: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  field: FormField;
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (_event: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
}