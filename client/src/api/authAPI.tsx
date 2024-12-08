// src/api/authAPI.tsx
import axios from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      '/api/auth/login',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login request failed');
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    await axios.get('/api/auth/verify');
    return true;
  } catch {
    return false;
  }
};