import React, { useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthContext, AuthContextType } from '../hooks/useAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${import.meta.env.VITE_API_URL}/user`)
        .then(res => setUser(res.data))
        .catch(() => logout());
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    // Optionally fetch user info
    const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
    setUser(userRes.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
