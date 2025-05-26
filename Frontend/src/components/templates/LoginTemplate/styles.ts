// styles.ts
import styled from 'styled-components';
import { ThemeType } from '@/components/templates/ThemeWrapper/types';

// Main container for the page, centers the form
export const PageWrapper = styled.div<{ theme: ThemeType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 61px);
  background-color: ${({ theme }) => theme.background};
`;

// The form element itself
export const FormContainer = styled.form<{ theme: ThemeType }>`
  background-color: ${({ theme }) => theme.surface};
  padding: 32px 40px;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  > a,
  h1 {
    align-self: center;
  }
`;

// Container for additional links (forgot password, etc.)
export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
