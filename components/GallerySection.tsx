import React, { useState, useEffect, useRef } from 'react';
import { IKContext, IKImage } from 'imagekitio-react';
import { Building2, ShieldCheck, Award, FileText, ArrowRight } from 'lucide-react';

const urlEndpoint = 'https://ik.imagekit.io/ke6x9gsjs';
const publicKey = 'public_Hauz4WSMbOr/vm58ZbnpsPR/h1o=';

const galleryImagePaths = [
  'Drepto/45.jpeg',
  'Drepto/11.jpeg',
  'Drepto/42.jpeg',
  'Drepto/10.jpg',
  'Drepto/5.jpg',
  'Drepto/4.jpg',
  'Drepto/9.jpeg',
  'Drepto/44.jpeg',
];

const awardImagePaths = ['Drepto/aweard1.jpeg'];

const GallerySection: React.FC<{ onOpenMenu?: () => void }> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [awardIndex, setAwardIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

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
    }, 4000);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsHovered(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setTimeout(() => setIsHovered(false), 3000);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  };

  return (
    <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
      <section
        className="relative py-20 sm:py-28 overflow-hidden bg-white border-t border-slate-200/80"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* --- GALLERY SECTION --- */}
          <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
            {/* Header Row */}
            <div className="flex items-end justify-between mb-8 sm:mb-12 gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
                  <span>VISUAL JOURNEY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold sm:font-black text-slate-900 leading-tight font-display">
                  Biomedical Milestones &amp; Facilities
                </h2>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                  Moments from our SINE, IIT Bombay laboratories, symposium keynotes, clinical collaborations, and national deeptech recognitions.
                </p>
              </div>

              {/* Desktop Arrow Buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={goPrev}
                  className="p-3 rounded-full bg-[#ebedf1] text-slate-700 hover:text-[#c01226] hover:bg-red-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goNext}
                  className="p-3 rounded-full bg-[#ebedf1] text-slate-700 hover:text-[#c01226] hover:bg-red-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  aria-label="Next image"
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
                className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg bg-slate-900 aspect-video select-none border border-slate-300"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                style={{ touchAction: 'pan-y' }}
              >
                <div
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${(currentIndex % galleryImagePaths.length) * 100}%)` }}
                >
                  {galleryImagePaths.map((path, index) => (
                    <div key={index} className="w-full flex-shrink-0 h-full relative">
                      <IKImage
                        path={path}
                        transformation={[{ width: '1200' }]}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Arrows */}
              <button
                onClick={goPrev}
                className="sm:hidden absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-slate-800 active:scale-95 transition-transform"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-slate-800 active:scale-95 transition-transform"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* --- AWARDS & INSTITUTIONAL VALIDATION SECTION: NEW LUMINOUS DESIGN --- */}
          <div className="max-w-6xl mx-auto mt-16 sm:mt-24">
            <div className="bg-gradient-to-br from-white via-[#f8f9fa] to-[#ebedf1] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-slate-300/90 shadow-md relative overflow-hidden">
              {/* Subtle Ambient Red Glow */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                
                {/* Left 7 Columns: Content & Credentials Grid */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#c01226] text-xs font-bold tracking-wider uppercase shadow-2xs">
                    <Award className="w-4 h-4 text-[#c01226]" />
                    <span>INSTITUTIONAL VALIDATION &amp; CERTIFICATIONS</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-display leading-tight tracking-tight">
                    Backed by Academic Excellence &amp; Clinical Rigor
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    Incubated at IIT Bombay's premier deeptech incubator, certified under international biocompatibility standards, and validated through peer-reviewed clinical research.
                  </p>

                  {/* 4 Interactive Feature Badges (2x2 Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="bg-white rounded-xl p-3.5 border border-slate-300/90 shadow-2xs hover:border-[#c01226]/40 transition-all flex items-start gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c01226] flex items-center justify-center shrink-0 group-hover:bg-[#c01226] group-hover:text-white transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SINE, IIT Bombay</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Deeptech Biomedical Incubation</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-[#c01226]/40 transition-all flex items-start gap-3.5 group">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c01226] flex items-center justify-center shrink-0 group-hover:bg-[#c01226] group-hover:text-white transition-colors">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">ISO 10993-23:2021</h4>
                        <p className="text-xs text-slate-500 mt-0.5">0.00 Non-Irritant Biocompatible</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-[#c01226]/40 transition-all flex items-start gap-3.5 group">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c01226] flex items-center justify-center shrink-0 group-hover:bg-[#c01226] group-hover:text-white transition-colors">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Peer-Reviewed</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Published in JAIMS Journal</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-[#c01226]/40 transition-all flex items-start gap-3.5 group">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c01226] flex items-center justify-center shrink-0 group-hover:bg-[#c01226] group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Intellectual Property</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Patent App IN202521129798</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="/our-research"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c01226] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md group"
                    >
                      <span>Inspect Research Reports &amp; Papers</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right 5 Columns: Floating Trophy & Award Frame */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative z-10 p-3 sm:p-4 bg-white border border-slate-300 rounded-2xl shadow-md max-w-sm w-full">
                    <div className="overflow-hidden rounded-2xl aspect-[4/5] bg-slate-100 relative">
                      <IKImage
                        path={awardImagePaths[0]}
                        transformation={[{ height: '800', width: '600', crop: 'at_max' }]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Prestigious Award Ribbon */}
                    <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                        🏆
                      </div>
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wide text-amber-900">India Pharma Awards Winner</div>
                        <div className="text-[11px] text-amber-800 font-medium leading-tight">Outstanding Academic Research &bull; IIT Bombay</div>
                      </div>
                    </div>
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
