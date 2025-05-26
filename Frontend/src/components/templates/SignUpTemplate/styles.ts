// styles.ts
import styled, { keyframes } from "styled-components";
import { ThemeType } from "@/components/templates/ThemeWrapper/types"; // Assuming types.ts is in the same directory

interface StyledInputProps {
  theme: ThemeType;
  $hasError?: boolean;
  $isSuccess?: boolean;
}

// Main container for the page, centers the form
export const PageWrapper = styled.div<{ theme: ThemeType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 61px);
  background-color: ${({ theme }) => theme.background};
`;

// The form element itself
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
  > a,
  h1 {
    align-self: center;
  }
`;

// Wrapper for each input field group (label, input, icon, error message)
export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  > div {
    /* Position checkmark icon */
    position: absolute; //maybe relative?
    right: 12px; /* Adjust for desired spacing from the right edge of the input */
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

// Styled text input field
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

// Error message displayed below the input field
export const ErrorMessage = styled.p<{ theme: ThemeType }>`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.deny};
  margin: 0;
  min-height: 1.2em; // Reserve space to prevent layout shifts
`;

// Keyframes for spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled spinner component
export const Spinner = styled.div<{ theme: ThemeType }>`
  border: 3px solid ${({ theme }) => theme.border}40; // Light border
  border-top: 3px solid ${({ theme }) => theme.primary}; // Primary color for the spinning part
  border-radius: 50%;
  width: 18px; // Adjust size as needed
  height: 18px; // Adjust size as needed
  animation: ${spin} 0.8s linear infinite;
  position: absolute;
  right: 12px; // Position it similarly to the success icon
  top: 50%;
  transform: translateY(-50%);
  margin-top: -2px; // Fine-tune vertical alignment if needed, relative to input's top padding
`;
