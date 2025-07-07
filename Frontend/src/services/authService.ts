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
export const loginUser = async (data: AuthFormData): Promise<any> => await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

// API call to get get Login status
export const validLogin = async (): Promise<{validLogin: boolean}> => await request('/auth/valid-login', {
    credentials: 'include',
  });

export const logoutUser = async (): Promise<void> => {
  await request('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })}

export const getProfile = async (): Promise<{id: string, username: string, email?: string, created_at: string, updated_at: string}> => {
  const data = await request('/auth/profile', {
    method: 'GET',
    credentials: 'include',
  });
  return data as {id: string, username: string, email?: string, created_at: string, updated_at: string};
};

// API call to update user profile
export const updateProfile = async (updateData: {
  username?: string;
  email?: string;
  newPassword?: string;
  currentPassword: string;
}): Promise<any> =>
  await request('/auth/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });

// API call to delete the current user account
export const deleteUser = async (): Promise<void> => {
  await request('/auth/delete', {
    method: 'DELETE',
    credentials: 'include',
  });
};