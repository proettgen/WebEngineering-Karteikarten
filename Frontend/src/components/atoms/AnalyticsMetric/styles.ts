import styled from 'styled-components';

export const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.primary}40;
  }
`;

export const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  line-height: 1.2;
`;

export const MetricValue = styled.div<{ $color: 'primary' | 'success' | 'warning' | 'danger' }>`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  line-height: 1;
  color: ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.accept;
      case 'danger': return theme.deny;
      case 'warning': return theme.secondary;
      case 'primary':
      default: return theme.primary;
    }
  }};
`;
