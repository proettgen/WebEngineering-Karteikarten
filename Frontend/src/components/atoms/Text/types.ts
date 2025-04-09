import {
  themeType,
  fontSizes,
} from "@/components/templates/ThemeWrapper/types";

export type textWeight = "regular" | "bold";

type themeColors = Exclude<keyof themeType, "fontSizes">;

export interface IProps {
  children: string;
  size?: fontSizes;
  color?: themeColors;
  weight?: textWeight;
  compact?: boolean;
}
