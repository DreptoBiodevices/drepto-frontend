
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MedicinesPage from './pages/MedicinesPage';
import LabTestsPage from './pages/LabTestsPage';
import AboutUsPage from './pages/AboutUsPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { ADMIN_AUTH_KEY } from './components/admin/adminData';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import RefundPolicy from './pages/legal/RefundPolicy';
import ShippingPolicy from './pages/legal/ShippingPolicy';
import OurProductsPage from './pages/OurProductsPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import InvoicePage from './pages/InvoicePage';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Main />
      </BrowserRouter>
    </AuthProvider>
  );
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthed, setIsAuthed] = React.useState(localStorage.getItem(ADMIN_AUTH_KEY) === 'true');

  React.useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
      console.log('ProtectedAdminRoute effect check:', auth);
      setIsAuthed(auth);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('admin-auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('admin-auth-change', checkAuth);
    };
  }, []);

  if (!isAuthed) {
    console.log('Redirecting to login...');
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

const Main: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-16 md:pb-0">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/lab-tests" element={<LabTestsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/our-products" element={<OurProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={user ? <OrderHistoryPage /> : <Navigate to="/auth" replace />} />
        <Route path="/invoice/:orderId" element={user ? <InvoicePage /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={user ? <Navigate to={(location.state as any)?.from || "/dashboard"} replace /> : <AuthPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/auth" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

        {/* Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </div>
  );
}

export default App;
