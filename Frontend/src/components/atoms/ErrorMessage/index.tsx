/**
 * ErrorMessage Atom
 *
 * A reusable error message component with consistent styling.
 * Provides clear error communication to users.
 *
 * Features:
 * - Consistent error styling
 * - Optional retry functionality
 * - Accessibility support
 * - Different error types/severities
 */

import React from 'react';
import Text from '../Text';
import Button from '../Button';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  retryText?: string;
  testId?: string;
}

const typeColors = {
  error: 'var(--error-color, #ef4444)',
  warning: 'var(--warning-color, #fbbf24)',
  info: 'var(--info-color, #60a5fa)',
};

const typeIcons = {
  error: '⚠️',
  warning: '⚠️',
  info: 'ℹ️',
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onRetry,
  retryText = 'Retry',
  testId
}) => (
  <div 
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      border: `1px solid ${typeColors[type]}`,
      borderRadius: '8px',
      backgroundColor: `${typeColors[type]}10`,
    }}
    data-testid={testId}
    role="alert"
  >
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: typeColors[type],
      }}
    >
      <span style={{ fontSize: '20px' }}>
        {typeIcons[type]}
      </span>
      <Text color="textPrimary">
        {[message]}
      </Text>
    </div>
    
    {onRetry && (
      <Button 
        onClick={onRetry}
        $variant="secondary"
      >
        {retryText}
      </Button>
    )}
  </div>
);

export default ErrorMessage;
