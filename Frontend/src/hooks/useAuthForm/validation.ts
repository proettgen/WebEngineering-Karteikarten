import { checkUsernameAvailability, checkEmailAvailability } from '@/services/authService';

export const validateUsername = async (username: string): Promise<string | undefined> => {
  if (!username.trim()) return "Username is required.";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers and underscores.";
  }
  if (username.length < 3) return "Username must be at least 3 characters long.";
  if (username.length > 20) return "Username cannot exceed 20 characters.";

  try {
    const isAvailable = await checkUsernameAvailability(username);
    if (!isAvailable) return "Username is already taken.";
  } catch {
    return "Could not verify username. Please try again later.";
  }
  
  return undefined;
};

export const validateEmail = async (email: string): Promise<string | undefined> => {
  if (!email.trim()) return undefined; // Optional field
  
  const trimmedEmail = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  try {
    const isAvailable = await checkEmailAvailability(trimmedEmail);
    if (!isAvailable) return "Email is already registered.";
  } catch  {
    return "Could not verify email. Please try again later.";
  }
  
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
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
  allValues: Record<string, string>
): string | undefined => {
  switch (fieldName) {
    case 'username':
      if (!value.trim()) return "Username is required.";
      if (!/^[a-zA-Z0-9_-]+$/.test(value)) 
        return "Username can only contain letters, numbers, hyphens (-), and underscores (_).";
      if (value.length < 3) return "Username must be at least 3 characters long.";
      if (value.length > 20) return "Username cannot exceed 20 characters.";
      return undefined;
    
    case 'email':
      if (!value.trim()) return undefined; // Optional
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) 
        return "Please enter a valid email address.";
      return undefined;
    
    case 'password':
      return validatePassword(value);
    
    case 'confirmPassword':
      return validateConfirmPassword(allValues.password || '', value);
    
    default:
      return undefined;
  }
};