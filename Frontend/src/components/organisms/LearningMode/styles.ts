import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
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
  width: 100%;
  max-width: 800px; // Neue maximale Breite
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;