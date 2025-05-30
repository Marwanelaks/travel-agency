import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewPage } from '@/components/dashboard/OverviewPage';
import { ProductsPage } from '@/components/dashboard/ProductsPage';
import { HotelsPage } from '@/components/dashboard/HotelsPage';
import { ApiDocsPage } from '@/components/dashboard/ApiDocsPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersList from '@/components/users/UsersList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductDetailPage } from './ProductDetailPage';
import { CreateProductPage } from './CreateProductPage';
import { EditProductPage } from './EditProductPage';
import { HotelDetailPage } from './HotelDetailPage';
import { CreateHotelPage } from './CreateHotelPage';
import { EditHotelPage } from './EditHotelPage';
import { HotelRoomsPage } from './HotelRoomsPage';
import { FlightsPage } from './FlightsPage';
import SettingsPage from './dashboard/SettingsPage';
import OrdersPage from './dashboard/OrdersPage';
import OrderDetailPage from './dashboard/OrderDetailPage';
import SubSuperAdminDashboard from './dashboard/SubSuperAdminDashboard';
import ManageSellersPage from './dashboard/ManageSellersPage';
import { useAuth } from '@/hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <Routes>
        {/* For SubSuperAdmin, show their specific dashboard */}
        <Route index element={
          user?.role === 'SubSuperAdmin' ? <SubSuperAdminDashboard /> : <OverviewPage />
        } />
        
        {/* Products Routes */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<CreateProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        
        {/* Hotels Routes */}
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="hotels/new" element={<CreateHotelPage />} />
        <Route path="hotels/:id/rooms" element={<HotelRoomsPage />} />
        <Route path="hotels/:id/edit" element={<EditHotelPage />} />
        <Route path="hotels/:id" element={<HotelDetailPage />} />
        
        {/* Flights Routes */}
        <Route path="flights" element={<FlightsPage />} />
        
        {/* Orders Routes */}
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        
        {/* Sub-Super Admin Routes */}
        <Route path="sub-admin" element={
          user?.role === 'SubSuperAdmin' ? <SubSuperAdminDashboard /> : <Navigate to="/dashboard" />
        } />
        <Route path="manage-sellers" element={
          user?.role === 'SubSuperAdmin' ? <ManageSellersPage /> : <Navigate to="/dashboard" />
        } />
        
        {/* Settings Route */}
        <Route path="settings" element={<SettingsPage />} />
        
        <Route path="users" element={
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
              <p className="text-muted-foreground">Manage your users and their permissions</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersList />
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="api-docs" element={<ApiDocsPage />} />
        <Route path="settings" element={
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">Manage your account and application settings</p>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-medium">Application Settings</h3>
              <p className="text-muted-foreground mt-2">Configure system-wide settings and preferences</p>
            </Card>
          </div>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;
