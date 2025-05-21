import { ThemeType } from "./types";

/*Adjust the styled components in the individual components
so that they access the theme properties.
Example:
background-color: ${({ theme }) => theme.primary};
color: ${({ theme }) => theme.textPrimary};
*/

export const lightTheme: ThemeType = {
  primary: "#2563eb", // Blue-600
  secondary: "#fbbf24", // Amber-400
  background: "#f3f4f6", // Gray-100
  surface: "#ffffff", // White
  textPrimary: "#1e293b", // Slate-800
  textSecondary: "#64748b", // Slate-400
  border: "#e5e7eb", // Gray-200
  highlight: "#bae6fd", // Sky-200
  accept: "#22c55e", // Green-500
  deny: "#ef4444", // Red-500
  fontSizes: {
    small: "0.875rem",
    medium: "1.25rem",
    large: "1.5rem",
    xlarge: "1.875rem",
  },
};

export const darkTheme: ThemeType = {
  primary: "#3b82f6", // Blue-500
  secondary: "#fbbf24", // Amber-400
  background: "#18181b", // Zinc-900
  surface: "#23232a", // Slightly lighter than background
  textPrimary: "#f4f4f5", // Zinc-100
  textSecondary: "#a1a1aa", // Zinc-400
  border: "#27272a", // Zinc-800
  highlight: "#2563eb", // Blue-600
  accept: "#22d3ee", // Cyan-400
  deny: "#ef4444", // Red-500
  fontSizes: {
    small: "0.875rem",
    medium: "1.25rem",
    large: "1.5rem",
    xlarge: "1.875rem",
  },
};
