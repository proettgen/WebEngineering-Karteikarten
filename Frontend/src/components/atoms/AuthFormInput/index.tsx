import React from 'react';
import { AuthFormInputProps } from './types';
import * as SC from './styles';
import Icon from '@/components/atoms/Icon';

const AuthFormInput: React.FC<AuthFormInputProps> = ({
  name,
  type,
  placeholder,
  field,
  onChange,
  onBlur,
  required = false
}) => {
  const showError = field.touched && !!field.error;
  const showSuccess = Boolean(
    field.touched && 
    field.success && 
    !field.error && 
    (type === 'email' ? field.value.trim() : !!field.value.trim())
  );
  return (
    <SC.InputWrapper>
      <SC.Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={field.value}
        onChange={onChange}
        onBlur={onBlur}
        $hasError={showError}
        $isSuccess={showSuccess}
        aria-describedby={`${name}-error`}
        aria-invalid={showError}
        required={required}
      />
      
      {field.loading && <SC.Spinner />}
      
      {!field.loading && showSuccess && (
        <SC.IconWrapper>
          <Icon size="m" color="accept">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </Icon>
        </SC.IconWrapper>
      )}
      
      <SC.ErrorMessage id={`${name}-error`}>
        {showError ? field.error : ''}
      </SC.ErrorMessage>
    </SC.InputWrapper>
  );
};

export default AuthFormInput;