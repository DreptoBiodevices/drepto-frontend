import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-blue text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Main Flex Wrapper */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">

          {/* Left Side: Logo & Address Card */}
          <div className="flex flex-col gap-6 max-w-sm">
            <img
              src="/images/logo.png"
              alt="Drepto Biodevices Pvt. Ltd. Logo"
              className="h-12 w-auto brightness-0 invert self-start"
            />

            <div className="">
              {/* Header with Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold tracking-wide uppercase text-xs">Registered Office</h3>
              </div>

              {/* Address Lines */}
              <div className="space-y-1 mb-6">
                <p className="text-teal-50 font-medium leading-relaxed">
                  1001-T1, Rustomjee Ozone Co-op Housing
                </p>
                <p className="text-teal-100/70 text-sm leading-relaxed">
                  Behind Telephone Exchange, Goregaon West <br />
                  Mumbai, Maharashtra 400104, India
                </p>
              </div>

              {/* Registration Details */}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] tracking-wider uppercase">
                  <span className="text-teal-500 font-bold">GSTIN</span>
                  <span className="text-white font-mono select-all">27AALCD6030F1ZS</span>
                </div>
                <div className="flex items-center justify-between text-[11px] tracking-wider uppercase">
                  <span className="text-teal-500 font-bold">CIN</span>
                  <span className="text-white font-mono select-all">U21001MH2025PTC445595</span>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>

          {/* Right Side: Link Grids */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 w-full lg:w-auto">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-lg mb-1">Services</h4>
              <a href="/our-products" className="text-teal-100/80 hover:text-white text-sm transition-colors">Pharmacy</a>
              <a href="/lab-tests" className="text-teal-100/80 hover:text-white text-sm transition-colors">Lab Tests</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-lg mb-1">Company</h4>
              <a href="/about-us" className="text-teal-100/80 hover:text-white text-sm transition-colors">About Us</a>
              <a href="/contact-section" className="text-teal-100/80 hover:text-white text-sm transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-lg mb-1">Legal</h4>
              <Link to="/privacy-policy" className="text-teal-100/80 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-teal-100/80 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/refund-policy" className="text-teal-100/80 hover:text-white text-sm transition-colors">Refund Policy</Link>
              <Link to="/shipping-policy" className="text-teal-100/80 hover:text-white text-sm transition-colors">Shipping Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-teal-700/50 mt-16 pt-8 text-center text-teal-200/50 text-xs">
          &copy; {new Date().getFullYear()} Drepto Biodevices Pvt.Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;