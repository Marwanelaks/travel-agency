import { useState, useCallback } from 'react';
import { User, getUsers, getUser, createUser, updateUser, deleteUser, toggleUserStatus } from '@/services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await getUser(id);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData: Parameters<typeof createUser>[0]) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const editUser = useCallback(async (id: string, userData: Parameters<typeof updateUser>[1]) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateUser(id, userData);
      setUsers(prev => prev.map(user => (user.id === id ? updatedUser : user)));
      if (currentUser?.id === id) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const removeUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      if (currentUser?.id === id) {
        setCurrentUser(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const toggleStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await toggleUserStatus(id);
      setUsers(prev => prev.map(user => (user.id === id ? updatedUser : user)));
      if (currentUser?.id === id) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle user status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUser,
    addUser,
    editUser,
    removeUser,
    toggleStatus,
  };
};

export default useUsers;
