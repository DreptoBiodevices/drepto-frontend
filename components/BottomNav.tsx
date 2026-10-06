import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Pill, TestTube2, User, ShoppingBag, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setAuthModalView } = useAuth();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Lab Tests', icon: TestTube2, path: '/lab-tests' },
    { name: 'Cart', icon: ShoppingBag, path: '/cart' },
    { name: 'Profile', icon: User, path: user ? '/dashboard' : '/auth' }
  ];

  const handleNavClick = (path: string) => {
    if (path === '/auth') {
      setAuthModalView('login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] pt-2 px-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-16 flex items-center justify-between">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.name}
            onClick={() => handleNavClick(item.path)}
            className={`flex flex-col items-center justify-center w-full transition-colors ${
              isActive ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand-50' : ''}`} />
            </div>
            <span className={`text-[10px] font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
