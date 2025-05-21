import styled from "styled-components";

export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
  }
`;
export const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.textPrimary};
  margin: 0 8px;
  min-width: 0;
  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;
