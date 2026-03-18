import React, { useState } from 'react';
import { ContactService } from '../lib/api_controller';
import { Phone, Linkedin, Mail, Send, CheckCircle, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── tiny helpers ─────────────────────────────────────────── */

const Field: React.FC<{
  id: string; label: string; required?: boolean;
  children: React.ReactNode;
}> = ({ id, label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold tracking-widest uppercase text-gray-400">
      {label}{required && <span className="text-primary ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-0 py-2.5 bg-transparent border-0 border-b border-gray-200 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors duration-200';

/* ─── main component ───────────────────────────────────────── */

const ContactSection: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', contactNumber: '', subject: '', message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await ContactService.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', contactNumber: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Contact Form ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* split: heading left / form right */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24 items-start">

            {/* left column */}
            <div className="lg:sticky lg:top-24 pt-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-6">Contact</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] mb-6">
                Let's talk<br />about your<br />project.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xs">
                We respond to every enquiry within 24 hours on business days.
              </p>

              {/* contact details — no cards, just ruled rows */}
              <div className="divide-y divide-gray-100">
                {[
                  { Icon: Mail,     label: 'Email',   value: 'office@dreptobiodevices.com', href: 'mailto:office@dreptobiodevices.com' },
                  { Icon: Phone,    label: 'Phone',   value: '+91 84518 22256',             href: 'tel:+918451822256' },
                  { Icon: Linkedin, label: 'LinkedIn',value: 'Drepto Biodevices',           href: 'https://www.linkedin.com/company/drepto-biodevices-pvt-ltd/posts/?feedView=all' },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4 py-4">
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-0.5">{label}</p>
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-gray-700 hover:text-primary transition-colors truncate block">
                        {value}
                      </a>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 py-4">
                  <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-gray-400" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6.5"/><path d="M8 4v4l2.5 2.5"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-0.5">Hours</p>
                    <p className="text-sm text-gray-700">Mon – Fri, 9 am – 5 pm IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* right column — form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-start gap-4 py-16">
                  <CheckCircle className="w-10 h-10 text-primary" />
                  <h3 className="text-2xl font-bold text-gray-900">Message received.</h3>
                  <p className="text-gray-500 text-sm">We'll be in touch within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-semibold tracking-widest uppercase text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity">
                    Send another →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {error && (
                    <p className="text-red-500 text-sm border-l-2 border-red-400 pl-3">{error}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Field id="name" label="Name" required>
                      <input type="text" id="name" value={formData.name} onChange={handleChange}
                        required className={inputCls} placeholder="Jane Smith" />
                    </Field>
                    <Field id="email" label="Email" required>
                      <input type="email" id="email" value={formData.email} onChange={handleChange}
                        required className={inputCls} placeholder="jane@example.com" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Field id="contactNumber" label="Phone">
                      <input type="tel" id="contactNumber" value={formData.contactNumber} onChange={handleChange}
                        className={inputCls} placeholder="+91 98765 43210" />
                    </Field>
                    <Field id="subject" label="Subject" required>
                      <input type="text" id="subject" value={formData.subject} onChange={handleChange}
                        required className={inputCls} placeholder="Partnership inquiry" />
                    </Field>
                  </div>

                  <Field id="message" label="Message" required>
                    <textarea id="message" rows={5} value={formData.message} onChange={handleChange}
                      required className={`${inputCls} resize-none`}
                      placeholder="Tell us about your project or question…" />
                  </Field>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-gray-400">Fields marked <span className="text-primary">*</span> are required</p>
                    <button type="submit" disabled={loading}
                      className="inline-flex items-center gap-2.5 bg-primary text-white text-sm font-semibold px-7 py-3.5 rounded-[0.25rem] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Hiring Banner ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="relative overflow-hidden bg-primary rounded-md px-10 py-16 md:px-16 md:py-20">

            {/* decorative ruled lines — architectural texture */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <div key={i}
                  className="absolute top-0 bottom-0 border-r border-white/5"
                  style={{ left: `${(i + 1) * 12.5}%` }} />
              ))}
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
              {/* text block */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">Careers</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  Join our team.<br />Shape medical technology.
                </h2>
                <p className="text-white/60 text-sm max-w-lg leading-relaxed mb-8">
                  We're a small, ambitious team building diagnostic tools that matter. 
                  If you're driven by impact and want to work on hard problems in healthcare, we want to hear from you.
                </p>

                {/* three pillars — stripped back, no icon circles */}
                <div className="flex flex-wrap gap-6">
                  {[
                    'Cutting-edge research',
                    'Collaborative culture',
                    'Real career growth',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a href="https://forms.gle/Li6JY1YQW5fs8bUW8" target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-3 bg-white text-primary text-sm font-bold px-8 py-4 rounded-[0.25rem] hover:bg-white/90 transition-colors duration-200">
                Apply now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;