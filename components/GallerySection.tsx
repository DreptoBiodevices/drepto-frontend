import React, { useState, useEffect, useRef } from 'react';
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
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Touch swipe state
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
            if (awardImagePaths.length > 1) {
                setAwardIndex((prev) => (prev + 1) % awardImagePaths.length);
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [isHovered]);

    const goNext = () => setCurrentIndex((prev) => prev + 1);
    
    const goPrev = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(galleryImagePaths.length);
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(galleryImagePaths.length - 1);
            }, 50);
        } else {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleTransitionEnd = () => {
        if (currentIndex >= galleryImagePaths.length) {
            setIsTransitioning(false);
            setCurrentIndex(0);
        }
    };

    useEffect(() => {
        if (!isTransitioning && currentIndex === 0) {
            const timer = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning, currentIndex]);

    // Touch handlers — horizontal swipe only, no interference with vertical scroll
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        setIsHovered(true); // pause auto-play while touching
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;

        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;

        // Only act on horizontal swipes (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
            if (deltaX < 0) goNext();
            else goPrev();
        }

        touchStartX.current = null;
        touchStartY.current = null;
        // Resume auto-play after a short delay
        setTimeout(() => setIsHovered(false), 3000);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
        // Only prevent default on clearly horizontal swipes to avoid blocking scroll
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    };

    return (
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
            <section
                className="relative py-12 sm:py-24 overflow-hidden bg-slate-50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">

                    {/* --- GALLERY SECTION --- */}
                    <div className="max-w-6xl mx-auto mb-12 sm:mb-32">
                        {/* Header Row */}
                        <div className="flex items-end justify-between mb-6 sm:mb-10 gap-4">
                            <div className="space-y-1 sm:space-y-2">
                                <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm block ml-1">Visual Journey</span>
                                <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 leading-tight">Gallery</h2>
                            </div>

                            {/* Desktop Arrow Buttons in header */}
                            <div className="hidden sm:flex items-center gap-3">
                                <button
                                    onClick={goPrev}
                                    className="p-3 rounded-full bg-white shadow-md text-gray-800 hover:text-primary transition-all border border-gray-100"
                                    aria-label="Previous"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={goNext}
                                    className="p-3 rounded-full bg-white shadow-md text-gray-800 hover:text-primary transition-all border border-gray-100"
                                    aria-label="Next"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Main Image Viewport */}
                        <div className="relative" ref={galleryRef}>
                            <div
                                className="overflow-hidden rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] bg-white aspect-video select-none"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                onTouchMove={handleTouchMove}
                                style={{ touchAction: 'pan-y' }}
                            >
                                <div
                                    className="flex transition-transform duration-700 ease-in-out h-full"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {galleryImagePaths.map((path, index) => (
                                        <div key={index} className="w-full flex-shrink-0 h-full relative">
                                            <IKImage
                                                path={path}
                                                transformation={[{ width: "1200" }]}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Arrow Buttons — overlaid on image */}
                            <button
                                onClick={goPrev}
                                className="sm:hidden absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-gray-700 active:scale-95 transition-transform"
                                aria-label="Previous"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={goNext}
                                className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-gray-700 active:scale-95 transition-transform"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>


                        </div>
                    </div>

                    {/* --- AWARDS SECTION --- */}
                    <div className="max-w-5xl mx-auto">
                        <div className="relative p-1 bg-gradient-to-br from-amber-200 via-primary/20 to-amber-200 rounded-[2rem] sm:rounded-[3rem]">
                            <div className="bg-slate-900 overflow-hidden rounded-[1.75rem] sm:rounded-[2.75rem] p-6 sm:p-8 md:p-16">
                                <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">

                                    <div className="order-2 md:order-1 space-y-4 sm:space-y-6">
                                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase">
                                            Recognition of Excellence
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white">Awards &amp; Distinction</h2>
                                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                                            Celebrating the milestones that define our commitment to quality,
                                            innovation, and excellence in every project we undertake.
                                        </p>
                                        <div className="flex items-center gap-4 pt-2 sm:pt-4">
                                            <div className="h-[2px] w-12 bg-amber-500"></div>
                                            <span className="text-white font-medium uppercase tracking-widest text-sm">Certified Achievement</span>
                                        </div>
                                    </div>

                                    <div className="order-1 md:order-2 relative">
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