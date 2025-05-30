import React, { useCallback } from 'react';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, getCurrentUser, logout as logoutService } from '@/services/authService';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data when token exists
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      console.debug('Loaded auth_token from localStorage:', token);
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        console.debug('Removed auth_token from localStorage (invalid user)');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      console.debug('Removed auth_token from localStorage (error)');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is logged in on initial load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const { token } = await loginService({ email, password });
      localStorage.setItem('auth_token', token);
      console.debug('Saved auth_token to localStorage:', token);
      // Fetch user after login
      const userData = await getCurrentUser();
      setUser(userData);
      navigate('/welcome');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      // Always clear local state and token, even if server logout fails
      setUser(null);
      localStorage.removeItem('auth_token');
      console.debug('Removed auth_token from localStorage (logout)');
      navigate('/');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider };



