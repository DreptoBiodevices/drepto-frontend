import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { supabase } from '../lib/supabase';

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
        if (rating === 0) {
            setErrorMessage('Please select a rating');
            return;
        }
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const { error } = await supabase.from('feedback').insert({
                name: name.trim(),
                email: email.trim() || null,
                rating,
                message: message.trim(),
            });

            if (error) throw error;

            setSubmitState('success');
            setName('');
            setEmail('');
            setRating(0);
            setMessage('');
        } catch (err: any) {
            console.error('Feedback submission error:', err);
            setSubmitState('error');
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitState === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-xl p-10 border border-teal-100">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-zoom-in">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 font-display mb-3">Thank You!</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Your feedback has been submitted successfully. We truly appreciate you taking the time to share your thoughts with us.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setSubmitState('idle')}
                                className="w-full py-3 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:opacity-95"
                            >
                                Submit Another
                            </button>
                            <Link
                                to="/"
                                className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all text-center"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4 md:p-6">
            <SEOHead
                title="Share Your Feedback"
                description="Share your experience with Drepto's telemedicine services. Your feedback helps us improve our healthcare platform."
                keywords="feedback, customer feedback, healthcare feedback, telemedicine review, patient experience"
                url="/feedback"
            />
            <div className="max-w-lg w-full">
                <Breadcrumbs items={[{ label: 'Feedback' }]} className="mb-6" />
                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-teal-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-teal-600 px-8 py-8 text-white text-center">
                        <img
                            src="/images/logo.png"
                            alt="Drepto Biodevices"
                            className="h-10 mx-auto mb-4 brightness-0 invert"
                        />
                        <h1 className="text-2xl md:text-3xl font-bold font-display">We Value Your Feedback</h1>
                        <p className="text-teal-100 mt-2 text-sm">Help us improve — share your experience with Drepto</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Star Rating */}
                        <div className="text-center">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">How would you rate us?</label>
                            <div className="flex items-center justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-all duration-200 hover:scale-125 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-9 h-9 transition-colors duration-200 ${star <= (hoveredRating || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-xs text-gray-400 mt-2">
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Very Good'}
                                    {rating === 5 && 'Excellent!'}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="feedback-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Your Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="feedback-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-300"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="feedback-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email <span className="text-gray-300 font-normal">(optional)</span>
                            </label>
                            <input
                                id="feedback-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-300"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="feedback-message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Your Feedback <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="feedback-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={4}
                                placeholder="Tell us about your experience…"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-300 resize-none"
                            />
                        </div>

                        {/* Error Message */}
                        {(errorMessage || submitState === 'error') && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-xl text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting…
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Feedback
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Drepto Biodevices Pvt. Ltd.
                </p>
            </div>
        </div>
    );
};

export default FeedbackPage;
