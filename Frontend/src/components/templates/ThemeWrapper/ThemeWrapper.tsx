"use client";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./themes";
import { themeType, availableThemes } from "./types";
import Header from "../../organisms/Header/Header";
import Footer from "../../organisms/Footer/Footer";

/*
Der ThemeWrapper verwendet den ThemeProvider von styled-components,
 um das aktuelle Theme (entweder lightTheme oder darkTheme) 
 an alle untergeordneten Komponenten weiterzugeben. 
 Der ThemeProvider stellt das Theme über den React-Kontext zur Verfügung, 
 sodass alle Styled Components auf die Theme-Eigenschaften zugreifen können.

 Für Beispiel siehe: themes.ts
*/

const themeMap: Record<availableThemes, themeType> = {
  lightTheme,
  darkTheme,
};

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<availableThemes>("darkTheme");
  console.log(themeName);
  return (
    <ThemeProvider theme={themeMap[themeName]}>
      <Header setTheme={setThemeName} />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
export default ThemeWrapper;
