import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { LangCode } from '../lib/translations';
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
  MapPin,
  Upload,
  Check,
  AlertCircle,
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

// ── Searchable items ──
const SEARCHABLE_ITEMS = [
  { label: 'Medicines', path: '/medicines', keywords: ['medicine', 'drug', 'pharmacy', 'pill', 'tablet', 'capsule', 'syrup'] },
  { label: 'Lab Tests', path: '/lab-tests', keywords: ['lab', 'test', 'diagnostic', 'blood', 'urine', 'report', 'pathology', 'nabl'] },
  { label: 'Our Products', path: '/our-products', keywords: ['product', 'device', 'biodevice', 'transdermal', 'iontophoretic', 'sample'] },
];

const Navbar: React.FC<NavbarProps> = ({ sectionRefs = {} as Record<string, RefObject<HTMLDivElement>>, isMobileMenuOpen: externalIsOpen, setIsMobileMenuOpen: externalSetIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { user, logout, setAuthModalView } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const isMobileMenuOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsMobileMenuOpen = externalSetIsOpen || setInternalIsOpen;

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // ── Search state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof SEARCHABLE_ITEMS>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ── Language state ──
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  // ── Location state ──
  const [locationName, setLocationName] = useState(() => localStorage.getItem('drepto_location') || 'Select Location');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const locationPromptRef = useRef<HTMLDivElement>(null);
  const [isLocating, setIsLocating] = useState(false);

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

  const navLinks = [
    { name: t('nav.home'), ref: sectionRefs.home, path: '/', icon: Home, key: 'Home' },
    { name: t('nav.labTests'), path: '/lab-tests', icon: TestTube2, key: 'Lab Tests' },
    { name: t('nav.ourProducts'), path: '/our-products', icon: ShoppingBag, key: 'Our Products' },
    { name: t('nav.aboutUs'), path: '/about-us', icon: Info, key: 'About Us' },
    { name: t('nav.contact'), path: '/contact', icon: Mail, key: 'Contact' },
  ];

  const handleNavigation = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);

    if (link.path && link.path !== '/') {
      navigate(link.path);
      return;
    }

    if (link.name === 'Home') {
      if (!isHomePage) {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (!isHomePage) {
      navigate('/');
      return;
    }

    if (link.ref) {
      link.ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── Search logic ──
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const q = query.toLowerCase().trim();
    const results = SEARCHABLE_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.includes(q))
    );
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length === 0) return;

    const q = searchQuery.toLowerCase().trim();
    const results = SEARCHABLE_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.includes(q))
    );

    if (results.length > 0) {
      navigate(results[0].path);
      setSearchQuery('');
      setShowSearchResults(false);
    } else {
      // Default: navigate to medicines page with search query
      navigate(`/medicines`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // ── Language logic ──
  const handleLanguageChange = (code: string) => {
    setLanguage(code as LangCode);
    setShowLanguageDropdown(false);

    // Show a notification 
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

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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

    // Simulate upload (replace with actual API call when backend supports it)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPrescriptionUploading(false);
    setPrescriptionSuccess(true);

    // Auto-close after success
    setTimeout(() => {
      setShowPrescriptionModal(false);
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
      setPrescriptionSuccess(false);
    }, 2500);
  };

  // ── Location logic ──
  const requestLocation = (precise: boolean) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setShowLocationPrompt(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`);
          const data = await response.json();
          
          let locationStr = "Unknown Location";
          if (data && data.status === "OK" && data.results && data.results.length > 0) {
             if (precise) {
               locationStr = data.results[0].formatted_address;
               
               if (locationStr.length > 45) {
                 locationStr = locationStr.substring(0, 42) + '...';
               }
             } else {
               const cityResult = data.results.find((result: any) => 
                 result.types.includes("locality") || result.types.includes("administrative_area_level_2")
               );
               locationStr = cityResult ? cityResult.formatted_address : data.results[0].formatted_address;
             }
          }
          
          setLocationName(locationStr);
          localStorage.setItem('drepto_location', locationStr);
        } catch (error) {
          console.error("Error fetching location details:", error);
          setLocationName("Failed to get address");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your permissions.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: precise,
        timeout: 10000,
        maximumAge: precise ? 0 : 60000,
      }
    );
  };

  // ── Click outside handlers ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setShowLanguageDropdown(false);
      }
      if (locationPromptRef.current && !locationPromptRef.current.contains(e.target as Node)) {
        setShowLocationPrompt(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          {/* Delivery Location */}
          <div className="flex items-center space-x-2 relative" ref={locationPromptRef}>
            <MapPin className="w-4 h-4 text-brand-600" />
            <span className="text-slate-400">{t('util.deliverTo')}</span>
            <button
              onClick={() => setShowLocationPrompt(!showLocationPrompt)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none border-none py-0 pl-1 pr-4 text-sm cursor-pointer hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              {isLocating ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  {locationName}
                  <svg className={`w-3 h-3 text-slate-400 transition-transform ${showLocationPrompt ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {/* Location Prompt Dropdown */}
            {showLocationPrompt && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[60] animate-fade-in-down">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Location Accuracy</p>
                </div>
                <button
                  onClick={() => requestLocation(true)}
                  className="w-full flex items-start text-left gap-3 px-4 py-3 text-sm transition-colors hover:bg-brand-50"
                >
                  <MapPin className="w-5 h-5 text-brand-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Precise Location</p>
                    <p className="text-xs text-slate-500">Exact GPS coordinates</p>
                  </div>
                </button>
                <button
                  onClick={() => requestLocation(false)}
                  className="w-full flex items-start text-left gap-3 px-4 py-3 text-sm transition-colors hover:bg-brand-50"
                >
                  <Globe className="w-5 h-5 text-brand-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Approximate Location</p>
                    <p className="text-xs text-slate-500">Approx. 0-50m range (Wi-Fi/Cell)</p>
                  </div>
                </button>
              </div>
            )}
          </div>
          {/* Right utilities */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                className="flex items-center space-x-1.5 hover:text-brand-700 transition-colors"
                title="Change Language"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>{currentLanguage.name}</span>
                <svg
                  className={`w-3 h-3 text-slate-400 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[60] animate-fade-in-down">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('util.selectLanguage')}</p>
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-slate-400 text-xs">{lang.nativeName}</span>
                      </div>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-brand-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              className="flex items-center space-x-1.5 hover:text-brand-700 transition-colors relative py-1"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              <span className="font-medium">{t('util.cart')}</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold leading-none text-white bg-brand-600 rounded-full">{cartCount}</span>
              )}
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
                    {t('util.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModalView('login')}
                    className="px-4 py-1.5 font-semibold text-slate-700 hover:text-brand-700 transition-colors"
                  >
                    {t('util.signIn')}
                  </button>
                  <button
                    onClick={() => setAuthModalView('signup')}
                    className="px-4 py-1.5 font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-md transition-all shadow-sm"
                  >
                    {t('util.signUp')}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className={`px-4 py-2.5 rounded-lg transition-all text-base font-medium ${(location.pathname === link.path && link.path !== '/') || (link.name === 'Home' && isHomePage && link.path === '/')
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
                onClick={handlePrescriptionClick}
              >
                <FileText className="w-5 h-5 text-brand-700 group-hover:scale-110 transition-transform" />
                <span>{t('util.uploadPrescription')}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4 rounded-full transition-all"
                    onClick={() => navigate('/orders')}
                  >
                    <Package className="w-5 h-5 text-gray-700" />
                    <span className="text-base font-medium">{t('util.myOrders')}</span>
                  </div>
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
          <div className="py-6 border-t border-slate-100 hidden sm:block" ref={searchRef}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                className="w-full pl-12 pr-32 py-3 text-sm sm:text-base bg-slate-100/70 border border-slate-200/90 rounded-full focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400"
                placeholder={t('search.placeholder')}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  if (searchQuery.trim().length > 0 && searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
              />
              <button
                className="absolute right-2 top-2 bottom-2 px-6 bg-brand-700 hover:bg-brand-800 text-white rounded-full text-sm font-bold transition-colors flex items-center space-x-1"
                onClick={handleSearchSubmit}
              >
                <span>{t('search.find')}</span>
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-[60] animate-fade-in-down">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {searchResults.length} {t('search.resultsFound')}
                      </p>
                      {searchResults.map((result) => (
                        <button
                          key={result.path}
                          onClick={() => handleSearchResultClick(result.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-brand-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                            <Search className="w-4 h-4 text-brand-700" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{result.label}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-500">{t('search.noResults')} "{searchQuery}"</p>
                      <p className="text-xs text-slate-400 mt-1">{t('search.trySearching')}</p>
                    </div>
                  )}
                </div>
              )}
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

                {/* Upload Prescription (Mobile) */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handlePrescriptionClick();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all group text-gray-600 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-50 text-brand-600 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-base font-medium">{t('util.uploadPrescription')}</span>
                  </div>
                </button>

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
                        <span className="text-base">{t('util.myCart')}</span>
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
                        <span className="text-base">{t('util.myOrders')}</span>
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
                        <span className="text-base">{t('util.dashboard')}</span>
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
                      setAuthModalView('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    <LogIn className="w-5 h-5" />
                    {t('util.signIn')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalView('signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-600 to-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:opacity-95 transition-all transform active:scale-[0.98]"
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

      {/* ── Upload Prescription Modal ── */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-brand-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('prescription.title')}</h3>
                  <p className="text-xs text-gray-500">{t('prescription.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
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
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {prescriptionPreview ? (
                      <div className="space-y-3">
                        <img
                          src={prescriptionPreview}
                          alt="Prescription preview"
                          className="max-h-48 mx-auto rounded-xl object-contain"
                        />
                        <p className="text-sm font-medium text-brand-700">{prescriptionFile?.name}</p>
                        <p className="text-xs text-slate-400">{t('prescription.changeFile')}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Upload className="w-7 h-7 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {t('prescription.clickToUpload')}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {t('prescription.fileSupport')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />

                  {/* Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-700 font-medium">
                          Make sure the prescription is clearly visible and contains:
                        </p>
                        <ul className="text-xs text-blue-600 mt-1 space-y-0.5 list-disc list-inside">
                          <li>Doctor's name and registration number</li>
                          <li>Patient's name and medicine details</li>
                          <li>Date of prescription (within 6 months)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handlePrescriptionUpload}
                    disabled={!prescriptionFile || prescriptionUploading}
                    className={`w-full py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
                      prescriptionFile && !prescriptionUploading
                        ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {prescriptionUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('prescription.uploading')}
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        {t('prescription.title')}
                      </>
                    )}
                  </button>
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
