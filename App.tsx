import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/AuthModal';
import { ADMIN_AUTH_KEY } from './components/admin/adminData';
import { LanguageProvider } from './hooks/useLanguage';
import BottomNav from './components/BottomNav';

// Code-split routes with React.lazy to eliminate bundle lag
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const OurProductsPage = lazy(() => import('./pages/OurProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const OurResearchPage = lazy(() => import('./pages/OurResearchPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const InvoicePage = lazy(() => import('./pages/InvoicePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const OAuthSuccess = lazy(() => import('./pages/OAuthSuccess'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/legal/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./pages/legal/ShippingPolicy'));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-10 h-10 border-3 border-[#0B6F6D]/20 border-t-[#0B6F6D] rounded-full animate-spin" />
    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Drepto Biodevices...</span>
  </div>
);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const scroll = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scroll()) {
        const timer1 = setTimeout(scroll, 100);
        const timer2 = setTimeout(scroll, 300);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Main />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthed, setIsAuthed] = React.useState(localStorage.getItem(ADMIN_AUTH_KEY) === 'true');

  React.useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
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
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

const Main: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="bg-gray-50 min-h-screen font-sans overflow-x-hidden w-full">
      <div className="min-h-screen flex flex-col pb-20 md:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lab-tests" element={<Navigate to="/our-products" replace />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/our-products" element={<OurProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={user ? <OrderHistoryPage /> : <Navigate to="/auth" replace />} />
            <Route path="/invoice/:orderId" element={<InvoicePage />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

            {/* Feature Routes */}
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/our-research" element={<OurResearchPage />} />

            {/* Legal Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
      <BottomNav />
      <AuthModal />
    </div>
  );
};

export default App;
