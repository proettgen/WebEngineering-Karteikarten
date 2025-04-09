import styled from "styled-components";

export const HeaderWrapper = styled.header`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  padding: 0 1rem 0 0;
  height: 60px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const LogoWrapper = styled.div`
  a {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0 1.5rem;
    height: 60px;
    align-items: center;
    justify-content: center;
  }
  background-color: ${({ theme }) => `${theme.primary}20`};
`;
