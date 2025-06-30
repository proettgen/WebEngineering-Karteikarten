import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

export const Notification = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isFadingOut',
})<{ type: string; isFadingOut?: boolean }>`
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
  animation: ${({ isFadingOut }) => isFadingOut ? fadeOut : fadeIn} 0.4s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
`;