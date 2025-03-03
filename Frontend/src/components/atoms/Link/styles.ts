import styled from 'styled-components';

export const Link = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  padding: 10px;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }

  &:active {
    color: ${({ theme }) => theme.highlight};
  }
`;