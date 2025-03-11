import styled from "styled-components";
import { NavItemProps } from "./types";

export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  height: 60px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.surface};
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 1rem;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.surface};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }

  > a {
    height: 100%;
    display: flex;
    align-items: center;
  }
`;

export const NavItem = styled.div<NavItemProps>`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1.5rem;
  color: ${({ theme, $active }) =>
    $active ? theme.primary : theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background-color: ${({ theme, $active }) =>
    $active ? `${theme.primary}20` : "transparent"};
  transition: all 0.2s ease-in-out;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? `${theme.primary}20` : `${theme.primary}10`};
    color: ${({ theme }) => theme.primary};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${theme.primary};
    }
  `}
`;
