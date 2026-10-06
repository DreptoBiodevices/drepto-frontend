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

            {/* Hero */}
            <section className="relative pt-28 pb-16 bg-gradient-to-br from-[#001a2c] via-[#002a3f] to-[#001a2c] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-teal-300/70 hover:text-teal-200 transition-colors mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">
                        What Our Customers Say
                    </h1>
                    <p className="text-teal-200/70 max-w-xl mx-auto mb-8">
                        Real feedback from real people who trust Drepto Biodevices for their healthcare needs.
                    </p>

                    {/* Stats */}
                    {testimonials.length > 0 && (
                        <div className="flex items-center justify-center gap-8 flex-wrap">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
                                <div className="text-3xl font-bold text-white font-display">{averageRating}</div>
                                <div className="flex items-center justify-center mt-1">
                                    {renderStars(Math.round(Number(averageRating)), 'w-4 h-4')}
                                </div>
                                <p className="text-teal-200/60 text-xs mt-1 uppercase tracking-wider">Avg Rating</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
                                <div className="text-3xl font-bold text-white font-display">{testimonials.length}</div>
                                <p className="text-teal-200/60 text-xs mt-1 uppercase tracking-wider">Reviews</p>
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
                                    ? 'bg-primary text-white shadow-sm'
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
                                        ? 'bg-primary text-white shadow-sm'
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
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:opacity-95 whitespace-nowrap"
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
                        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
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
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
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
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-100 transition-all duration-300 group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Quote Mark */}
                                <div className="text-5xl font-serif text-primary/10 leading-none mb-2 group-hover:text-primary/20 transition-colors">
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
