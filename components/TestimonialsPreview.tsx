import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquarePlus, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { FeedbackService } from '../lib/api_controller';
import { FeedbackSubmission } from '../types';

const TestimonialsPreview: React.FC = () => {
    const [testimonials, setTestimonials] = useState<FeedbackSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchRecentTestimonials();
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        if (testimonials.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % testimonials.length);
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [testimonials.length]);

    const fetchRecentTestimonials = async () => {
        try {
            const response = await FeedbackService.getAllApproved();
            let data = response.data || [];
            data = data.slice(0, 6);
            setTestimonials(data);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
        } finally {
            setLoading(false);
        }
    };

    const goTo = (index: number) => {
        setActiveIndex(index);
        // Reset auto-play on manual interaction
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
    };

    const goPrev = () => goTo((activeIndex - 1 + testimonials.length) % testimonials.length);
    const goNext = () => goTo((activeIndex + 1) % testimonials.length);

    // Calculate average rating
    const avgRating =
        testimonials.length > 0
            ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
            : '0';

    if (loading) {
        return (
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
            </section>
        );
    }

    // Don't render the section if there are no testimonials
    if (testimonials.length === 0) return null;

    // Get visible cards for grid (first 3)
    const gridTestimonials = testimonials.slice(0, 3);
    // Active testimonial for the spotlight
    const spotlightTestimonial = testimonials[activeIndex];

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-dark-blue mb-4">What Our Customers Say</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Real stories from people who trust Drepto Biodevices for their healthcare needs.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center gap-6 md:gap-12 mb-14 flex-wrap">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="text-3xl font-bold text-dark-blue font-display">{avgRating}</span>
                            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                        </div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Average Rating</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                    <div className="text-center">
                        <span className="text-3xl font-bold text-dark-blue font-display">{testimonials.length}</span>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Happy Customers</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(Number(avgRating))
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-gray-200 text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Overall</p>
                    </div>
                </div>

                {/* Spotlight + Cards Layout */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-8 items-start">

                        {/* Spotlight Card (large, left) */}
                        <div className="lg:col-span-2 relative">
                            <div className="bg-gradient-to-br from-primary to-teal-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                                {/* Decorative quote */}
                                <Quote className="absolute top-6 right-6 w-16 h-16 text-white/10" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>

                                <div>
                                    <div className="flex items-center gap-0.5 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= spotlightTestimonial.rating
                                                        ? 'fill-amber-300 text-amber-300'
                                                        : 'fill-white/20 text-white/20'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-white/95 text-lg leading-relaxed font-medium italic mb-8">
                                        "{spotlightTestimonial.message}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-lg">{spotlightTestimonial.name}</p>
                                        {spotlightTestimonial.created_at && (
                                            <p className="text-teal-200/70 text-xs mt-0.5">
                                                {new Date(spotlightTestimonial.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        )}
                                    </div>

                                    {/* Navigation Arrows */}
                                    {testimonials.length > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={goPrev}
                                                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors backdrop-blur-sm"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={goNext}
                                                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors backdrop-blur-sm"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Dots */}
                                {testimonials.length > 1 && (
                                    <div className="flex items-center gap-1.5 mt-4">
                                        {testimonials.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => goTo(i)}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-white w-6' : 'bg-white/30 w-1.5 hover:bg-white/50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Testimonial Cards Grid (right) */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gridTestimonials.map((t, i) => (
                                <div
                                    key={t.id || i}
                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-100 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Quote */}
                                    <div className="text-4xl font-serif text-primary/10 leading-none mb-1 group-hover:text-primary/20 transition-colors select-none">
                                        "
                                    </div>

                                    {/* Message */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
                                        {t.message}
                                    </p>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-gray-50">
                                        <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                                        <div className="flex items-center gap-0.5 mt-1.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-3.5 h-3.5 ${star <= t.rating
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-14">
                    <Link
                        to="/feedback"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-teal-600 text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        Share Your Experience
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsPreview;
