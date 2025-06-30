import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  background: ${({ theme }) => theme.surface};
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
  min-width: 460px;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;