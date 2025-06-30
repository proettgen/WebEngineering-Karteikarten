import styled, { css } from "styled-components";

/**
 * Main container for the aside navigation.
 * It's fixed to the left, has defined width constraints, and handles overflow.
 */
export const AsideContainer = styled.aside`
  background-color: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};

  height: calc(100vh - 61px); /* Static height, assuming 61px header */

  position: sticky;
  left: 0;
  top: 61px;
  width: 291px;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Show scrollbar only if content overflows vertically */
  user-select: none;

  &::-webkit-scrollbar {
    width: 3px;
    color: ${({ theme }) => theme.textPrimary};
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.surface};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
    border: ${({ theme }) => theme.border};
  }
`;

/**
 * Styles for the "Back" button.
 */
export const BackButton = styled.button`
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.textSecondary};
  }

  &:disabled {
    color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

/**
 * Container for the list of folders.
 */
export const FolderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

/**
 * Styles for an individual folder item in the list.
 * Includes styles for selected state.
 */
export const FolderItem = styled.li<{ $isSelected: boolean }>`
  padding: 12px 10px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    font-weight 0.2s ease;

  ${({ theme, $isSelected }) =>
    $isSelected
      ? css`
          background-color: ${theme.primary}20;
          color: ${theme.primary};
          font-weight: 600;
        `
      : css`
          background-color: transparent;
          color: ${theme.textPrimary};
          font-weight: normal;
        `}

  &:hover {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? `${theme.primary}33` : theme.background};
    color: ${({ theme, $isSelected }) => $isSelected && theme.primary};
  }
`;

/**
 * Styles for the folder name text.
 */
export const FolderName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  min-width: 0; /* Helps with flex sizing and text overflow */
`;

/**
 * Container for the top controls like SearchBar and SortButton.
 */
export const TopControlsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  margin-bottom: 20px;

  & > :first-child {
    flex-grow: 1;
    min-width: 0;
  }
`;

export const EditButton = styled.button`
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border:1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.onPrimary};
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.textSecondary};
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${({ theme }) => theme.onPrimary};
    pointer-events: none;
  }
`;

export const SelectedFolderItem = styled(FolderItem)`
  margin: 12px 0;
  justify-content: center;
  pointer-events: none;
  cursor: default;

  & > button {
    pointer-events: auto;
  }
`;

/**
 * Styles for the Add Folder button.
 */
export const AddFolderButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.onPrimary};
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover || theme.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

/**
 * Loading container for when folders are being fetched.
 */
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

/**
 * Breadcrumb container
 */
export const BreadcrumbContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin: 10px 0 15px;
`;

/**
 * Individual breadcrumb item
 */
export const BreadcrumbItem = styled.span<{ $isActive?: boolean }>`
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme, $isActive }) => $isActive ? theme.primary : theme.textPrimary};
  font-weight: ${({ $isActive }) => $isActive ? 600 : 400};
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.primary};
  }
`;

/**
 * Separator between breadcrumb items
 */
export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 2px;
`;