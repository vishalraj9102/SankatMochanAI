export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  search_count?: number;
  last_login?: string;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface GoogleLoginCredentials {
  token: string;
} 