import styled, { css } from "styled-components";
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
  border-left: 1px solid ${({ theme }) => theme.border};

  &::-webkit-scrollbar {
    height: 3px;
    color: ${({ theme }) => theme.textPrimary};
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.surface};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.textSecondary};
    border-radius: 3px;
    border: ${({ theme }) => theme.textPrimary};
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
      $active ? `${theme.primary}33` : `${theme.background}`};
    color: ${({ theme, $active }) =>
      $active ? `${theme.primary}` : `${theme.textPrimary}`};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
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
