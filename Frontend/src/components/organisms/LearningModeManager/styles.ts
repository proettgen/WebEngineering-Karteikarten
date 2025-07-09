import styled from "styled-components";

/**
 * LearningModeManager Styled Components
 *
 * This file contains styles for the completion screen display and button
 * arrangement in the learning mode manager.
 *
 * Styled Components Overview:
 * - CongratsWrapper: Wrapper for congratulations/completion display after learning
 * - ButtonRow: Row layout for buttons (e.g., restart, back)
 *
 * Related Files:
 * - ../LearningModeManager/index.tsx: Uses these styled components
 * - ../LearningModeManager/types.ts: Type definitions for props and state
 */

// Wrapper for congratulations display after completing learning
export const CongratsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 24px;
`;

// Row layout for buttons (e.g., restart, back)
export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
`;

// Loading and error state containers
export const CenteredContainer = styled.div`
  text-align: center;
  padding: 32px;
`;
