import { themeType } from "./types";

/*Pass die Styled Components in den einzelnen Komponenten so an,
dass sie auf die Theme-Eigenschaften zugreifen.
Bsp: 
background-color: ${({ theme }) => theme.primary};
color: ${({ theme }) => theme.textPrimary};
*/
export const lightTheme: themeType = {
  primary: "#6A5ACD", // Soft lavender
  secondary: "#FFB6C1", // Light pink
  background: "#FAF3E0", // Warm pastel cream
  surface: "#FFFFFF", // Pure white for contrast
  textPrimary: "#2C3E50", // Deep blue-gray
  textSecondary: "#7F8C8D", // Muted gray-blue
  border: "#D3D3D3", // Light gray
  highlight: "#FAD02E", // Soft pastel yellow
  accept: "#77DD77", // Pastel green
  deny: "#FF6961", // Pastel red
};

export const darkTheme: themeType = {
  primary: "#A29BFE", // Soft purple
  secondary: "#E67E99", // Muted pink
  background: "#1E1E2E", // Deep blue-gray
  surface: "#2C2C3A", // Soft dark background
  textPrimary: "#EAEAEA", // Light gray
  textSecondary: "#B0B0B0", // Muted gray
  border: "#4E4E6A", // Desaturated blue-gray
  highlight: "#FFD166", // Warm soft yellow
  accept: "#55A899", // Muted teal green
  deny: "#D95F5F", // Muted red
};
