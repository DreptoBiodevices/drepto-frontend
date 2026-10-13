import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Using Vite's import.meta.glob to dynamically read files from the Videos directory.
// This will automatically update during dev when a new file is added.
const videoModules = import.meta.glob('/public/Videos/*.{mp4,webm,ogg,mov}', { eager: true });
const videoFiles = Object.keys(videoModules).map(path => path.replace('/public', ''));

const VideoTestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const userPausedRef = useRef(false);

    const handleNext = () => {
        userPausedRef.current = false;
        setCurrentIndex((prev) => (prev + 1) % videoFiles.length);
    };

    const handlePrev = () => {
        userPausedRef.current = false;
        setCurrentIndex((prev) => (prev - 1 + videoFiles.length) % videoFiles.length);
    };

    // Observe when the section enters or leaves the user's viewport
    useEffect(() => {
        const sectionElement = sectionRef.current;
        if (!sectionElement) return;

        if (typeof IntersectionObserver === 'undefined') {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    setIsInView((prev) => {
                        // When entering the section, reset manual pause so video plays
                        if (!prev) {
                            userPausedRef.current = false;
                        }
                        return true;
                    });
                } else {
                    setIsInView(false);
                }
            },
            {
                threshold: [0, 0.2],
            }
        );

        observer.observe(sectionElement);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Only play video when the section is in the user's viewpoint
    useEffect(() => {
        if (!isInView) {
            if (videoRef.current && !videoRef.current.paused) {
                videoRef.current.pause();
            }
            setIsPlaying(false);
            return;
        }

        if (videoRef.current && !userPausedRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }
    }, [currentIndex, isInView]);

    // Pause video if user switches browser tab or minimizes window
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            } else {
                if (isInView && !userPausedRef.current && videoRef.current) {
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => setIsPlaying(true))
                            .catch(() => setIsPlaying(false));
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isInView]);

    const handleVideoEnd = () => {
        // Automatically play the next video when the current one finishes
        userPausedRef.current = false;
        handleNext();
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
                userPausedRef.current = true;
            } else {
                userPausedRef.current = false;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(() => setIsPlaying(false));
                }
            }
        }
    };

    // If no videos are found, we don't render the section
    if (videoFiles.length === 0) return null;

    return (
        <section ref={sectionRef} className="py-12 md:py-16 bg-transparent overflow-hidden border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        What our Users think about our product
                    </h2>
                    <p className="text-sm md:text-base text-slate-600">
                        Hear from people using our products to improve their lives.
                    </p>
                </div>

                <div className="relative max-w-sm mx-auto bg-slate-100 rounded-[2rem] shadow-xl overflow-hidden aspect-[9/16] group border-4 border-white">
                    <video
                        ref={videoRef}
                        key={videoFiles[currentIndex]}
                        src={videoFiles[currentIndex]}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={togglePlay}
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        controls={false}
                        playsInline
                        preload="metadata"
                    />

                    {/* Overlay controls */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                        <div className="flex justify-end gap-2">
                            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium">
                                {currentIndex + 1} / {videoFiles.length}
                            </div>
                        </div>

                        <div className="flex justify-center items-center h-full">
                            <button
                                onClick={togglePlay}
                                className={`pointer-events-auto p-5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                            >
                                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-white/20 transition-all pointer-events-auto transform hover:scale-110"
                        aria-label="Previous video"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-white/20 transition-all pointer-events-auto transform hover:scale-110"
                        aria-label="Next video"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VideoTestimonialsSection;
