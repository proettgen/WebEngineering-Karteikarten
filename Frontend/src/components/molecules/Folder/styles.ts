import styled from 'styled-components';

export const FolderContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
`;

export const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const FolderTitle = styled.h2`
  margin: 0;
  font-size: 1.5em;
  color: ${({ theme }) => theme.textPrimary};
`;

export const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const AddButton = styled.button`
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

export const EditButtonWrapper = styled.div`
  display: "flex";
  align-items: center;
  gap: 8;
`;