import { LinkProps as NextLinkProps } from "next/link";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";
import React from "react";

export type ColorOptions = Exclude<keyof ThemeType, "fontSizes">;

export type SizeOptions = keyof ThemeType["fontSizes"];

export interface LinkProps extends Omit<NextLinkProps, "as"> {
  children: React.ReactNode;
  color?: ColorOptions;
  size?: SizeOptions;
  openNewTab?: boolean;
  underlineOnHover?: boolean;
}

export interface StyledLinkProps {
  color: ColorOptions;
  size: SizeOptions;
  $underlineOnHover?: boolean;
}
