import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import { MapPin, Phone, Mail, Building2 } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* ── Luminous Healthcare Hero Banner ── */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f1f3f6] border-b border-slate-200/80">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-2xs">
                <Mail className="w-4 h-4 text-[#c01226]" />
                <span>GET IN TOUCH</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6 font-display">
                We'd Love to{' '}
                <span className="text-[#c01226]">
                  Hear From You
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                Whether you have an institutional inquiry about MenstroHerb, clinical research co-development, or distribution partnerships, our team at SINE, IIT Bombay is here to assist.
              </p>
            </div>

            {/* Quick Contact Cards: Signature Emcure-inspired Soft Grey Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-[#ebedf1] rounded-[2rem] p-6 text-center border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#c01226] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-[#c01226]" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-1">Direct Phone</h3>
                <a href="tel:+918451822256" className="text-slate-600 text-sm font-medium hover:text-[#c01226] transition-colors">
                  +91 84518 22256
                </a>
              </div>

              <div className="bg-[#ebedf1] rounded-[2rem] p-6 text-center border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#c01226] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5 text-[#c01226]" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-1">Corporate Email</h3>
                <a href="mailto:info@dreptobiodevices.com" className="text-slate-600 text-sm font-medium hover:text-[#c01226] transition-colors break-all">
                  info@dreptobiodevices.com
                </a>
              </div>

              <div className="bg-[#ebedf1] rounded-[2rem] p-6 text-center border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all sm:col-span-2 lg:col-span-1 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#c01226] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 text-[#c01226]" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-1">Incubation Lab</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-medium">
                  SINE, IIT Bombay, Mumbai 400076
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Contact Section & Transmission Form */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
