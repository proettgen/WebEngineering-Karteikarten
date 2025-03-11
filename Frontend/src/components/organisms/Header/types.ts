import { availableThemes } from "@/components/templates/ThemeWrapper/types";
import { Dispatch, SetStateAction } from "react";

export interface HeaderProps {
  themeName: availableThemes;
  setTheme: Dispatch<SetStateAction<availableThemes>>;
}
