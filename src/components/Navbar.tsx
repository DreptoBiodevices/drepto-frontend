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
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // ── Language state ──
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  // ── Upload Prescription state ──
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [prescriptionUploading, setPrescriptionUploading] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const navItems = [
    {
      name: 'About Us',
      path: '/about-us',
      dropdown: [
        { label: 'About Drepto', desc: 'Deeptech biomedical innovations at SINE, IIT Bombay', path: '/about-us' },
        { label: 'Leadership & Team', desc: 'Message from Founder Rahul Kumar Gupta & Advisors', path: '/about-us' },
        { label: 'Incubation & Recognition', desc: 'SINE IIT Bombay, BIRAC, and JAIMS', path: '/about-us' },
      ],
    },
    {
      name: 'Our Products',
      path: '/our-products',
      dropdown: [
        { label: 'MenstroHerb (Cramp Relief)', desc: '12-hour sustained herbal patch for dysmenorrhea', path: '/our-products' },
        { label: 'Chronic Pain Therapeutics', desc: 'Arthritis and targeted musculoskeletal patches', path: '/our-products' },
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

  // ── Prescription Upload logic ──
  const handlePrescriptionClick = () => {
    setShowPrescriptionModal(true);
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
    setPrescriptionSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPrescriptionPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrescriptionUpload = async () => {
    if (!prescriptionFile) return;
    setPrescriptionUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPrescriptionUploading(false);
    setPrescriptionSuccess(true);
    setTimeout(() => {
      setShowPrescriptionModal(false);
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
      setPrescriptionSuccess(false);
    }, 2500);
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

            {/* Desktop Navigation Links with Dropdowns (Highlighted White Text) */}
            <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-1 mx-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        if (item.path === '/') {
                          if (!isHomePage) navigate('/');
                          else window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          navigate(item.path);
                        }
                      }}
                      className={`font-semibold text-sm tracking-wide transition-colors flex items-center gap-1.5 py-2 group cursor-pointer ${
                        isActive
                          ? 'text-[#c01226]'
                          : 'text-white hover:text-red-400'
                      }`}
                    >
                      <span className="drop-shadow-xs">{item.name}</span>
                      {item.dropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            activeDropdown === item.name
                              ? 'rotate-180 text-red-400'
                              : 'text-white/70 group-hover:text-red-400'
                          }`}
                        />
                      )}
                    </button>

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
                              onClick={() => {
                                setActiveDropdown(null);
                                navigate(sub.path);
                              }}
                              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors group/sub block"
                            >
                              <div className="text-white group-hover/sub:text-red-400 font-semibold text-xs tracking-wide transition-colors">
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
              {/* Sleek Outline Upload Prescription Button */}
              <button
                type="button"
                onClick={handlePrescriptionClick}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-white/30 hover:border-[#c01226] text-white hover:text-white bg-white/10 hover:bg-[#c01226]/30 font-semibold text-xs tracking-wide transition-all shadow-sm backdrop-blur-sm cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-white/90" />
                <span>{t('util.uploadPrescription')}</span>
              </button>

              {/* Language Selector */}
              <div className="relative" ref={languageRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-1 text-white hover:text-red-400 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
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
                            ? 'bg-white/15 text-red-400 font-bold'
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
                className="relative p-2 text-white hover:text-red-400 transition-colors cursor-pointer"
                title={t('util.cart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c01226] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
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
                        <Shield className="w-3 h-3 text-red-400" />
                        <span>Admin</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(user.role === 'Admin' ? '/admin/dashboard' : '/profile')}
                      className="text-white hover:text-red-400 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-white/80" />
                      <span>{user.firstName}</span>
                    </button>
                    <button
                      onClick={logout}
                      className="text-white/70 hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {t('util.signOut')}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => setAuthModalView('login')}
                      className="text-white hover:text-red-400 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {t('util.signIn')}
                    </button>
                    <button
                      onClick={() => setAuthModalView('signup')}
                      className="bg-[#c01226] hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-sm cursor-pointer"
                    >
                      {t('util.signUp')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white hover:text-red-400 transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          Mobile Sidebar Drawer
          ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
          <div className="relative w-[300px] bg-neutral-950 text-white h-full shadow-2xl flex flex-col border-l border-white/10 animate-slide-in-right transform transition-transform duration-300 ease-out">

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10 bg-black/40">
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
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-white/10 rounded-full text-white/70 hover:text-red-400 hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.path === '/') {
                        if (!isHomePage) navigate('/');
                        else window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-white hover:bg-white/10 hover:text-red-400 text-left font-semibold text-sm cursor-pointer"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                ))}

                {/* Upload Prescription (Mobile) */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handlePrescriptionClick();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-white hover:bg-white/10 mt-2 border border-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-600/20 text-[#c01226]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold">{t('util.uploadPrescription')}</span>
                  </div>
                </button>

                {/* Mobile Cart */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-white hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 text-white">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold">{t('util.myCart')}</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-[#c01226] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile User Links */}
                {user && (
                  <>
                    <div className="h-px bg-white/10 my-3 mx-2"></div>
                    <button
                      onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-white hover:bg-white/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10 text-white">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">{t('util.myOrders')}</span>
                      </div>
                    </button>
                    {(user.role === 'Admin' || localStorage.getItem('adminAuth') === 'true') && (
                      <button
                        onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center justify-between p-3 rounded-xl transition-all bg-white/10 text-white font-semibold border border-white/15 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#c01226] text-white">
                            <Shield className="w-5 h-5" />
                          </div>
                          <span className="text-sm">Admin Portal</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/50" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer / Auth Actions */}
            <div className="p-6 border-t border-white/10 bg-black/40 space-y-3">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      setAuthModalView('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-all text-sm cursor-pointer"
                  >
                    <LogIn className="w-5 h-5" />
                    {t('util.signIn')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalView('signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#c01226] text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all text-sm cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5" />
                    {t('util.signUpNow')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/60 text-red-400 border border-red-900/60 rounded-xl font-bold hover:bg-red-950 transition-all text-sm cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              )}
              <p className="text-xs text-center text-white/40 mt-4">
                © 2025 Drepto Biodevices Pvt. Ltd.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Upload Prescription Modal
          ───────────────────────────────────────────────────────────── */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#c01226]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('prescription.title')}</h3>
                  <p className="text-xs text-gray-500">{t('prescription.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {prescriptionSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{t('prescription.uploadSuccess')}</h4>
                  <p className="text-gray-500 text-sm">
                    {t('prescription.successMessage')}
                  </p>
                </div>
              ) : (
                <>
                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#c01226] hover:bg-red-50/20 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {prescriptionPreview ? (
                      <div className="space-y-3">
                        <img
                          src={prescriptionPreview}
                          alt="Prescription preview"
                          className="max-h-48 mx-auto rounded-xl object-contain"
                        />
                        <p className="text-sm font-medium text-slate-800">{prescriptionFile?.name}</p>
                        <p className="text-xs text-slate-400">{t('prescription.changeFile')}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-[#c01226]">
                          <Upload className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{t('prescription.dragDrop')}</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF (Max 10MB)</p>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                        >
                          {t('prescription.browseFiles')}
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Your medical records are encrypted and protected under healthcare privacy standards.</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPrescriptionModal(false)}
                      className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                    >
                      {t('prescription.cancel')}
                    </button>
                    <button
                      type="button"
                      disabled={!prescriptionFile || prescriptionUploading}
                      onClick={handlePrescriptionUpload}
                      className="flex-1 py-3 bg-[#c01226] text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      {prescriptionUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t('prescription.uploading')}</span>
                        </>
                      ) : (
                        <span>{t('prescription.uploadNow')}</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
