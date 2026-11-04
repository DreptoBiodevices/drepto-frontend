import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { LangCode } from '../lib/translations';
import {
  Home,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  User,
  LogOut,
  Package,
  FileText,
  Globe,
  Upload,
  Check,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  sectionRefs?: any;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

// ── Supported languages ──
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

const Navbar: React.FC<NavbarProps> = ({
  sectionRefs = {} as Record<string, RefObject<HTMLDivElement>>,
  isMobileMenuOpen: externalIsOpen,
  setIsMobileMenuOpen: externalSetIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { user, logout, setAuthModalView } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const isMobileMenuOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsMobileMenuOpen = externalSetIsOpen || setInternalIsOpen;

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);

  const handleNavClick = (path: string, hash?: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    if (location.pathname === path) {
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        if (location.hash !== hash) {
          navigate(`${path}${hash}`, { replace: true });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (location.hash) {
          navigate(path, { replace: true });
        }
      }
    } else {
      if (hash) {
        navigate(`${path}${hash}`);
      } else {
        navigate(path);
      }
    }
  };
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // ── Language state ──
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);


  // ── Cart State ──
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        setCartCount(cart.length);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('cart:updated', updateCartCount);
    return () => window.removeEventListener('cart:updated', updateCartCount);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // ── Emcure-inspired Nav Links with Dropdowns ──
  interface SubNavItem {
    label: string;
    desc?: string;
    path: string;
    hash?: string;
  }

  interface NavItem {
    name: string;
    path: string;
    dropdown?: SubNavItem[];
  }

  const navItems: NavItem[] = [
    {
      name: 'About Us',
      path: '/about-us',
      dropdown: [
        { label: 'About Drepto', desc: 'Deeptech biomedical innovations at SINE, IIT Bombay', path: '/about-us', hash: '#purpose' },
        { label: 'Leadership & Team', desc: 'Message from Founder Rahul Kumar Gupta & Advisors', path: '/about-us', hash: '#team' },
        { label: 'Incubation & Recognition', desc: 'SINE IIT Bombay, BIRAC, and JAIMS', path: '/about-us', hash: '#recognition' },
      ],
    },
    {
      name: 'Our Products',
      path: '/our-products',
      dropdown: [
        { label: 'MenstroHerb (Cramp Relief)', desc: '12-hour sustained herbal patch for dysmenorrhea', path: '/our-products', hash: '#catalog' },
        { label: 'Chronic Pain Therapeutics', desc: 'Arthritis and targeted musculoskeletal patches', path: '/our-research', hash: '#science' },
        { label: 'Browse Product Catalog', desc: 'Explore all formulations, packs, and subscriptions', path: '/our-products' },
      ],
    },
    {
      name: 'Our Research',
      path: '/our-research',
    },
    {
      name: 'Contact Us',
      path: '/contact',
    },
  ];

  // ── Language logic ──
  const handleLanguageChange = (code: string) => {
    setLanguage(code as LangCode);
    setShowLanguageDropdown(false);

    const langName = LANGUAGES.find((l) => l.code === code)?.name || code;
    const notif = document.createElement('div');
    notif.className = 'fixed top-24 right-4 bg-brand-700 text-white px-6 py-3 rounded-xl shadow-lg z-[100] animate-fade-in-up font-medium';
    notif.textContent = `Language changed to ${langName}`;
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.3s';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  };


  // ── Click outside handlers ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          Sleek Emcure-Inspired Frosted Glass Single Navigation Bar
          ───────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 shadow-md'
            : 'bg-black/55 backdrop-blur-md border-b border-white/10 shadow-sm'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

            {/* Brand Logo */}
            <div
              className="flex items-center cursor-pointer flex-shrink-0 group"
              onClick={() => navigate('/')}
            >
              <img
                src="/images/logo.png"
                alt="Drepto Biodevices Logo"
                className="h-8 sm:h-11 w-auto object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-all"
              />
            </div>

            {/* Desktop Navigation Links with Dropdowns */}
            <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-1 mx-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                    onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
                  >
                    <div
                      className={`font-semibold text-sm tracking-wide transition-colors flex items-center gap-1 py-1 group ${
                        isActive
                          ? 'text-[#0B6F6D]'
                          : 'text-white hover:text-[#75B6B4]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.path)}
                        className="py-1 cursor-pointer hover:text-[#75B6B4] transition-colors drop-shadow-xs"
                      >
                        {item.name}
                      </button>
                      {item.dropdown && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === item.name ? null : item.name);
                          }}
                          className="p-1 cursor-pointer text-white/70 hover:text-[#75B6B4] transition-colors"
                          aria-label={`Toggle ${item.name} menu`}
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              activeDropdown === item.name
                                ? 'rotate-180 text-[#75B6B4]'
                                : 'text-white/70 group-hover:text-[#75B6B4]'
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Dark Glass Dropdown Panel */}
                    {item.dropdown && activeDropdown === item.name && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 animate-fade-in-down"
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-neutral-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-2">
                          {item.dropdown.map((sub) => (
                            <button
                              key={sub.label}
                              type="button"
                              onClick={() => handleNavClick(sub.path, sub.hash)}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors group/sub block cursor-pointer"
                            >
                              <div className="text-white group-hover/sub:text-[#75B6B4] font-semibold text-xs tracking-wide transition-colors">
                                {sub.label}
                              </div>
                              {sub.desc && (
                                <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">
                                  {sub.desc}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop Right Utilities (Upload Prescription, Cart, Lang, Auth) */}
            <div className="hidden lg:flex items-center space-x-3.5 flex-shrink-0">
              {/* Buy MenstroHerb Direct Action CTA */}
              <button
                type="button"
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0B6F6D] hover:bg-[#085553] text-white font-bold text-xs tracking-wide transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy MenstroHerb</span>
              </button>

              {/* Language Selector */}
              <div className="relative" ref={languageRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-1 text-white hover:text-[#75B6B4] text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Language"
                >
                  <Globe className="w-4 h-4 text-white/80" />
                  <span className="uppercase text-[11px]">{language}</span>
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl py-1.5 z-[60]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                          language === lang.code
                            ? 'bg-white/15 text-[#75B6B4] font-bold'
                            : 'text-white/90 hover:bg-white/10'
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-white/50 text-[10px]">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-white hover:text-[#75B6B4] transition-colors cursor-pointer"
                title={t('util.cart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E17C61] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Authentication */}
              <div className="flex items-center space-x-2 pl-2 border-l border-white/15">
                {user ? (
                  <>
                    {(user.role === 'Admin' || localStorage.getItem('adminAuth') === 'true') && (
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-2.5 py-1 font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Shield className="w-3 h-3 text-[#75B6B4]" />
                        <span>Admin</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(user.role === 'Admin' ? '/admin/dashboard' : '/profile')}
                      className="text-white hover:text-[#75B6B4] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-white/80" />
                      <span>{user.firstName}</span>
                    </button>
                    <button
                      onClick={logout}
                      className="text-white/70 hover:text-[#75B6B4] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {t('util.signOut')}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => setAuthModalView('login')}
                      className="text-white hover:text-[#75B6B4] font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {t('util.signIn')}
                    </button>
                    <button
                      onClick={() => setAuthModalView('signup')}
                      className="bg-[#0B6F6D] hover:bg-[#0B5C5A] text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-sm cursor-pointer"
                    >
                      {t('util.signUp')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white hover:text-[#75B6B4] transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          Mobile Sidebar Drawer (Luminous Healthcare Redesign)
          ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          {/* Backdrop with Soft Blur */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer Panel */}
          <div className="relative w-[85vw] max-w-[340px] bg-white text-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in-right transform transition-transform duration-300 ease-out z-10">

            {/* Header: Pure White with Authentic Color Logo & Circular Close Button */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-[#f8f9fa]">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/');
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="Drepto Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-2xs transition-all cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links & Content */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
              
              {/* Logged in User Pill */}
              {user && (
                <div className="p-3.5 mb-3 bg-[#F4F9F9]/60 border border-[#D0E6E6]/80 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B6F6D] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {user.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.firstName} {user.lastName || ''}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email || user.role}</p>
                  </div>
                </div>
              )}

              {/* Main Nav Items with Accordion Submenus */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
                  const isExpanded = mobileExpandedItem === item.name;

                  return (
                    <div key={item.name} className="rounded-2xl overflow-hidden transition-colors">
                      <div
                        className={`w-full flex items-center justify-between p-3.5 transition-all text-left font-semibold text-sm ${
                          isActive
                            ? 'bg-[#F4F9F9] text-[#0B6F6D] font-bold border border-[#D0E6E6]/80'
                            : 'text-slate-800 hover:bg-slate-100 hover:text-[#0B6F6D]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleNavClick(item.path)}
                          className="flex-1 text-left cursor-pointer"
                        >
                          {item.name}
                        </button>
                        {hasDropdown && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileExpandedItem(isExpanded ? null : item.name);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer text-slate-500"
                            aria-label={`Toggle ${item.name} submenu`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-[#0B6F6D]' : 'text-slate-400'
                              }`}
                            />
                          </button>
                        )}
                        {!hasDropdown && (
                          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#0B6F6D]' : 'text-slate-400'}`} />
                        )}
                      </div>

                      {/* Mobile Accordion Submenu */}
                      {hasDropdown && isExpanded && (
                        <div className="bg-slate-50/80 px-3 py-2 space-y-1 border-t border-slate-200/60 animate-fade-in">
                          {item.dropdown!.map((sub) => (
                            <button
                              key={sub.label}
                              type="button"
                              onClick={() => handleNavClick(sub.path, sub.hash)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-white transition-colors block cursor-pointer group"
                            >
                              <div className="text-xs font-bold text-slate-800 group-hover:text-[#0B6F6D] transition-colors">
                                {sub.label}
                              </div>
                              {sub.desc && (
                                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                  {sub.desc}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="h-px bg-slate-100 my-3" />

              {/* Quick Action Cards */}
              <div className="space-y-2">
                {/* Explore MenstroHerb */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/our-products');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F4F9F9]/90 border border-[#D0E6E6] text-slate-900 hover:bg-[#D0E6E6]/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0B6F6D] text-white shadow-2xs group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold block text-slate-900">Explore MenstroHerb™</span>
                      <span className="text-[10px] text-slate-500 font-medium">Patented Transdermal Relief</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0B6F6D]" />
                </button>

                {/* Mobile Cart */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-900 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-4 h-4 text-slate-700" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{t('util.myCart')}</span>
                  </div>
                  {cartCount > 0 ? (
                    <span className="bg-[#E17C61] text-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      {cartCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Mobile Orders (if user logged in) */}
                {user && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/orders');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-900 hover:bg-slate-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                        <Package className="w-4 h-4 text-slate-700" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{t('util.myOrders')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                {/* Admin Portal (if admin) */}
                {user && (user.role === 'Admin' || localStorage.getItem('adminAuth') === 'true') && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/admin/dashboard');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/10 text-[#75B6B4]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">Admin Portal</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </button>
                )}
              </div>
            </div>

            {/* Footer / Auth Actions */}
            <div className="p-5 border-t border-slate-100 bg-[#f8f9fa] space-y-2.5">
              {!user ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setAuthModalView('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 transition-all text-xs cursor-pointer shadow-2xs"
                  >
                    <LogIn className="w-4 h-4 text-slate-600" />
                    <span>{t('util.signIn')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalView('signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-[#0B6F6D] text-white rounded-xl font-bold shadow-md hover:bg-[#0B5C5A] transition-all text-xs cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t('util.signUpNow')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#F4F9F9] text-[#0B6F6D] border border-[#D0E6E6]/90 rounded-xl font-bold hover:bg-[#D0E6E6] transition-all text-xs cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
              <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                © 2025 Drepto Biodevices Pvt. Ltd.
              </p>
            </div>

          </div>
        </div>
      )}

      
    </>
  );
};

export default Navbar;
