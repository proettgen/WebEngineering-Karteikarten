import { request } from './httpClient';
import { AuthFormData } from '@/hooks/useAuthForm';
import type { 
  User, 
  LoginValidationResponse, 
  AvailabilityResponse,
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
  ProfileUpdateInput
} from '@/database/authTypes';

// API call to check username availability
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const data = await request<AvailabilityResponse>('/auth/check-username', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  return data.available;
};

// API call to check email availability
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const data = await request<AvailabilityResponse>('/auth/check-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return data.available;
};

// API call to register a new user
export const registerUser = async (userData: AuthFormData): Promise<RegisterResponse> => {
  const data = await request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: userData.username,
      email: userData.email || undefined,
      password: userData.password,
    }),
  });
  return data;
};

// API call to login user
export const loginUser = async (data: AuthFormData): Promise<LoginResponse> => {
  const response = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response;
};

// API call to get get Login status
export const validLogin = async (): Promise<LoginValidationResponse> => await request('/auth/valid-login', {
    credentials: 'include',
  });

export const logoutUser = async (): Promise<void> => {
  await request('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })}

export const getProfile = async (): Promise<User> => {
  const data = await request<ProfileResponse>('/auth/profile', {
    method: 'GET',
    credentials: 'include',
  });
  return data.data.user;
};

// API call to update user profile
export const updateProfile = async (updateData: ProfileUpdateInput): Promise<ProfileResponse> => {
  const data = await request<ProfileResponse>('/auth/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });
  return data;
};

// API call to delete the current user account
export const deleteUser = async (): Promise<void> => {
  await request('/auth/delete', {
    method: 'DELETE',
    credentials: 'include',
  });
};