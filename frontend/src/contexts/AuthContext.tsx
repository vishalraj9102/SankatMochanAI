import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/auth';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  googleLogin: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      authService.getCurrentUser()
        .then(user => {
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          Cookies.remove('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { user, access_token } = await authService.login({ email, password });
      Cookies.set('token', access_token, { expires: 7 });
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      const { user, access_token } = await authService.signup({ email, password, name });
      Cookies.set('token', access_token, { expires: 7 });
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      throw err;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    navigate('/login');
  };

  const googleLogin = async (token: string) => {
    try {
      setError(null);
      const { user, access_token } = await authService.googleLogin({ token });
      Cookies.set('token', access_token, { expires: 7 });
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during Google login');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 