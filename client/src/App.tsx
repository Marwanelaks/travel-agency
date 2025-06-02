import React from 'react';
import { Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { WelcomePage } from './pages/WelcomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UsersPage from './pages/users/UsersPage';
import { ShopPage } from './pages/ShopPage';
import { RequireAuth } from './components/RequireAuth';
import { CartProvider } from './components/providers/cart-provider';


// Products route component with nested routes (protected)
const ProductsRoutes = () => {
  const element = useRoutes([
    { path: '/', element: <ProductsPage /> },
    { path: '/new', element: <CreateProductPage /> },
    { path: '/edit/:id', element: <EditProductPage /> },
    { path: '*', element: <Navigate to="/products" replace /> },
  ]);
  return element;
};

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        
        {/* Public product detail route */}
        <Route path="/products/:id" element={<ProductDetailPage />} />
        
        {/* Cart and checkout routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Protected product management routes */}
        <Route
          path="/products/*"
          element={
            <RequireAuth>
              <ProductsRoutes />
            </RequireAuth>
          }
        />
      
      {/* User management routes - Admin only */}
      <Route
        path="/users"
        element={
          <RequireAuth>
            <UsersPage />
          </RequireAuth>
        }
      />
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </CartProvider>
  );
}

export default App;
