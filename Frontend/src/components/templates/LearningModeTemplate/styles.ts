import styled from "styled-components";

export const Container = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
  padding: 0;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  margin-top: 32px;
  margin-left: 32px;
`;

export const Timer = styled.span`
  font-size: 1.2rem;
  margin-right: 32px;
  color: ${({ theme }) => theme.primary};
  font-variant-numeric: tabular-nums;
`;