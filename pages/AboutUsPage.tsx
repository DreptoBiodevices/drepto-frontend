import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import VideoTestimonialsSection from '../components/VideoTestimonialsSection';
import { Award, Target, Lightbulb, Users } from 'lucide-react';

const AboutUsPage: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // dummy refs for Navbar since we aren't on the landing page
    const dummyRefs = {
        homeRef: React.useRef(null),
        aboutRef: React.useRef(null),
        teamRef: React.useRef(null),
        galleryRef: React.useRef(null),
        contactRef: React.useRef(null),
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar
                sectionRefs={dummyRefs as any}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main className="flex-grow">
                {/* Hero Banner */}
                <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-brand-900 via-teal-900 to-slate-900">
                    <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-200 text-sm font-bold mb-8">
                                <Users className="w-4 h-4" />
                                <span>About Drepto Biodevices</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                                Innovating Healthcare,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-teal-300">
                                    Transforming Lives
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                                We are a pioneering biomedical startup building next-generation transdermal drug delivery
                                systems to make healthcare less invasive, more accessible, and truly patient-centered.
                            </p>
                        </div>

                        {/* Highlight Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto">
                            {[
                                { icon: <Target className="w-5 h-5" />, label: 'Founded', value: '2025' },
                                { icon: <Award className="w-5 h-5" />, label: 'Based at', value: 'IIT Bombay' },
                                { icon: <Lightbulb className="w-5 h-5" />, label: 'Focus', value: 'Drug Delivery' },
                                { icon: <Users className="w-5 h-5" />, label: 'Incubated at', value: 'SINE' },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors"
                                >
                                    <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300">
                                        {stat.icon}
                                    </div>
                                    <div className="text-white font-bold text-lg">{stat.value}</div>
                                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Purpose / Mission / Vision */}
                <AboutSection />

                {/* Gallery */}
                <GallerySection />

                {/* Team */}
                <TeamSection />

                {/* Video Testimonials */}
                <VideoTestimonialsSection />

                {/* Contact */}
                <ContactSection />
            </main>

            <Footer />
        </div >
    );
};

export default AboutUsPage;
