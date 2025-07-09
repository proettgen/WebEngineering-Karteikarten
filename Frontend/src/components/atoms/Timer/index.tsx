/**
 * Timer Atom Component
 * 
 * A reusable timer component that displays formatted time with an icon.
 * Extracted from LearningModeTemplate for better reusability and atomic design compliance.
 * 
 * Features:
 * - Consistent timer display across the app
 * - Reusable in Learning Mode, Analytics, and other time-tracking features
 * - Accessible with proper ARIA labels
 * - Theme-aware styling
 */

import React from 'react';

// Atoms
import Icon from '../Icon';

// Types
import type { TimerProps } from './types';

// Styles
import { TimerContainer, TimeDisplay } from './styles';

/**
 * Formats seconds into MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (MM:SS)
 */
const formatTime = (seconds: number): string => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

/**
 * Timer Component
 * 
 * Displays elapsed time in MM:SS format with optional clock icon.
 * Used primarily in learning mode to track study session duration.
 * 
 * @param seconds - Time in seconds to display
 * @param size - Size variant (small, medium, large)
 * @param showIcon - Whether to show the clock icon
 * @param testId - Test ID for testing purposes
 */
export const Timer: React.FC<TimerProps> = React.memo(({
  seconds,
  size = 'medium',
  showIcon = true,
  testId
}) => {
  const iconSize = size === 'small' ? 's' : size === 'large' ? 'l' : 'm';

  return (
    <TimerContainer $size={size} data-testid={testId}>
      {showIcon && (
        <Icon size={iconSize} color="textSecondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            aria-label="Clock"
          >
            <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
          </svg>
        </Icon>
      )}
      <TimeDisplay aria-label={`Time elapsed: ${formatTime(seconds)}`}>
        {formatTime(seconds)}
      </TimeDisplay>
    </TimerContainer>
  );
});

Timer.displayName = 'Timer';

export default Timer;
