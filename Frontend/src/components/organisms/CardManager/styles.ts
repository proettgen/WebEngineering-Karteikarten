import styled from "styled-components";

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  padding: 0;
`;

export const CardsWrapper = styled.div`
  padding: 22px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  margin: 0;
`;

export const AddButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.highlight};
  }
`;

export const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
`;
