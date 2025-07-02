import { request } from './httpClient';
import { AuthFormData } from '@/hooks/useAuthForm';

// API call to check username availability
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const data = await request<{ available: boolean }>('/auth/check-username', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  return data.available;
};

// API call to check email availability
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const data = await request<{ available: boolean }>('/auth/check-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return data.available;
};

// API call to register a new user
export const registerUser = async (userData: AuthFormData): Promise<any> =>
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: userData.username,
      email: userData.email || undefined,
      password: userData.password,
    }),
  });

// API call to login user
export const loginUser = async (credentials: AuthFormData): Promise<any> =>
  await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password,
    }),
  });