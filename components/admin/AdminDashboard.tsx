// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminShipping from './AdminShipping';
import AdminFeedback from './AdminFeedback';
import MedicineCRUD from './MedicineCRUD';
import LabTestCRUD from './LabTestCRUD';
import ProductCRUD from './ProductCRUD';
import TransactionHistory from './TransactionHistory';
import { ADMIN_AUTH_KEY } from './adminData';
import { Menu, ExternalLink, LogOut, Shield } from 'lucide-react';

const titles: Record<string, string> = {
  overview:     'Overview & Telemetry',
  orders:       'Orders Management',
  transactions: 'Payments & Transactions',
  users:        'User Registry',
  shipping:     'Shipping Addresses',
  products:     'Product Catalog Management',
  medicines:    'Medicines Database',
  labtests:     'Lab Tests Database',
  feedback:     'Feedback & Customer Reviews',
};

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('admin-auth-change'));
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar activeTab={tab} setActiveTab={setTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 bg-white border-b border-gray-100 shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900 leading-tight truncate">
                  {titles[tab] || 'Admin Portal'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  <Shield className="w-3 h-3" /> Live Control
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Drepto Biodevices · MongoDB Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                A
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Dreptoadmin@gmail.com</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {tab === 'overview'     && <AdminOverview setTab={setTab} />}
            {tab === 'orders'       && <AdminOrders />}
            {tab === 'transactions' && <TransactionHistory />}
            {tab === 'users'        && <AdminUsers />}
            {tab === 'shipping'     && <AdminShipping />}
            {tab === 'products'     && <ProductCRUD />}
            {tab === 'medicines'    && <MedicineCRUD />}
            {tab === 'labtests'     && <LabTestCRUD />}
            {tab === 'feedback'     && <AdminFeedback />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
