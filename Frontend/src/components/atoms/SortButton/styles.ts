import styled from "styled-components";

export const SortButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledSortButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '4px'};

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.background};
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px); // Position below the button with a small gap
  right: 0; // Align to the right edge of the SortButtonWrapper
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0; // Remove vertical padding, items will handle it
  z-index: 5;
  overflow: hidden; // Important for clipping item corners
  min-width: 150px; // Adjust as needed

  /* Accordion animation */
  max-height: ${({ $isOpen }) => ($isOpen ? "300px" : "0")}; // Max height for content
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
`;

export const DropdownItem = styled.button<{ $isActive: boolean }>`
  display: block;
  width: 100%;
  padding: 10px 16px; // Item-specific padding
  text-align: left;
  background-color: transparent; // Default transparent background
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes?.small || '0.875rem'};
  transition: background-color 0.2s ease-in-out; // Smooth background transition for hover

  // Active state
  ${({ theme, $isActive }) =>
    $isActive
      ? `
        background-color: ${theme.primary}20;
        color: ${theme.primary};
      `
      : `
        background-color: transparent;
        color: ${theme.textPrimary};
      `
  }
  

  // Hover state (only if not active, or can be combined if desired)
  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? `${theme.primary}33` : theme.background};
  }

  &:focus {
    // Consistent subtle focus, can be same as hover or slightly different
    background-color: ${({ theme, $isActive }) => !$isActive && theme.highlight};
    color: ${({ theme, $isActive }) => !$isActive && theme.textPrimary};
    outline: none;
  }

  // Apply border-radius to the first and last items to match DropdownMenu
  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;
