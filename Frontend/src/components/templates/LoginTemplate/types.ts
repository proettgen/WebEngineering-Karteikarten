// types.ts

// Defines the structure of the theme object provided by ThemeProvider
// This is identical to the one in the RegisterPageTemplate,
// ensuring consistency if you have a shared theme definition.
export interface ThemeType {
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
}

// Defines the structure for the login form data
export interface LoginFormData {
  identifier: string; // For username or email
  password: string;
}

// Defines the structure for validation errors on the login form
export type LoginFormErrors = {
  [K in keyof LoginFormData]?: string;
};

// Defines the structure for touched fields on the login form
export type LoginFormTouched = {
  [K in keyof LoginFormData]?: boolean;
};

// Defines the structure for success status of fields on the login form
export type LoginFormSuccess = {
  [K in keyof LoginFormData]?: boolean;
};

// Props for the LoginPageTemplate component
export interface LoginPageTemplateProps {
  // Example: onLogin: (data: LoginFormData) => Promise<void>;
  // Example: isLoading: boolean;
  // Kept simple as logic is internal for this example.
}
