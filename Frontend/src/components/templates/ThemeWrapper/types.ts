export type ThemeType = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  highlight: string;
  accept: string;
  deny: string;
  fontSizes: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
};

export type fontSizes = keyof ThemeType["fontSizes"];

export type availableThemes = "lightTheme" | "darkTheme";
