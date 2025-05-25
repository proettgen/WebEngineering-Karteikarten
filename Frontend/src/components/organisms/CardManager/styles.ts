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

export const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
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

export const AddButtonWrapper = styled.div`
  position: absolute;
  top: 70px;
  right: 42px;
`;