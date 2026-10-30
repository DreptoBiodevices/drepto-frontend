import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquarePlus, ArrowLeft, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FeedbackService } from '../lib/api_controller';
import { FeedbackSubmission } from '../types';

const TestimonialsPage: React.FC = () => {
    const [testimonials, setTestimonials] = useState<FeedbackSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<number | null>(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await FeedbackService.getAllApproved();
            const data = response.data;
            setTestimonials(data || []);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTestimonials = filter
        ? testimonials.filter((t) => t.rating === filter)
        : testimonials;

    const averageRating =
        testimonials.length > 0
            ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
            : '0.0';

    const renderStars = (rating: number, size = 'w-4 h-4') => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${size} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                        }`}
                />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero: Luminous Healthcare */}
            <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f1f3f6] border-b border-slate-200/80 overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#c01226] transition-colors mb-6 text-sm font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs mx-auto">
                        <span>CLINICAL &amp; PATIENT FEEDBACK</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-display mb-4">
                        What Our Customers Say
                    </h1>
                    <p className="text-slate-600 max-w-xl mx-auto mb-8 text-base">
                        Real feedback from real people who trust Drepto Biodevices for their healthcare needs.
                    </p>

                    {/* Stats */}
                    {testimonials.length > 0 && (
                        <div className="flex items-center justify-center gap-8 flex-wrap">
                            <div className="bg-[#ebedf1] rounded-[2rem] px-8 py-5 border border-slate-200/80 shadow-2xs">
                                <div className="text-3xl font-black text-slate-900 font-display">{averageRating}</div>
                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Average Rating</div>
                            </div>
                            <div className="bg-[#ebedf1] rounded-[2rem] px-8 py-5 border border-slate-200/80 shadow-2xs">
                                <div className="text-3xl font-black text-slate-900 font-display">{testimonials.length}</div>
                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Verified Reviews</div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Filter Bar & CTA */}
            <section className="container mx-auto px-6 -mt-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium mr-1">Filter:</span>
                        <button
                            onClick={() => setFilter(null)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === null
                                    ? 'bg-[#c01226] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {[5, 4, 3, 2, 1].map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilter(filter === r ? null : r)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filter === r
                                        ? 'bg-[#c01226] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {r} <Star className="w-3 h-3 fill-current" />
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link
                        to="/feedback"
                        className="flex items-center gap-2 bg-[#c01226] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:opacity-95 whitespace-nowrap"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        Leave Your Feedback
                    </Link>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="container mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-3 border-red-500/20 border-t-[#c01226] rounded-full animate-spin" />
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquarePlus className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-600 mb-2">
                            {filter ? 'No reviews with this rating yet' : 'No testimonials yet'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {filter ? 'Try a different filter or' : 'Be the first to'} share your experience!
                        </p>
                        <Link
                            to="/feedback"
                            className="inline-flex items-center gap-2 bg-[#c01226] text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                        >
                            <MessageSquarePlus className="w-4 h-4" />
                            Leave Your Feedback
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTestimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id || index}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-300 group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Quote Mark */}
                                <div className="text-5xl font-serif text-[#c01226]/10 leading-none mb-2 group-hover:text-[#c01226]/20 transition-colors">
                                    "
                                </div>

                                {/* Message */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
                                    {testimonial.message}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{testimonial.name}</p>
                                        {testimonial.created_at && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(testimonial.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    {renderStars(testimonial.rating)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default TestimonialsPage;
