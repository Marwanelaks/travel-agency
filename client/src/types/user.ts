export type UserRole = 'SuperAdmin' | 'SubSuperAdmin' | 'Seller' | 'Customer' | 'Random buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  // New fields for sub-super admin
  manager_id?: string; // For sellers under a sub-super admin
  managed_sellers?: User[]; // For sub-super admins managing sellers
  department?: string; // Optional department name for sub-super admin
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
