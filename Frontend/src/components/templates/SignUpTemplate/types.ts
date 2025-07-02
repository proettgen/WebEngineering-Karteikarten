// Defines the structure for the form data
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Defines the structure for validation errors
// Each field can have a string message if there's an error, or be undefined/empty
export type RegisterFormErrors = {
  [K in keyof RegisterFormData]?: string;
};

// Defines the structure for touched fields
export type RegisterFormTouched = {
  [K in keyof RegisterFormData]?: boolean;
};

// Defines the structure for success status of fields
export type RegisterFormSuccess = {
  [K in keyof RegisterFormData]?: boolean;
};

// Defines the structure for the loading state of individual fields
export type FieldLoadingState = {
  [K in keyof RegisterFormData]?: boolean;
};

// Props for the RegisterPageTemplate component (if any were needed for a pure template)
// For this implementation, as it includes form logic, it's more self-contained.
// If it were a pure template, it might take organisms as children or props.
export interface RegisterPageTemplateProps {
  // Example: onRegister: (data: RegisterFormData) => Promise<void>;
  // Example: initialLoading: boolean;
  // For now, we'll keep it simple as the logic is internal.
}
