import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const inputCls = 'w-full px-0 py-2.5 bg-transparent border-0 border-b border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors duration-200';

const Field: React.FC<{ label: string; required?: boolean; optional?: boolean; children: React.ReactNode }> = ({ label, required, optional, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
      {label}
      {required && <span className="text-primary ml-0.5">*</span>}
      {optional && <span className="text-gray-300 ml-1 normal-case font-normal tracking-normal">optional</span>}
    </label>
    {children}
  </div>
);

const LABELS: Record<number, string> = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very good', 5: 'Excellent' };

const dummyRefs = {
  home: { current: null }, product: { current: null },
  about: { current: null }, contact: { current: null },
};

const FeedbackPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setErrorMessage('Please select a rating.'); return; }
    setIsSubmitting(true); setErrorMessage('');
    try {
      const { error } = await supabase.from('feedback').insert({
        name: name.trim(), email: email.trim() || null, rating, message: message.trim(),
      });
      if (error) throw error;
      setSubmitState('success');
      setName(''); setEmail(''); setRating(0); setMessage('');
    } catch (err: any) {
      setSubmitState('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SEOHead
        title="Share Your Feedback — Drepto"
        description="Share your experience with Drepto Biodevices. Your feedback helps us improve our healthcare products."
        keywords="feedback, review, healthcare, Drepto Biodevices"
        url="/feedback"
      />

      <Navbar sectionRefs={dummyRefs as any} />

      {/* flex-1 + items-center = horizontally centred between navbar and footer */}
      <main className="flex-1 flex justify-center px-6 pb-8">
        <div className="w-full max-w-4xl">

          <div className="py-4">
            <Breadcrumbs items={[{ label: 'Feedback' }]} />
          </div>

          {submitState === 'success' ? (
            /* ── success ──────────────────────────────────────────── */
            <div className="text-center">
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-5" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank you.</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Your feedback has been submitted. We appreciate you taking the time.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setSubmitState('idle')}
                  style={{ borderRadius: '0.25rem' }}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Submit another <Send className="w-4 h-4" />
                </button>
                <Link
                  to="/"
                  style={{ borderRadius: '0.25rem' }}
                  className="w-full flex items-center justify-center py-3 border border-gray-200 text-sm text-gray-500 font-medium hover:border-gray-400 transition-colors"
                >
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            /* ── form ─────────────────────────────────────────────── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Header and Rating */}
              <div>
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Feedback</p>
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    Share your<br />experience.
                  </h1>
                </div>

                {/* star rating */}
                <div>
                  <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-4">
                    Rating<span className="text-primary ml-0.5">*</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-10 h-10 transition-colors duration-150 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-100 text-gray-200'
                        }`} />
                      </button>
                    ))}
                    {(hoveredRating || rating) > 0 && (
                      <span className="ml-4 text-base text-gray-400 font-medium">
                        {LABELS[hoveredRating || rating]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Form fields */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Field label="Name" required>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Smith" className={inputCls} />
                    </Field>
                    <Field label="Email" optional>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Your feedback" required>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="Tell us about your experience…"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {(errorMessage || submitState === 'error') && (
                    <p className="text-xs text-red-500 border-l-2 border-red-400 pl-3">
                      {errorMessage || 'Something went wrong. Please try again.'}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ borderRadius: '0.25rem' }}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>Submitting… <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>
                    ) : (
                      <>Submit feedback <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedbackPage;
