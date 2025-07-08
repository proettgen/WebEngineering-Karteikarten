/**
 * LoadingSpinner Atom
 *
 * A reusable loading spinner component with consistent styling.
 * Provides better user experience during async operations.
 *
 * Features:
 * - Smooth CSS animation
 * - Customizable size and color
 * - Accessibility support
 * - Optional loading text
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  testId?: string;
}

const sizeMap = {
  small: 16,
  medium: 24,
  large: 32,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'var(--primary-color, #007acc)',
  text,
  testId
}) => {
  const spinnerSize = sizeMap[size];

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
      }}
      data-testid={testId}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `2px solid transparent`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span 
          style={{ 
            color: 'var(--text-secondary, #888)',
            fontSize: '14px',
          }}
        >
          {text}
        </span>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
