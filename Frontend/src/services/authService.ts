/* eslint-disable no-console */
import { AuthFormData } from '@/hooks/useAuthForm';

//REMOVE CONSOLE LOG -> inform user about the error

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// API call to check username availability
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.available; // Assuming API returns { available: boolean }
  } catch (error) {
    console.error('Username availability check failed:', error);
    throw error;
  }
};

// API call to check email availability
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.available; // Assuming API returns { available: boolean }
  } catch (error) {
    console.error('Email availability check failed:', error);
    throw error;
  }
};

// API call to register a new user
export const registerUser = async (userData: AuthFormData): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email || undefined, // Don't send empty email
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Registration failed: ${response.status}`);
    }

    // Assuming successful registration returns user data
    return await response.json();
  } catch (error) {
    console.error('User registration failed:', error);
    throw error;
  }
};

// API call to login user
export const loginUser = async (credentials: Pick<AuthFormData, 'username' | 'password'>): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    return await response.json(); // Return user data and token
  } catch (error) {
    console.error('User login failed:', error);
    throw error;
  }
};