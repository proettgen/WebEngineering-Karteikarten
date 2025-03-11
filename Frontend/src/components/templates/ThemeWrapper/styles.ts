import { styled, createGlobalStyle } from "styled-components";

export const ContentWrapper = styled.main`
  min-height: calc(100vh - 60px);
  background-color: ${({ theme }) => theme.background};
`;

export const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.textSecondary};
    width: 60px;
    border-radius: 10px;
    border: 3px solid ${({ theme }) => theme.background}; 
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.highlight};
  }
`;
