"use client";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./themes";
import { themeType, availableThemes } from "./types";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import * as SC from "./styles";

/*
The ThemeWrapper uses the ThemeProvider from styled-components
to pass the current theme (either lightTheme or darkTheme)
to all child components.
The ThemeProvider provides the theme via the React context,
allowing all styled components to access the theme properties.

For example, see: themes.ts
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
