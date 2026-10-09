import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Using Vite's import.meta.glob to dynamically read files from the Videos directory.
// This will automatically update during dev when a new file is added.
const videoModules = import.meta.glob('/public/Videos/*.{mp4,webm,ogg,mov}', { eager: true });
const videoFiles = Object.keys(videoModules).map(path => path.replace('/public', ''));

const VideoTestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % videoFiles.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + videoFiles.length) % videoFiles.length);
    };

    useEffect(() => {
        if (videoRef.current) {
            // When index changes, try to auto-play the next video.
            // On initial load, browsers might block autoplay without user interaction, 
            // so we handle the promise carefully.
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
    }, [currentIndex]);

    const handleVideoEnd = () => {
        // Automatically play the next video when the current one finishes
        handleNext();
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    // If no videos are found, we don't render the section
    if (videoFiles.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        What our Users think about our product
                    </h2>
                    <p className="text-lg text-slate-600">
                        Hear directly from the people who are using our biomedical systems to improve their lives.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto bg-black rounded-3xl shadow-2xl overflow-hidden aspect-video group">
                    <video
                        ref={videoRef}
                        key={videoFiles[currentIndex]}
                        src={videoFiles[currentIndex]}
                        className="w-full h-full object-contain"
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        controls={false}
                        playsInline
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
