"use client";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./themes";
import { themeType, availableThemes } from "./types";
import Header from "../../organisms/Header/Header";
import Footer from "../../organisms/Footer/Footer";

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
