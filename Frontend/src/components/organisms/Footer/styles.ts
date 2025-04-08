import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border};
`;
export const FooterItem = styled.div`
  display: flex;
  height: 60px;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => `${theme.primary}20`};
    div svg {
      cursor: pointer;
      fill: ${({ theme }) => theme.primary};
    }
  }
  transition: all 0.2s ease-in-out;
`;
