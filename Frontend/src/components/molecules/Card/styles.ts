import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  margin: 0 0 10px 0;
`;

export const Content = styled.p`
  margin: 0;
`;