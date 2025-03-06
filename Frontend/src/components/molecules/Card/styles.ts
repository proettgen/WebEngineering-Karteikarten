import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 20px;
  width: 30%;
  box-sizing: border-box;
  text-align: center;
`;

export const Title = styled.h2`
  margin: 0 0 10px 0;
`;

export const Question = styled.p`
  margin: 0 0 10px 0;
  font-weight: bold;
`;

export const Answer = styled.p`
  margin: 0 0 10px 0;
`;

export const Tags = styled.div`
  margin-top: 10px;
  font-size: 0.9em;
  color: ${({ theme }) => theme.textSecondary};
`;

export const ToggleAnswerButton = styled.button`
  margin-top: 10px;
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