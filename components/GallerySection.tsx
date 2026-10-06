import React, { useState, useEffect } from 'react';
import { IKContext, IKImage } from 'imagekitio-react';

const urlEndpoint = 'https://ik.imagekit.io/ke6x9gsjs';
const publicKey = 'public_Hauz4WSMbOr/vm58ZbnpsPR/h1o=';

const galleryImagePaths = [
    'Drepto/45.jpeg',
    'Drepto/11.jpeg', 'Drepto/42.jpeg', 'Drepto/10.jpg',
    'Drepto/5.jpg', 'Drepto/4.jpg', 'Drepto/9.jpeg', 'Drepto/44.jpeg'
];

const awardImagePaths = ['Drepto/aweard1.jpeg'];

const GallerySection: React.FC<{ onOpenMenu?: () => void }> = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [awardIndex, setAwardIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);


    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % galleryImagePaths.length);
            if (awardImagePaths.length > 1) {
                setAwardIndex((prev) => (prev + 1) % awardImagePaths.length);
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
            <section
                className="relative py-24 overflow-hidden bg-slate-50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">

                    {/* --- MODERN GALLERY SECTION --- */}
                    <div className="max-w-6xl mx-auto mb-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div className="space-y-2">
                                <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm block ml-1">Visual Journey</span>
                                <h2 className="text-5xl font-display font-black text-slate-900 leading-tight">Gallery</h2>
                            </div>
                            <div className="relative w-full group">
                                {/* --- Previous Button (Left) --- */}
                                <button
                                    onClick={() => setCurrentIndex((prev) => (prev === 0 ? galleryImagePaths.length - 1 : prev - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 hover:text-primary transition-all duration-300 backdrop-blur-sm"
                                    aria-label="Previous Slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* --- Next Button (Right) --- */}
                                <button
                                    onClick={() => setCurrentIndex((prev) => (prev + 1) % galleryImagePaths.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg text-gray-800 hover:text-primary transition-all duration-300 backdrop-blur-sm"
                                    aria-label="Next Slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Main Image Viewport */}
                        <div className="relative group">
                            <div
                                className="overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-white transition-all duration-500 ease-in-out aspect-video"
                            >
                                <div
                                    className="flex transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1) h-full"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {galleryImagePaths.map((path, index) => (
                                        <div key={index} className="w-full flex-shrink-0 h-full relative flex items-center justify-center bg-gray-50">
                                            <IKImage
                                                path={path}
                                                transformation={[{ width: "1200" }]}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {/* Modern Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination Pill */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center gap-3 border border-white/50 z-20">
                                {galleryImagePaths.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`transition-all duration-300 rounded-full ${i === currentIndex ? 'bg-primary w-8 h-2' : 'bg-slate-300 w-2 h-2 hover:bg-primary/50'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- PRESTIGE AWARDS SECTION --- */}
                    <div className="max-w-5xl mx-auto">
                        <div className="relative p-1 bg-gradient-to-br from-amber-200 via-primary/20 to-amber-200 rounded-[3rem]">
                            <div className="bg-slate-900
                             overflow-hidden p-8 md:p-16">
                                <div className="grid md:grid-cols-2 gap-12 items-center">

                                    <div className="order-2 md:order-1 space-y-6">
                                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase">
                                            Recognition of Excellence
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Awards & Distinction</h2>
                                        <p className="text-slate-400 text-lg leading-relaxed">
                                            Celebrating the milestones that define our commitment to quality,
                                            innovation, and excellence in every project we undertake.
                                        </p>
                                        <div className="flex items-center gap-4 pt-4">
                                            <div className="h-[2px] w-12 bg-amber-500"></div>
                                            <span className="text-white font-medium uppercase tracking-widest text-sm">Certified Achievement</span>
                                        </div>
                                    </div>

                                    <div className="order-1 md:order-2 relative">
                                        {/* Luxury Image Frame */}
                                        <div className="relative z-10 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                                            <div className="overflow-hidden rounded-xl aspect-[4/5] bg-slate-800">
                                                <div
                                                    className="flex transition-transform duration-700 ease-in-out h-full"
                                                    style={{ transform: `translateX(-${awardIndex * 100}%)` }}
                                                >
                                                    {awardImagePaths.map((path, index) => (
                                                        <div key={index} className="w-full flex-shrink-0 h-full">
                                                            <IKImage
                                                                path={path}
                                                                transformation={[{ height: "800", width: "600", crop: "at_max" }]}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Floating background glow for Award */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[80px]"></div>
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]"></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </IKContext>
    );
};

export default GallerySection;