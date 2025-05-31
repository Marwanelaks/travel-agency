import api from './api';
import { User, UserRole } from '@/types/user';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  manager_id?: string; // Optional manager ID for sellers
  department?: string; // Optional department for sub-super admin
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password_confirmation'>> {
  current_password?: string;
  password_confirmation?: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<{ data: User[] }>('/users');
    return response.data.data;
  } catch (error: any) {
    // Log the entire error object
    console.error('Error fetching users:', error);
    // Log the response body and status if available
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const getUser = async (id: string): Promise<User> => {
  try {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    // Fallback to mock data for demo purposes
    // In production, this should be removed and the error should be properly handled
    console.warn('Using mock user data as fallback');
    
    // Mock data for demo purposes
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'SuperAdmin' as UserRole,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Seller' as UserRole,
        created_at: '2025-01-02T00:00:00.000Z',
        updated_at: '2025-01-02T00:00:00.000Z'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'Customer' as UserRole,
        created_at: '2025-01-03T00:00:00.000Z',
        updated_at: '2025-01-03T00:00:00.000Z'
      }
    ];
    
    const mockUser = mockUsers.find(user => user.id === id);
    if (mockUser) {
      return mockUser;
    }
    
    // If no matching mock user, create one with the requested ID
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      role: 'Customer' as UserRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await api.post<{ data: User }>('/users', userData);
  return response.data.data;
};

export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  const response = await api.put<{ data: User }>(`/users/${id}`, userData);
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const response = await api.post<{ data: User }>(`/users/${id}/toggle-status`);
  return response.data.data;
};

// Sub-Super Admin specific functions

// Get all sellers managed by a sub-super admin
export const getManagedSellers = async (managerId: string): Promise<User[]> => {
  const response = await api.get<{ data: User[] }>(`/users/managed-by/${managerId}`);
  return response.data.data;
};

// Assign a seller to a sub-super admin
export const assignSellerToManager = async (sellerId: string, managerId: string): Promise<User> => {
  const response = await api.post<{ data: User }>(`/users/${sellerId}/assign-manager/${managerId}`);
  return response.data.data;
};

// Remove a seller from a sub-super admin
export const removeSellerFromManager = async (sellerId: string): Promise<User> => {
  const response = await api.post<{ data: User }>(`/users/${sellerId}/remove-manager`);
  return response.data.data;
};

// Get all orders for the sellers managed by a sub-super admin
export const getManagedSellerOrders = async (managerId: string, page: number = 1): Promise<any> => {
  const response = await api.get(`/orders/managed-by/${managerId}`, {
    params: { page }
  });
  return response.data;
};
