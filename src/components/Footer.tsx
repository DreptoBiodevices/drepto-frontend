import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Building2, MapPin, Mail, ShieldCheck, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-950 text-slate-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Column 1: Brand & SINE IIT Bombay (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Link to="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="Drepto Biodevices Logo"
                className="h-9 w-auto brightness-0 invert opacity-95"
              />
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Drepto Biodevices is a deep-tech biomedical enterprise incubated at SINE, IIT Bombay. We pioneer non-invasive transdermal drug delivery platforms—headlined by MenstroHerb™—delivering gentle, targeted therapeutic relief for feminine hygiene and chronic inflammatory conditions without oral side effects.
            </p>

            {/* Corporate Regulatory Credentials */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10 max-w-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Corporate ID (CIN)</span>
                <span className="text-slate-300 font-mono select-all">U21001MH2025PTC445595</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">GSTIN</span>
                <span className="text-slate-300 font-mono select-all">27AALCD6030F1ZS</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Incubator Hub</span>
                <span className="text-red-400 font-semibold">SINE, IIT Bombay</span>
              </div>
            </div>
          </div>

          {/* Column 2: Therapeutic Innovations & Products (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">
              Therapeutics
            </h4>
            <nav className="flex flex-col space-y-2.5 text-xs sm:text-sm">
              <Link to="/our-products" className="text-slate-400 hover:text-red-400 transition-colors">
                MenstroHerb™ Patch
              </Link>
              <Link to="/our-products" className="text-slate-400 hover:text-red-400 transition-colors">
                Menstrual Care Packs
              </Link>
              <Link to="/our-research" className="text-slate-400 hover:text-red-400 transition-colors">
                Transdermal Matrix R&amp;D
              </Link>
              <Link to="/our-research" className="text-slate-400 hover:text-red-400 transition-colors">
                ArthriTrans System
              </Link>
              <Link to="/our-products" className="text-slate-400 hover:text-red-400 transition-colors">
                All Products
              </Link>
            </nav>
          </div>

          {/* Column 3: Corporate & Clinical (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">
              Company
            </h4>
            <nav className="flex flex-col space-y-2.5 text-xs sm:text-sm">
              <Link to="/about-us" className="text-slate-400 hover:text-red-400 transition-colors">
                About Drepto
              </Link>
              <Link to="/about-us" className="text-slate-400 hover:text-red-400 transition-colors">
                Founder &amp; Leadership
              </Link>
              <Link to="/our-research" className="text-slate-400 hover:text-red-400 transition-colors">
                Clinical Research Dossier
              </Link>
              <Link to="/contact" className="text-slate-400 hover:text-red-400 transition-colors">
                Institutional Enquiries
              </Link>
              <Link to="/feedback" className="text-slate-400 hover:text-red-400 transition-colors">
                Patient Feedback
              </Link>
            </nav>
          </div>

          {/* Column 4: Laboratory & Facility Addresses (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">
              Laboratory &amp; Offices
            </h4>
            
            <div className="space-y-3.5 text-xs text-slate-400">
              <div>
                <p className="text-slate-200 font-semibold mb-0.5">R&amp;D &amp; Incubation Hub:</p>
                <p className="leading-relaxed">
                  Society for Innovation &amp; Entrepreneurship (SINE), CSRE Bldg, IIT Bombay, Powai, Mumbai 400076.
                </p>
              </div>

              <div>
                <p className="text-slate-200 font-semibold mb-0.5">Corporate Office:</p>
                <p className="leading-relaxed">
                  1001-11, Rustomjee Ozone, Goregaon West, Mumbai, Maharashtra 400104.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-slate-300 font-medium">Direct Inquiries:</p>
                <a
                  href="mailto:info@dreptobiodevices.com"
                  className="text-red-400 hover:underline"
                >
                  info@dreptobiodevices.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Legal & Attribution */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Drepto Biodevices Pvt. Ltd. Incubated at SINE, IIT Bombay. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="hover:text-slate-400 transition-colors">
              Refund Policy
            </Link>
            <Link to="/shipping-policy" className="hover:text-slate-400 transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
