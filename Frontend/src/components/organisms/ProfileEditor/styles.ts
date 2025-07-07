import styled from "styled-components";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";

export const FormContainer = styled.form<{ theme: ThemeType }>`
  background-color: ${({ theme }) => theme.surface};
  padding: 32px 40px;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  > h1 {
    align-self: center;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
    > button {
        flex: 1;
        width: 120px;
  }
`;

export const HelperText = styled.div<{ theme: ThemeType }>`
  color: ${({ theme }) => theme.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-top: -8px;
  margin-bottom: 8px;
`;