"use client";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./themes";
import { ThemeType, AvailableThemes } from "./types";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import * as SC from "./styles";
import { AuthProvider } from "@/context/AuthContext";

/*
The ThemeWrapper uses the ThemeProvider from styled-components
to pass the current theme (either lightTheme or darkTheme)
to all child components.
The ThemeProvider provides the theme via the React context,
allowing all styled components to access the theme properties.

For example, see: themes.ts
*/

const themeMap: Record<AvailableThemes, ThemeType> = {
  lightTheme,
  darkTheme,
};

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<AvailableThemes>("darkTheme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("themeName");
    if (saved === "lightTheme" || saved === "darkTheme") {
      setThemeName(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("themeName", themeName);
    }
  }, [themeName, mounted]);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <ThemeProvider theme={themeMap[themeName]}>
      <SC.GlobalStyle />
      <AuthProvider>
        <Header themeName={themeName} setTheme={setThemeName} />
        <SC.ContentWrapper>{children}</SC.ContentWrapper>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
};
export default ThemeWrapper;
