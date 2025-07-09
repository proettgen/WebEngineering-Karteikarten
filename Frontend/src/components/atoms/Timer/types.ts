/**
 * Timer Component Types
 * 
 * Type definitions for the Timer atom component.
 */

export interface TimerProps {
  seconds: number;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  testId?: string;
}
