import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface DashboardLayoutProps {
  user: User;
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  title?: string;
}

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="16" x2="21" y2="16" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user, navItems, activeTab, onTabChange, children, title
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setIsSidebarOpen(false); }, [activeTab]);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* ── mobile overlay ─────────────────────────────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── sidebar ────────────────────────────────────────── */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50 w-60 bg-white border-r border-gray-100
        flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <img src="/images/logo.png" alt="Drepto" className="h-12 object-contain" />
        </div>

        {/* nav */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
            Menu
          </p>
          <div className="space-y-0.5">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && onTabChange(item.id)}
                  style={{ borderRadius: '0.25rem' }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-150
                    ${isActive
                      ? 'bg-primary/8 text-primary font-semibold'
                      : item.disabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    size={16}
                    className={isActive ? 'text-primary' : item.disabled ? 'text-gray-300' : 'text-gray-400'}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold ${item.badgeColor || 'text-green-500'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* user footer */}
        <div className="px-3 pb-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3 px-3 py-2.5">
            {/* initials avatar */}
            <div
              style={{ borderRadius: '0.25rem' }}
              className="w-8 h-8 bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 truncate">
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* ── main ───────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* header */}
        <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white border-b border-gray-100 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* mobile menu toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-900 transition-colors"
            >
              <MenuIcon />
            </button>

            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">
                {title || 'Overview'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {user.isFirstLogin || user.isFirstLogin === undefined ? 'Welcome' : 'Welcome back'},{' '}
                {user.firstName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* date — desktop */}
            <span className="hidden lg:block text-xs font-semibold text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>

            {/* notifications */}
            <button
              onClick={() => onTabChange('notifications')}
              style={{ borderRadius: '0.25rem' }}
              className="relative w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;