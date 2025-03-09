import { LinkProps as NextLinkProps } from "next/link";
import { themeType } from "@/components/templates/ThemeWrapper/types";

export type ColorOptions = keyof Pick<
  themeType,
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary"
  | "highlight"
  | "accept"
  | "deny"
>;

export type SizeOptions = keyof themeType["fontSizes"];

export interface LinkProps extends Omit<NextLinkProps, "as"> {
  children: React.ReactNode;
  color?: ColorOptions;
  size?: SizeOptions;
  className?: string;
}

export interface StyledLinkProps {
  color: ColorOptions;
  size: SizeOptions;
}
