import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 100px);
`;

export const Title = styled.h1`
  margin-bottom: 10px;
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
`;

export const Question = styled.h2`
  margin-bottom: 20px;
`;

export const Answer = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

export const LearningContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const TopRow = styled.div`
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const HintWrapper = styled.span`
  display: inline-block;
`;

export const HintArea = styled.div`
  min-height: 24px;
  margin-top: 8px;
`;