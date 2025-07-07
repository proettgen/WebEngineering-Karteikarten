import { ReactNode } from "react";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";

export type ThemeColors = Exclude<keyof ThemeType, "FontSizes">;

export type IconSize = "s" | "m" | "l" | "xl";

export type CursorType = "pointer" | "default" | "not-allowed" | "help"; // Add more as needed

export interface IconProps {
  children: ReactNode;
  size: IconSize;
  color: ThemeColors;
  onClick?: () => void;
  cursorStyle?: CursorType;
}
