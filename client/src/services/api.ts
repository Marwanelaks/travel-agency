import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withXSRFToken: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Always attach Bearer token if present
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // Debug log: show token being used
      console.debug('Using auth token for Authorization header:', token);
    } else {
      console.debug('No auth_token found in localStorage');
    }
    
    // Add XSRF-TOKEN header for CSRF protection
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get cookie by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Response interceptor to handle token refresh and common errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If this is a login request, don't try to refresh token
      if (originalRequest.url?.includes('/login')) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const response = await axios.post<{ token: string }>(
          `${API_BASE_URL}/refresh-token`, 
          {},
          { withCredentials: true }
        );
        
        const { token } = response.data;
        if (token) {
          localStorage.setItem('token', token);
          
          // Update the Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If we get here, token refresh failed or token was invalid
      localStorage.removeItem('token');
      window.location.href = '/login?session=expired';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }
    
    // Handle other errors
    const status = error.response?.status;
    if (status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    } else if (status === 404) {
      console.error('Resource not found');
    } else if (status && status >= 500) {
      console.error('Server error occurred');
    } else if (!status) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;
