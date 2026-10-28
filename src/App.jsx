import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProtectedRoute from './app/ProtectedRoute';
import DashboardPage from './features/dashboard/DashboardPage';
import { useAuth } from './app/AuthContext';
import OwnerDashboardPage from './features/owner/OwnerDashboardPage';
import BrowsePage from './features/browse/BrowsePage';
import RestaurantFormPage from './features/owner/RestaurantFormPage';
import MenuManagementPage from './features/owner/MenuManagementPage';
import MenuItemFormPage from './features/owner/MenuItemFormPage';
import RestaurantDetailPage from './features/browse/RestaurantDetailPage';
import CartPage from './features/cart/CartPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderDetailPage from './features/orders/OrderDetailPage';
import OwnerOrdersPage from './features/owner/OwnerOrdersPage';
import OwnerOrderDetailPage from './features/owner/OwnerOrderDetailPage';
import PreferencesPage from './features/preferences/PreferencesPage';
import OrderHistoryPage from './features/orders/OrderHistoryPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';

function RoleLandingPage() {
  const { user } = useAuth();
  return user.role === 'RESTAURANT_OWNER' ? <OwnerDashboardPage /> : <BrowsePage />;
}

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleLandingPage />
          </ProtectedRoute>
        } />
      <Route
        path="/owner/restaurants/new"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <RestaurantFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/restaurants/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <RestaurantFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/restaurants/:restaurantId/menu"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <MenuManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/restaurants/:restaurantId/menu-items/new"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <MenuItemFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/restaurants/:restaurantId/menu-items/:itemId/edit"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <MenuItemFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants/:id"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <RestaurantDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/orders"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <OwnerOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preferences"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <PreferencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
            <OwnerOrderDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App
