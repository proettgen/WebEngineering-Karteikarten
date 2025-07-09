/**
 * AnalyticsDisplay Styled Components
 *
 * Styled components for the AnalyticsDisplay organism component.
 * Provides comprehensive styling for analytics data visualization and display.
 *
 * Layout Components:
 * - DisplayContainer: Main wrapper with surface styling and borders
 * - HeaderSection: Top section with title and action buttons
 * - HeaderWithIcon: Icon and title combination container
 * - MetricsGrid: Responsive grid for analytics metrics display
 * - SuccessRateSection: Dedicated section for success rate visualization
 *
 * Typography Components:
 * - Title: Main component title with proper hierarchy
 * - SuccessRateTitle: Section-specific title styling
 * - LastUpdatedText: Timestamp display with secondary styling
 *
 * Utility Components:
 * - IconWrapper: Icon container with centered alignment
 *
 * Features:
 * - Responsive grid layouts for various screen sizes
 * - Consistent spacing and typography hierarchy
 * - Theme-aware colors and borders
 * - Visual separation between sections
 */

import styled from 'styled-components';

export const DisplayContainer = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
  position: relative;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const HeaderWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  font-weight: 600;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const SuccessRateSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const SuccessRateTitle = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin: 0 0 16px 0;
  font-weight: 600;
`;

export const LastUpdatedText = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
  margin-top: 16px;
`;

export const IconWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
