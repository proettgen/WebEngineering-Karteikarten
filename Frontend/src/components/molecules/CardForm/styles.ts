import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px 28px;
  background: ${({ theme }) => theme.surface};
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  max-width: 500px;
  margin: 0 auto;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;