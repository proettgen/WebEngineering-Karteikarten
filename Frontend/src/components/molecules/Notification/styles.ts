import styled from 'styled-components';

export const Notification = styled.div<{ type: string }>`
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.textPrimary};
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.accept;
      case 'error':
        return theme.deny;
      default:
        return theme.highlight;
    }
  }};
`;