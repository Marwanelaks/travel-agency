import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewPage } from '@/components/dashboard/OverviewPage';
import { ProductsPageEnhanced } from '@/components/dashboard/ProductsPageEnhanced';
import { CreateProductForm } from '@/components/dashboard/CreateProductForm';
import { EditProductForm } from '@/components/dashboard/EditProductForm';
import { HotelsPageEnhanced } from '@/components/dashboard/HotelsPageEnhanced';
import { CreateHotelForm } from '@/components/dashboard/CreateHotelForm';
import { EditHotelForm } from '@/components/dashboard/EditHotelForm';
import { FlightsPageEnhanced } from '@/components/dashboard/FlightsPageEnhanced';
import { CreateFlightForm } from '@/components/dashboard/CreateFlightForm';
import { EditFlightForm } from '@/components/dashboard/EditFlightForm';
import { UserManagementPageEnhanced } from '@/components/dashboard/UserManagementPageEnhanced';
import { EditUserForm } from '@/components/dashboard/EditUserForm';
import { UserDetailsView } from '@/components/dashboard/UserDetailsView';
import { AnalyticsPage } from '@/components/dashboard/AnalyticsPage';
import { ReportsPage } from '@/components/dashboard/ReportsPage';
import { CalendarPage } from '@/components/dashboard/CalendarPage';
import { SubSuperAdminDashboard } from '../components/dashboard/SubSuperAdminDashboard';
import { useAuth } from '@/hooks/useAuth';

export const DashboardRoutes: React.FC = () => {
  const { user } = useAuth();
  const isSubSuperAdmin = user?.role === 'SubSuperAdmin';

  return (
    <Routes>
      <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
        {/* Dashboard landing - conditionally renders based on user role */}
        <Route index element={isSubSuperAdmin ? <SubSuperAdminDashboard /> : <OverviewPage />} />
        
        {/* Enhanced Pages */}
        <Route path="products-enhanced" element={<ProductsPageEnhanced />} />
        <Route path="products-enhanced/new" element={<CreateProductForm />} />
        <Route path="products-enhanced/:id" element={<ComingSoon title="Product Details" />} />
        <Route path="products-enhanced/:id/edit" element={<EditProductForm />} />
        
        <Route path="hotels-enhanced" element={<HotelsPageEnhanced />} />
        <Route path="hotels-enhanced/new" element={<CreateHotelForm />} />
        <Route path="hotels-enhanced/:id" element={<ComingSoon title="Hotel Details" />} />
        <Route path="hotels-enhanced/:id/edit" element={<EditHotelForm />} />
        
        <Route path="flights-enhanced" element={<FlightsPageEnhanced />} />
        <Route path="flights-enhanced/new" element={<CreateFlightForm />} />
        <Route path="flights-enhanced/:id" element={<ComingSoon title="Flight Details" />} />
        <Route path="flights-enhanced/:id/edit" element={<EditFlightForm />} />
        <Route path="users" element={<UserManagementPageEnhanced />} />
        <Route path="users/:id" element={<UserDetailsView />} />
        <Route path="users/:id/edit" element={<EditUserForm />} />
        
        {/* Analytics, Reports, and Calendar routes */}
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        
        {/* Fallback routes for legacy links */}
        <Route path="products" element={<Navigate to="/dashboard/products-enhanced" replace />} />
        <Route path="hotels" element={<Navigate to="/dashboard/hotels-enhanced" replace />} />
        <Route path="flights" element={<Navigate to="/dashboard/flights-enhanced" replace />} />
        
        {/* Placeholder routes for future implementation */}
        <Route path="analytics" element={<ComingSoon title="Analytics" />} />
        <Route path="reports" element={<ComingSoon title="Reports" />} />
        <Route path="calendar" element={<ComingSoon title="Calendar" />} />
        <Route path="orders" element={<ComingSoon title="Orders" />} />
        <Route path="transactions" element={<ComingSoon title="Transactions" />} />
        <Route path="revenue" element={<ComingSoon title="Revenue" />} />
        <Route path="customers" element={<ComingSoon title="Customers" />} />
        <Route path="messages" element={<ComingSoon title="Messages" />} />
        <Route path="api-docs" element={<ComingSoon title="API Documentation" />} />
        <Route path="settings" element={<ComingSoon title="Settings" />} />
        <Route path="support" element={<ComingSoon title="Help & Support" />} />
        
        {/* Sub-Super Admin specific routes */}
        {isSubSuperAdmin && (
          <>
            <Route path="manage-sellers" element={<ComingSoon title="Manage Sellers" />} />
            <Route path="department-settings" element={<ComingSoon title="Department Settings" />} />
            <Route path="compliance" element={<ComingSoon title="Compliance" />} />
          </>
        )}
        
        {/* Catch-all for unknown dashboard routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

// Placeholder component for routes under development
const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-gray-500 dark:text-gray-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title} Coming Soon</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        We're working hard to bring you this feature. Check back soon for updates!
      </p>
    </div>
  );
};
