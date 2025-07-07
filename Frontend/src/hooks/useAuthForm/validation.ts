import { checkUsernameAvailability, checkEmailAvailability } from '@/services/authService';

export const validateUsername = async (username: string, mode?: string): Promise<string | undefined> => {
  // In profile mode, empty username is allowed (optional field)
  if (mode === 'profile' && !username.trim()) return undefined;
  
  if (!username.trim()) return "Username is required.";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers and underscores.";
  }
  if (username.length < 3) return "Username must be at least 3 characters long.";
  if (username.length > 20) return "Username cannot exceed 20 characters.";

  // Skip availability check in profile mode (will be handled by backend)
  if (mode === 'profile') return undefined;

  try {
    const isAvailable = await checkUsernameAvailability(username);
    if (!isAvailable) return "Username is already taken.";
  } catch {
    return "Could not verify username. Please try again later.";
  }
  
  return undefined;
};

export const validateEmail = async (email: string, mode?: string): Promise<string | undefined> => {
  // In profile mode, empty email is allowed (optional field)
  if (mode === 'profile' && !email.trim()) return undefined;
  
  if (!email.trim()) return undefined; // Optional field in register mode
  
  const trimmedEmail = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  // Skip availability check in profile mode (will be handled by backend)
  if (mode === 'profile') return undefined;

  try {
    const isAvailable = await checkEmailAvailability(trimmedEmail);
    if (!isAvailable) return "Email is already registered.";
  } catch  {
    return "Could not verify email. Please try again later.";
  }
  
  return undefined;
};

export const validatePassword = (password: string, isRequired: boolean = true): string | undefined => {
  if (!isRequired && !password) return undefined; // Optional password
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (password.length > 100) return "Password cannot exceed 100 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one symbol.";
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return undefined;
};

// Synchronous validation for immediate feedback
export const getSyncValidationError = (
  fieldName: string,
  value: string,
  allValues: Record<string, string>,
  mode?: string
): string | undefined => {
  if (fieldName === 'username') {
    // In profile mode, empty username is allowed
    if (mode === 'profile' && !value.trim()) return undefined;
    if (!value.trim()) return "Username is required.";
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) 
      return "Username can only contain letters, numbers, hyphens (-), and underscores (_).";
    if (value.length < 3) return "Username must be at least 3 characters long.";
    if (value.length > 20) return "Username cannot exceed 20 characters.";
    return undefined;
  } else if (fieldName === 'email') {
    // In profile mode, empty email is allowed
    if (mode === 'profile' && !value.trim()) return undefined;
    if (!value.trim()) return undefined; // Optional in register mode
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) 
      return "Please enter a valid email address.";
    return undefined;
  } else if (fieldName === 'password') {
    return validatePassword(value);
  } else if (fieldName === 'newPassword') {
    // In profile mode, newPassword is optional but if provided, must meet complexity
    return validatePassword(value, false);
  } else if (fieldName === 'currentPassword') {
    if (mode === 'profile' && !value.trim()) return "Current password is required to save changes.";
    if (!value.trim()) return "Password is required.";
    return undefined;
  } else if (fieldName === 'confirmPassword') {
    return validateConfirmPassword(allValues.password || '', value);
  } else {
    return undefined;
  }
};
