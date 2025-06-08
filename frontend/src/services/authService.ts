import { api } from './api';
import { AuthResponse, LoginCredentials, SignupCredentials, GoogleLoginCredentials, User } from '../types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
  }

  async googleLogin(credentials: GoogleLoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }
}

export const authService = new AuthService(); 