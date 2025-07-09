/**
 * AnalyticsTemplate Styled Components
 *
 * This file contains styles for the analytics template layout,
 * including container, header, and loading states.
 *
 * Styled Components Overview:
 * - Container: Main wrapper for analytics page
 * - HeaderSection: Header area for title and actions
 * - LoadingOverlay: Full-screen loading overlay
 * - LoadingContainer: Container for loading spinner
 *
 * Related Files:
 * - ./index.tsx: Uses these styled components
 * - ../organisms/AnalyticsDisplay: Main content component
 */

import styled from 'styled-components';

// Main wrapper for analytics page
export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 61px);
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
`;

// Header area for title and actions
export const HeaderSection = styled.div`
  margin-bottom: 32px;
`;

// Full-screen loading overlay
export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// Container for loading spinner
export const LoadingContainer = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ErrorSection = styled.div`
  margin-bottom: 24px;
`;

export const FormSection = styled.div`
  margin-bottom: 24px;
`;
