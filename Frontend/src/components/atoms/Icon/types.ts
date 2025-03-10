import { ReactNode } from "react";
import { themeType } from "@/components/templates/ThemeWrapper/types";

export type ThemeColors = Exclude<keyof themeType, "fontSizes">;

export type IconSize = "s" | "m" | "l" | "xl";

export interface IconProps {
  children: ReactNode;
  size?: IconSize;
  color?: ThemeColors;
  className?: string;
  onClick?: () => void;
}
