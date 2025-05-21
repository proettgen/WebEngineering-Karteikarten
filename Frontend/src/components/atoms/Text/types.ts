import {
  ThemeType,
  fontSizes,
} from "@/components/templates/ThemeWrapper/types";

export type textWeight = "regular" | "bold";

type themeColors = Exclude<keyof ThemeType, "fontSizes">;

export interface IProps {
  children: string | string[];
  size?: fontSizes;
  color?: themeColors;
  weight?: textWeight;
}
