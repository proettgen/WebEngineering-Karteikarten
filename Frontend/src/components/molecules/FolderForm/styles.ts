import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const SaveButton = styled.button`
  background: ${({ theme }) => theme.accept};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  background: ${({ theme }) => theme.deny};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
`;

export const CancelButton = styled.button`
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
`;