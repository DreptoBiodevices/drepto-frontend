import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { ShieldCheck, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      
      {/* Top Institutional Certification Strip */}
      <div className="border-b border-white/10 bg-slate-900/60 py-4 px-6 text-xs text-slate-300">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              SINE, IIT Bombay Incubated Deeptech
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>ISO 10993-23 Certified Biocompatibility</span>
            <span className="hidden md:inline text-white/20">•</span>
            <span className="font-mono text-slate-400">Patent App: IN202521129798</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-slate-400">
            <span>CIN: U21001MH2025PTC445595</span>
            <span>GSTIN: 27AALCD6030F1ZS</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Column 1: Logo & Company Mission (5 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <img
              src="/images/logo.png"
              alt="Drepto Biodevices Logo"
              className="h-10 w-auto brightness-0 invert self-start object-contain"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-1">
              Drepto Biodevices is a deep-tech biomedical therapeutics company developing targeted, non-invasive transdermal therapeutic delivery platforms to overcome oral dosage limitations and systemic toxicity.
            </p>

            <div className="pt-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="p-2 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </span>
              <span>Compliant with Indian Medical Device Rules (MDR) &amp; ISO Standards</span>
            </div>
          </div>

          {/* Column 2: Facility Coordinates (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-brand-400 mb-2">
              <MapPin className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-widest">{t('footer.ourLocations')}</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-brand-300 font-bold uppercase tracking-wider mb-1">Incubation &amp; R&amp;D Facility</h4>
                <p className="text-slate-300 leading-relaxed">
                  Society for Innovation and Development (SINE), CSRE Building, Indian Institute of Technology Bombay, Powai, Mumbai 400076, India.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-slate-400 font-bold uppercase tracking-wider mb-1">Corporate Registered Office</h4>
                <p className="text-slate-300 leading-relaxed">
                  1001-11, Rustomjee Ozone, Behind Teleexch, Goregaon West, Mumbai, Maharashtra 400104.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 & 4: Quick Navigation & Legal (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">{t('footer.company')}</h4>
              <nav className="flex flex-col gap-2.5">
                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">{t('nav.home')}</Link>
                <Link to="/our-products" className="text-slate-400 hover:text-white text-sm transition-colors">{t('nav.ourProducts') || 'Our Products'}</Link>
                <Link to="/our-research" className="text-slate-400 hover:text-white text-sm transition-colors">Our Research</Link>
                <Link to="/about-us" className="text-slate-400 hover:text-white text-sm transition-colors">{t('nav.aboutUs')}</Link>
                <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">{t('nav.contact')}</Link>
                <Link to="/feedback" className="text-slate-400 hover:text-white text-sm transition-colors">Feedback</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">{t('footer.legal')}</h4>
              <nav className="flex flex-col gap-2.5">
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                <Link to="/refund-policy" className="text-slate-400 hover:text-white text-sm transition-colors">Refund Policy</Link>
                <Link to="/shipping-policy" className="text-slate-400 hover:text-white text-sm transition-colors">Shipping Policy</Link>
              </nav>
            </div>
          </div>

        </div>

        {/* Regulatory & Clinical Disclaimer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-slate-500 text-[11px] leading-relaxed max-w-5xl">
          <p>
            <strong className="text-slate-400">Medical &amp; Regulatory Notice:</strong> The information provided on this platform is for clinical research, informational, and authorized product distribution purposes. Drepto Biodevices products are manufactured following stringent quality control and evaluated in accordance with applicable biocompatibility protocols. Statements regarding efficacy are grounded in ex-vivo Franz cell permeation data and preclinical testing. Always consult with a licensed rheumatologist, gynecologist, or healthcare professional before initiating specialized therapeutic interventions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} Drepto Biodevices Pvt. Ltd. All Rights Reserved.</p>
          <p className="text-slate-500">Pioneering Non-Invasive Transdermal Medicine • SINE, IIT Bombay</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
