import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersList from '@/components/users/UsersList';
import UserForm from '@/components/users/UserForm';
import UserDetailPage from './UserDetailPage';

const UsersPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="new" element={<UserForm />} />
      <Route path=":id" element={<UserDetailPage />} />
      <Route path=":id/edit" element={<UserForm isEditing />} />
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
};

export default UsersPage;
