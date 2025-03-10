import styled from 'styled-components';

export const CardContainer = styled.div`
  perspective: 1000px;
  width: 30%;
  margin-bottom: 20px;
`;

export const Card = styled.div<{ $isFlipped: boolean }>`
  width: 100%;
  height: 300px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${({ $isFlipped }) => ($isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

export const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const CardFront = styled(CardSide)``;

export const CardBack = styled(CardSide)`
  transform: rotateY(180deg);
`;

export const Title = styled.h2`
  margin: 0 0 10px 0;
`;

export const SmallText = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.textSecondary};
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

export const ToggleButton = styled.button`
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

export const EditButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.onSecondary};
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.secondaryHover};
  }
`;