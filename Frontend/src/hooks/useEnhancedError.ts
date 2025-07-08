/**
 * Enhanced Error Boundary Hook
 * 
 * Advanced error handling hook that provides retry mechanisms and consistent error states.
 * Designed to match the robustness of Card/Folder error handling patterns.
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Different error types and recovery strategies
 * - Loading state management during retries
 * - Consistent error messaging across the app
 */

import { useState, useCallback, useRef } from 'react';

export interface ErrorState {
  message: string;
  type: 'network' | 'validation' | 'authentication' | 'unknown';
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
}

interface UseEnhancedErrorReturn {
  error: ErrorState | null;
  isRetrying: boolean;
  setError: (_error: string | Error | null, _type?: ErrorState['type']) => void;
  clearError: () => void;
  retry: (_operation: () => Promise<void>) => Promise<void>;
  canRetry: boolean;
}

const DEFAULT_MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

const parseErrorType = (error: string | Error): ErrorState['type'] => {
  const message = typeof error === 'string' ? error : error.message;
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return 'network';
  }
  if (lowerMessage.includes('validation') || lowerMessage.includes('invalid')) {
    return 'validation';
  }
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden')) {
    return 'authentication';
  }
  return 'unknown';
};

const isRetryableError = (type: ErrorState['type']): boolean => 
  type === 'network' || type === 'unknown';

export const useEnhancedError = (maxRetries: number = DEFAULT_MAX_RETRIES): UseEnhancedErrorReturn => {
  const [error, setErrorState] = useState<ErrorState | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setError = useCallback((
    errorInput: string | Error | null, 
    type?: ErrorState['type']
  ) => {
    if (errorInput === null) {
      setErrorState(null);
      return;
    }

    const message = typeof errorInput === 'string' ? errorInput : errorInput.message;
    const errorType = type || parseErrorType(errorInput);
    const retryable = isRetryableError(errorType);

    setErrorState({
      message,
      type: errorType,
      retryable,
      retryCount: 0,
      maxRetries
    });
  }, [maxRetries]);

  const clearError = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setErrorState(null);
    setIsRetrying(false);
  }, []);

  const retry = useCallback(async (operation: () => Promise<void>) => {
    if (!error || !error.retryable || error.retryCount >= error.maxRetries) {
      return;
    }

    setIsRetrying(true);
    
    // Wait for retry delay (exponential backoff)
    const delay = RETRY_DELAYS[error.retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
    
    return new Promise<void>((resolve) => {
      retryTimeoutRef.current = setTimeout(async () => {
        try {
          await operation();
          clearError();
          resolve();
        } catch {
          // Update error with incremented retry count
          setErrorState(prev => prev ? {
            ...prev,
            retryCount: prev.retryCount + 1
          } : null);
          setIsRetrying(false);
          resolve();
        }
      }, delay);
    });
  }, [error, clearError]);

  const canRetry = Boolean(error?.retryable && error.retryCount < error.maxRetries && !isRetrying);

  return {
    error,
    isRetrying,
    setError,
    clearError,
    retry,
    canRetry
  };
};
