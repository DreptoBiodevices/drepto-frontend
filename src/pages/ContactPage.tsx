import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import { MapPin, Clock, Phone, Mail, Globe } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner (Monochromatic Obsidian Slate) */}
        <section className="relative overflow-hidden pt-28 pb-16 bg-[#0B0F19] border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-teal-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Mail className="w-4 h-4 text-teal-300" />
                <span>Get In Touch</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                We'd Love to <span className="text-teal-300">Hear From You</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                Whether you have questions regarding transdermal therapeutics, research collaborations, or commercial inquiries, our team is ready to connect.
              </p>
            </div>

            {/* Quick Contact Cards (Solid Monochromatic Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center shadow-card">
                <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Phone</h3>
                <a href="tel:+918451822256" className="text-slate-300 text-sm hover:text-white transition-colors">
                  +91 84518 22256
                </a>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center shadow-card">
                <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Email</h3>
                <a href="mailto:office@dreptobiodevices.com" className="text-slate-300 text-sm hover:text-white transition-colors break-all">
                  office@dreptobiodevices.com
                </a>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center shadow-card">
                <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-slate-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">R&amp;D Hub</h3>
                <p className="text-slate-300 text-xs">SINE, IIT Bombay, Mumbai</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center shadow-card">
                <div className="w-11 h-11 mx-auto mb-3 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Working Hours</h3>
                <p className="text-slate-300 text-xs">Mon – Fri, 9am – 5pm IST</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
