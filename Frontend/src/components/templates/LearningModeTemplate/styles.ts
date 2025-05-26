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
  padding: 20px 0 12px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border || '#e0e0e0'};
  background: transparent;
`;

export const Title = styled.h1`
  margin: 0 0 0 16px;
`;

export const Timer = styled.span`
  font-size: 1.2rem;
  margin-right: 32px;
  color: ${({ theme }) => theme.primary};
  font-variant-numeric: tabular-nums;
`;

export const TimerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;