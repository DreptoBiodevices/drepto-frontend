import React, { useState } from 'react';
import { ContactService } from '../lib/api_controller';
import { Phone, Mail, MapPin, Building2, Send, CheckCircle2 } from 'lucide-react';
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
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.error('Contact submission failed', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-200/80" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Emcure Style with Red Accent */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-[#c01226]" />
            <span>CONNECT WITH OUR TEAM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold sm:font-black tracking-tight text-slate-900 leading-tight font-display">
            Contact &amp; Institutional Partnerships
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Whether you are a healthcare professional, institutional partner, or seeking personal product support, our team at SINE, IIT Bombay is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-stretch">
          
          {/* Left Column: Corporate & Laboratory Information */}
          <div className="lg:col-span-5 bg-[#ebedf1] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-300/90 flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6 font-display">
                Drepto Biodevices <span className="text-[#c01226]">Pvt. Ltd.</span>
              </h3>

              <div className="space-y-6 text-sm text-slate-700">
                {/* R&D Lab */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#c01226] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">R&amp;D &amp; Incubation Facility</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      Society for Innovation and Entrepreneurship (SINE), CSRE Building, Indian Institute of Technology Bombay, Powai, Mumbai 400076, India.
                    </p>
                  </div>
                </div>

                {/* Registered Office */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#c01226] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Registered Corporate Office</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      1001-11, Rustomjee Ozone, Goregaon West, Mumbai, Maharashtra 400104.
                    </p>
                  </div>
                </div>

                {/* Email Contacts */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#c01226] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Direct Enquiries</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                      info@dreptobiodevices.com<br />
                      support@dreptobiodevices.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Registration Badges */}
            <div className="pt-6 mt-8 border-t border-slate-300/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span className="font-bold text-slate-700">CIN:</span>
                <span className="font-mono text-slate-800">U21001MH2025PTC445595</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span className="font-bold text-slate-700">GSTIN:</span>
                <span className="font-mono text-slate-800">27AALCD6030F1ZS</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span className="font-bold text-slate-700">Incubator:</span>
                <span className="text-[#c01226] font-semibold">SINE, IIT Bombay</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Message Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-300/90 shadow-sm flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-display">
              Send a Direct Message
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Please share your requirement and our team will get in touch promptly.
            </p>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Thank You!</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Your message has been received by our scientific and corporate communications team. We will respond within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Priya Verma"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c01226] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@organization.com"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c01226] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c01226] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nature of Inquiry *
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c01226] focus:bg-white transition-colors text-slate-700"
                    >
                      <option value="">Select Category</option>
                      <option value="MenstroHerb Order / Feedback">MenstroHerb Order &amp; Product Support</option>
                      <option value="Clinical / Medical Research Partnership">Clinical &amp; Medical Research</option>
                      <option value="Pharmacy / Distribution Tie-up">Pharmacy &amp; Distribution Partnership</option>
                      <option value="Transdermal Formulation Licensing">Transdermal Matrix Licensing</option>
                      <option value="Other">General Corporate Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your query or how you would like to collaborate..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c01226] focus:bg-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#c01226] hover:bg-red-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Scientific Team</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
