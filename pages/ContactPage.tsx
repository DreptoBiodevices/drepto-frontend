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
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-32 pb-16 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-400/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-200 text-sm font-bold mb-6">
                <Mail className="w-4 h-4" />
                <span>Get In Touch</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                We'd Love to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-teal-300">
                  Hear From You
                </span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Whether you have a question about our products, partnerships, or anything else — 
                our team is here to help.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-brand-300" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Phone</h3>
                <a href="tel:+918451822256" className="text-slate-300 text-sm hover:text-brand-300 transition-colors">
                  +91 84518 22256
                </a>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-300" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Email</h3>
                <a href="mailto:office@dreptobiodevices.com" className="text-slate-300 text-sm hover:text-brand-300 transition-colors break-all">
                  office@dreptobiodevices.com
                </a>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-brand-300" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Office</h3>
                <p className="text-slate-300 text-sm">SINE IIT Bombay, Mumbai 400076</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand-300" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Hours</h3>
                <p className="text-slate-300 text-sm">Mon - Fri, 9am - 5pm IST</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <ContactSection />

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Find Us</h2>
              <p className="text-slate-500 text-base">Visit our office at SINE, IIT Bombay</p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5025!2d72.9149!3d19.1334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7f4e3e7c7f5%3A0x1234567890abcdef!2sSINE%20IIT%20Bombay!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Drepto Biodevices Office Location"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
