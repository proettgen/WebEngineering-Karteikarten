import { ReactNode } from "react";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accept"
  | "deny" ;

export interface ButtonProps {
  $variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
}
