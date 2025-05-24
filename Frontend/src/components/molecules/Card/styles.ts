import styled from 'styled-components';

export const CardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 28vw;
  margin-bottom: 20px;
`;

export const Card = styled.div<{ $isFlipped: boolean }>`
  width: 100%;
  height: 30vh;
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
  border: 3px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 24px 20px 56px 20px; 
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  overflow: hidden;
`;

export const CardFront = styled(CardSide)``;

export const CardBack = styled(CardSide)`
  transform: rotateY(180deg);
`;

export const FlipButtonWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const EditButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16px;
  display: flex;
  justify-content: center;
`;

export const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

// für die Frage- und Antwort-Anzeigeüberschrift
export const SectionTitleWrapper = styled.div` 
  margin-bottom: 8px;
`;

export const MainTextWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
  text-align: center;
  /* Kein Flex-Layout mehr nötig */
`;

export const FlipButton = styled.button`
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