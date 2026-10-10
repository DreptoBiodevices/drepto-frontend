import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TestTube2, ShoppingBag, User, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setAuthModalView } = useAuth();

  const navItems = [
    { name: 'Home',      icon: Home,       path: '/' },
    { name: 'Cart',      icon: ShoppingBag, path: '/cart' },
    { name: 'Orders',    icon: Package,     path: '/orders', authRequired: true },
    { name: 'Profile',   icon: User,        path: user ? '/profile' : '/auth' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.authRequired && !user) {
      setAuthModalView('login');
      return;
    }
    if (item.path === '/auth') {
      setAuthModalView('login');
      return;
    }
    navigate(item.path);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center flex-1 py-1 gap-0.5 relative group"
              style={{ minHeight: 48 }}
            >
              {/* Active indicator dot */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-600" />
              )}

              {/* Icon container */}
              <span
                className={`flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-400 group-active:bg-gray-100'
                }`}
              >
                <item.icon
                  className={`transition-all duration-200 ${
                    active ? 'w-5 h-5' : 'w-5 h-5'
                  }`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </span>

              {/* Label */}
              <span
                className={`text-[9px] font-semibold tracking-wide transition-colors duration-200 leading-none ${
                  active ? 'text-brand-700' : 'text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
