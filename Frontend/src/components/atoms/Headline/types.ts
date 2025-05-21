import { ThemeType } from "@/components/templates/ThemeWrapper/types";
import React from "react";

export type HeadlineSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type HeadlineWeight = "regular" | "bold";

type ThemeColors = Exclude<keyof ThemeType, "fontSizes">;

export interface IProps {
  children: React.ReactNode;
  size?: HeadlineSize;
  color?: ThemeColors;
  weight?: HeadlineWeight;
  compact?: boolean;
  tag?: React.ElementType;
}
