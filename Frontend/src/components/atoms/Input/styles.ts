import styled from 'styled-components';

export const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  margin-right: 10px;

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;