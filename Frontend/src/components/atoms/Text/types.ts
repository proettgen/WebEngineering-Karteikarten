import {
  ThemeType,
  FontSizes,
} from "@/components/templates/ThemeWrapper/types";

export type textWeight = "regular" | "bold";

type themeColors = Exclude<keyof ThemeType, "FontSizes">;

export interface IProps {
  children: string | string[];
  size?: FontSizes;
  color?: themeColors;
  weight?: textWeight;
}
