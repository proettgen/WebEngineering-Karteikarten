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
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const LogoWrapper = styled.div`
  a {
    box-sizing: border-box;
    width: 290px;
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
