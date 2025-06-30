import styled from 'styled-components';

export const CardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 24vw;
  margin-bottom: 20px;
`;

export const Card = styled.div<{ $isFlipped: boolean }>`
  width: 100%;
  height: 45vh;
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
  padding: 24px 20px 72px 20px;
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

export const SectionTitleWrapper = styled.div` 
  margin-bottom: 8px;
`;

export const MainTextWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
  text-align: center;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
    
    &:hover {
      background: ${({ theme }) => theme.textSecondary};
    }
  }
  
  /* Fade-out effect at the bottom */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(transparent, ${({ theme }) => theme.surface});
    pointer-events: none;
  }
`;

export const FlipButton = styled.button`
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.onPrimary};
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  z-index: 10;
  transition: background-color 0.2s, box-shadow 0.2s;
  
  /* Ensure button is always interactive */
  pointer-events: auto;
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    border-color: ${({ theme }) => theme.textSecondary};
  }

  &:active {
    transform: scale(0.95);
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

// Text truncation utility for long texts
export const TruncatedText = styled.div<{ $isExpanded?: boolean; $maxLines?: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${({ $isExpanded, $maxLines = 4 }) => $isExpanded ? 'unset' : $maxLines};
  -webkit-box-orient: vertical;
  overflow: ${({ $isExpanded }) => $isExpanded ? 'visible' : 'hidden'};
  text-overflow: ellipsis;
  line-height: 1.4;
  
  ${({ $isExpanded }) => $isExpanded && `
    overflow-y: auto;
    max-height: 200px;
    padding-right: 8px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.2);
      border-radius: 2px;
    }
  `}
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;