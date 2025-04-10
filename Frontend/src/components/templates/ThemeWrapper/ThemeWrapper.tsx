"use client";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./themes";
import { themeType, availableThemes } from "./types";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import * as SC from "./styles";

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
  return (
    <ThemeProvider theme={themeMap[themeName]}>
      <SC.GlobalStyle />
      <Header themeName={themeName} setTheme={setThemeName} />
      <SC.ContentWrapper>{children}</SC.ContentWrapper>
      <Footer />
    </ThemeProvider>
  );
}
export default ThemeWrapper;
