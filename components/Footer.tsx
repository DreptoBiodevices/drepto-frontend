import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001a2c] text-white border-t border-white/5">
      <div className="container mx-auto px-6 py-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Logo & Company Info */}
          <div className="flex flex-col gap-6">
            <img
              src="/images/logo.png"
              alt="Drepto Biodevices Logo"
              className="h-10 w-auto brightness-0 invert self-start"
            />
            <p className="text-teal-100/60 text-sm leading-relaxed">
              Advancing healthcare through innovative biodevice solutions and diagnostic excellence.
            </p>
            {/* Registration Details */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] tracking-widest uppercase">
                <span className="text-teal-400 font-bold">GSTIN</span>
                <span className="text-white/80 font-mono select-all">27AALCD6030F1ZS</span>
              </div>
              <div className="flex items-center justify-between text-[10px] tracking-widest uppercase">
                <span className="text-teal-400 font-bold">CIN</span>
                <span className="text-white/80 font-mono select-all">U21001MH2025PTC445595</span>
              </div>
            </div>
          </div>

          {/* Column 2: Addresses */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-4 text-teal-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-bold text-xs uppercase tracking-[0.2em]">Our Locations</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white text-xs font-bold mb-1 opacity-50 uppercase tracking-tighter">Office Address</h4>
                <p className="text-teal-50 text-sm leading-relaxed">
                  SINE IIT Bombay, Mumbai 400076, India
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold mb-1 opacity-50 uppercase tracking-tighter">Registered Address</h4>
                <p className="text-teal-100/80 text-sm leading-relaxed">
                  1001-T1, Rustomjee Ozone, Goregaon West,<br />
                  Mumbai, Maharashtra 400104, India
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Company</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/about-us" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">About Us</Link>
                <Link to="/contact-section" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Contact</Link>
                <Link to="/our-products" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Pharmacy</Link>
                <Link to="/lab-tests" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Lab Tests</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Legal</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/privacy-policy" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Terms of Service</Link>
                <Link to="/refund-policy" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Refund Policy</Link>
                <Link to="/shipping-policy" className="text-teal-100/60 hover:text-teal-400 text-sm transition-colors">Shipping Policy</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-teal-200/40 text-[11px] font-medium tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Drepto Biodevices Pvt. Ltd.</p>
          <p>Designed with excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;