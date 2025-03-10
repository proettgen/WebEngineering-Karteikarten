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

export const AddButton = styled.button`
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.onPrimary};
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

export const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;