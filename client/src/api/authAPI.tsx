import { AuthService } from '../utils/auth';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      AuthService.setToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    AuthService.removeToken();
  }
};

export default authAPI;