import styled, { keyframes } from "styled-components";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";

interface StyledInputProps {
  theme: ThemeType;
  $hasError?: boolean;
  $isSuccess?: boolean;
}

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input<StyledInputProps>`
  padding: 12px 40px 12px 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $hasError, $isSuccess }) => {
      if ($hasError) return theme.deny;
      if ($isSuccess) return theme.accept;
      return theme.border;
    }};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  outline: none;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme, $hasError, $isSuccess }) => {
      if ($hasError) return theme.deny;
      if ($isSuccess) return theme.accept;
      return theme.primary;
    }};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError, $isSuccess }) => {
        if ($hasError) return `${theme.deny}40`;
        if ($isSuccess) return `${theme.accept}40`;
        return `${theme.primary}40`;
      }};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;

export const ErrorMessage = styled.p<{ theme: ThemeType }>`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.deny};
  margin: 0;
  min-height: 1.2em;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{ theme: ThemeType }>`
  border: 3px solid ${({ theme }) => theme.border}40;
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 0.8s linear infinite;
  position: absolute;
  right: 12px;
  top: 15%;
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 15%;
  pointer-events: none;
`;