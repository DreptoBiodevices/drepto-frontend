import React, { useState, useEffect, RefObject } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Pill,
  TestTube2,
  Zap,
  Info,
  Mail,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

interface NavbarProps {
  sectionRefs?: {
    [key: string]: RefObject<HTMLDivElement>;
  };
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sectionRefs = {}, isMobileMenuOpen: externalIsOpen, setIsMobileMenuOpen: externalSetIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isMobileMenuOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsMobileMenuOpen = externalSetIsOpen || setInternalIsOpen;

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'Home', ref: sectionRefs.home, path: '/', icon: Home },
    { name: 'Medicines', path: '/medicines', icon: Pill },
    { name: 'Lab Tests', path: '/lab-tests', icon: TestTube2 },
    { name: 'Our Products', path: '/our-products', icon: ShoppingBag },
    { name: 'Features', ref: sectionRefs.product, path: '/', icon: Zap },
    { name: 'About Us', path: '/about-us', icon: Info },
    { name: 'Contact', ref: sectionRefs.contact, path: '/', icon: Mail },
  ];

  const handleNavigation = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);

    if (link.path && link.path !== '/') {
      navigate(link.path);
      return;
    }

    if (!isHomePage) {
      navigate('/');
      return;
    }

    if (link.ref) {
      link.ref.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (link.name === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-2'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center text-gray-800">

          {/* LOGO CLICKABLE */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/images/logo.png"
              alt="Drepto Biodevices Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link)}
                className={`text-sm font-medium transition-all hover:text-primary relative group ${location.pathname === link.path && link.path !== '/'
                  ? 'text-primary font-bold'
                  : 'text-gray-600'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${location.pathname === link.path && link.path !== '/' ? 'w-full' : ''}`}></span>
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div
              className="flex items-center gap-1 cursor-pointer font-medium hover:text-primary transition-colors"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div className="relative w-[300px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right transform transition-transform duration-300 ease-out">

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${(location.pathname === link.path && link.path !== '/') || (link.name === 'Home' && isHomePage)
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${(location.pathname === link.path && link.path !== '/') || (link.name === 'Home' && isHomePage)
                        ? 'bg-white text-primary shadow-sm'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm'
                        } transition-colors`}>
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="text-base">{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary/50" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer / Auth Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <button
                onClick={() => {
                  navigate('/auth');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate('/auth?mode=signup');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-600 to-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:opacity-95 transition-all transform active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up Now
              </button>
              <p className="text-xs text-center text-gray-400 mt-4">
                © 2025 Drepto Biodevices
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
