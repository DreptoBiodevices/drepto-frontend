import React, { useState, useEffect, RefObject } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  ShoppingBag,
  User,
  LogOut,
  Package,
  FileText,
  Search,
  Globe,
  MapPin
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
  const { user, logout } = useAuth();

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
      {/* ---- Utility Header ---- */}
      <div className="border-b border-slate-200 bg-white text-sm font-medium text-slate-600 hidden sm:block">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          {/* Delivery Location */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span className="text-slate-400">Deliver to:</span>
            <select className="bg-transparent text-slate-800 font-semibold focus:outline-none border-none py-0 pl-1 pr-4 text-sm cursor-pointer hover:text-brand-600 transition-colors">
              <option>Mumbai (SINE IIT Bombay, 400076)</option>
              <option>Delhi NCR</option>
              <option>Bangalore</option>
              <option>Pune</option>
              <option>Hyderabad</option>
            </select>
          </div>
          {/* Right utilities */}
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1.5 hover:text-brand-700 transition-colors" title="Change Language">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>English</span>
            </button>
            {/* Cart */}
            <button
              className="flex items-center space-x-1.5 hover:text-brand-700 transition-colors relative py-1"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              <span className="font-medium">Cart</span>
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold leading-none text-white bg-brand-600 rounded-full">0</span>
            </button>
            {/* Auth */}
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-1.5 font-semibold text-slate-700 hover:text-brand-700 transition-colors flex items-center gap-1"
                  >
                    <User className="w-4 h-4" />
                    {user.firstName}
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-1.5 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-all shadow-sm text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth')}
                    className="px-4 py-1.5 font-semibold text-slate-700 hover:text-brand-700 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/auth?mode=signup')}
                    className="px-4 py-1.5 font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-md transition-all shadow-sm"
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Main Header ---- */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      >
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 gap-8">

            {/* Brand Logo */}
            <div
              className="flex items-center cursor-pointer flex-shrink-0"
              onClick={() => navigate('/')}
            >
              <img
                src="/images/logo.png"
                alt="Drepto Biodevices Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-2 font-medium text-base flex-1 ml-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link)}
                  className={`px-4 py-2.5 rounded-lg transition-all text-base font-medium ${
                    (location.pathname === link.path && link.path !== '/') || (link.name === 'Home' && isHomePage && link.path === '/')
                      ? 'text-brand-700 bg-brand-50/80 font-bold'
                      : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Desktop Right: Upload Prescription + Cart + Auth */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              <button
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl border border-brand-600/30 text-brand-800 bg-brand-50/50 hover:bg-brand-50 hover:border-brand-600 font-bold text-sm tracking-wide transition-all shadow-sm group"
                type="button"
              >
                <FileText className="w-5 h-5 text-brand-700 group-hover:scale-110 transition-transform" />
                <span>Upload Prescription</span>
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4 rounded-full transition-all"
                    onClick={() => navigate('/orders')}
                  >
                    <Package className="w-5 h-5 text-gray-700" />
                    <span className="text-base font-medium">My Orders</span>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4 rounded-full transition-all"
                    onClick={() => navigate('/dashboard')}
                  >
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="text-base font-medium">{user.firstName}</span>
                  </div>
                  <button onClick={logout} className="text-gray-500 hover:text-red-500 ml-2">
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>

          {/* Search Bar Row */}
          <div className="py-4 border-t border-slate-100 hidden sm:block">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                className="w-full pl-12 pr-32 py-3 text-sm sm:text-base bg-slate-100/70 border border-slate-200/90 rounded-full focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Search medicines, diagnostic lab test packages, biodevices..."
                type="text"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-sm font-bold transition-colors flex items-center space-x-1">
                <span>Find</span>
              </button>
            </div>
          </div>
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

                {/* Mobile User Links */}
                {user && (
                  <>
                    <div className="h-px bg-gray-100 my-2 mx-2"></div>
                    <button
                      onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all group text-gray-600 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary transition-colors">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-base">My Cart</span>
                      </div>
                    </button>
                    <button
                      onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all group text-gray-600 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary transition-colors">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="text-base">My Orders</span>
                      </div>
                    </button>
                    <button
                      onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all group text-gray-600 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="text-base">Dashboard</span>
                      </div>
                    </button>
                  </>
                )}

              </div>
            </div>

            {/* Footer / Auth Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
              {!user ? (
                <>
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
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              )}
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
