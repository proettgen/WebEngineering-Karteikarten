import { LinkProps as NextLinkProps } from "next/link";
import { themeType } from "@/components/templates/ThemeWrapper/types";

export type ColorOptions = Exclude<keyof themeType, "fontSizes">;

export type SizeOptions = keyof themeType["fontSizes"];

export interface LinkProps extends Omit<NextLinkProps, "as"> {
  children: React.ReactNode;
  color?: ColorOptions;
  size?: SizeOptions;
}

export interface StyledLinkProps {
  color: ColorOptions;
  size: SizeOptions;
}
