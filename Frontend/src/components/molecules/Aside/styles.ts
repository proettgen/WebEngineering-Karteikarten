import styled from 'styled-components';

export const AsideContainer = styled.aside`
  position: sticky;
  top: 0;
  left: 0;
  width: 280px;
  min-width: 220px;
  max-width: 25vw;
  height: 100vh;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.highlight};
    color: ${({ theme }) => theme.textPrimary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

export const FoldersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FolderItem = styled.li<{ isSelected: boolean }>`
  border-radius: 0.25rem;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.highlight : 'transparent'};

  &:hover {
    background-color: ${({ isSelected, theme }) =>
      isSelected ? theme.highlight : theme.border};
  }
`;

export const FolderButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.primary : theme.textPrimary};
  cursor: pointer;
  text-align: left;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

export const FolderName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FolderIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
`;

export const ChevronIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CurrentFolderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const CurrentFolderTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.textPrimary};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;