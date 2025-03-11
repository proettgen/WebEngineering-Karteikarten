import styled from "styled-components";
import { ButtonVariant } from "./types";

export const Button = styled.button<{
  $variant?: ButtonVariant;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.border};
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  background-color: ${({ theme, $variant }) => {
    if ($variant === "secondary") return theme.secondary;
    else if ($variant === "accept") return theme.accept;
    else if ($variant === "deny") return theme.deny;
    return theme.primary;
  }};

  color: ${({ theme, $variant }) => {
    if ($variant === "secondary") return theme.textPrimary;
    return theme.surface;
  }};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
