/**
 * Authentication Types - Frontend
 * 
 * Type definitions for authentication operations.
 * These types are synchronized with Backend/src/types/authTypes.ts
 * 
 * NOTE: Keep these types synchronized with backend types manually when backend changes.
 */

// =============================================================================
// CORE AUTH TYPES
// =============================================================================

/**
 * User entity as returned by the API
 */
export interface User {
  id: string;
  username: string;
  email?: string; // Optional email
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

/**
 * Login credentials input
 */
export interface LoginInput {
  usernameOrEmail: string; // Can be username or email
  password: string;
}

/**
 * Registration input data
 */
export interface RegisterInput {
  username: string;
  email?: string; // Optional email
  password: string;
}

/**
 * Profile update input data
 */
export interface ProfileUpdateInput {
  username?: string;
  email?: string;
  newPassword?: string;
  currentPassword: string; // Always required for updates
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Login success response
 */
export interface LoginResponse {
  status: 'success';
  message: string;
  data: {
    user: User;
  };
}

/**
 * Registration success response
 */
export interface RegisterResponse {
  status: 'success';
  message: string;
  data: {
    user: User;
  };
}

/**
 * Profile response
 */
export interface ProfileResponse {
  status: 'success';
  data: {
    user: User;
  };
}

/**
 * Login validation response
 */
export interface LoginValidationResponse {
  validLogin: boolean;
}

/**
 * Username/Email availability check response
 */
export interface AvailabilityResponse {
  available: boolean;
}

// =============================================================================
// ERROR RESPONSE TYPES
// =============================================================================

/**
 * Authentication error response
 */
export interface AuthErrorResponse {
  status: 'error';
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// =============================================================================
// FRONTEND-SPECIFIC TYPES
// =============================================================================

/**
 * Authentication context state
 */
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (_credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (_data: RegisterInput) => Promise<void>;
  updateProfile: (_data: ProfileUpdateInput) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

/**
 * Auth form state for React components
 */
export interface AuthFormState {
  usernameOrEmail: string;
  username?: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  currentPassword?: string;
}

/**
 * Auth form validation errors
 */
export interface AuthFormErrors {
  usernameOrEmail?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
  general?: string;
}
