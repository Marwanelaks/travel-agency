import api from './api';

type LoginCredentials = {
  email: string;
  password: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

// Store token in localStorage
const TOKEN_KEY = 'auth_token';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/login', credentials, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token); // Store token after login
      // Update axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>('/user');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user', error);
    // Clear token if request fails
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    // Clear token from storage and axios headers
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
    
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  }
};
