import React, { useState } from 'react';
import { ContactService } from '../lib/api_controller';
import { Phone, Linkedin, Mail, Clock, MapPin, Send, Building2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ContactService.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', contactNumber: '', subject: '', message: '' });
    } catch (err: any) {
      console.error("Contact submission failed", err);
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80 relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/90 text-brand-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Corporate &amp; Clinical Correspondence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Connect with Our Clinical &amp; R&amp;D Team
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Whether inquiring about transdermal therapeutic formulation access, clinical research partnerships, or commercial distribution, our interdisciplinary team is ready to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-6xl mx-auto items-start">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-soft">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Send an Official Inquiry
            </h3>
            <p className="text-sm text-slate-500 mb-8 font-normal">
              Direct submission routed to Drepto Biodevices corporate desk.
            </p>

            {submitted ? (
              <div className="text-center py-12 px-6 bg-brand-50/50 rounded-2xl border border-brand-200/80">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{t('contact.thankYou')}</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">{t('contact.successMessage')}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 underline underline-offset-4"
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('contact.name')} *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Dr. / Mr. / Ms. Full Name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('contact.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="corporate@institution.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('contact.contactNumber')}</label>
                    <input
                      type="tel"
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('contact.subject')} *</label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Clinical Trial / Wholesale / Inquiry"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('contact.message')} *</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please describe your clinical or commercial requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all leading-relaxed"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-700/20 transition-all active:scale-98 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t('contact.sending')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Corporate Coordinates & Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Corporate Location Card */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                Corporate Coordinates
              </h3>

              {/* Incubation Lab */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-200/80">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800">R&amp;D &amp; Incubation Facility</h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">SINE, IIT Bombay</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Powai, Mumbai 400076, Maharashtra, India</p>
                </div>
              </div>

              {/* Registered Office */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Office</h4>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Drepto Biodevices Pvt. Ltd.</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    1001-11, Rustomjee Ozone, Behind Teleexch, Goregaon West, Mumbai, Maharashtra 400104.
                  </p>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="pt-4 border-t border-slate-100 space-y-3.5">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-brand-700 shrink-0" />
                  <a href="mailto:office@dreptobiodevices.com" className="font-semibold text-slate-700 hover:text-brand-700 transition-colors">
                    office@dreptobiodevices.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a href="tel:+918451822256" className="font-semibold text-slate-700 hover:text-brand-700 transition-colors">
                    +91 84518 22256
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Mon – Fri, 09:00 – 17:00 IST</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Linkedin className="w-4 h-4 text-[#0077b5] shrink-0" />
                  <a
                    href="https://www.linkedin.com/company/drepto-biodevices-pvt-ltd/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-700 hover:text-[#0077b5] transition-colors"
                  >
                    LinkedIn Corporate Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Careers Pill Card */}
            <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white p-7 rounded-3xl shadow-soft">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-brand-200 text-[10px] font-bold uppercase tracking-wider mb-3">
                Talent &amp; Clinical Fellowship
              </div>
              <h4 className="text-lg font-bold text-white mb-1.5">
                Looking to Join Our Biomedical Team?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                We are actively accepting CVs for pharmaceutical formulation scientists, clinical research coordinators, and biomedical engineers.
              </p>
              <a
                href="https://forms.gle/Li6JY1YQW5fs8bUW8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-colors"
              >
                <span>Submit Candidate Application</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
