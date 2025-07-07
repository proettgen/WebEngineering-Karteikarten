import { AvailableThemes } from "@/components/templates/ThemeWrapper/types";
import { Dispatch, SetStateAction } from "react";

export interface HeaderProps {
  themeName: AvailableThemes;
  setTheme: Dispatch<SetStateAction<AvailableThemes>>;
}
