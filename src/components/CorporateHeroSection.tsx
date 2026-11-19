import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const FounderQuoteCard: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/60 scroll-mt-24" id="founder">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Grey Rounded Container */}
        <div className="relative bg-[#F4F9F9] rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-14 shadow-sm border border-[#D0E6E6]">
          {/* Top Red Quotation Mark & Horizontal Accent Line */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <span
              className="text-slate-800 text-4xl sm:text-6xl lg:text-7xl font-serif font-black leading-none select-none inline-block -mb-2"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <div className="h-0.5 sm:h-1 bg-[#D0E6E6] flex-1 rounded-full opacity-90" />
          </div>

          {/* Inner Content: Portrait + Quote Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Leader Portrait with Red L-Bracket Accent */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-36 sm:w-52 md:w-60 aspect-[4/5] flex-shrink-0">
                {/* Red L-shaped Corner Accent Bracket (Bottom-Left) */}
                <div
                  className="absolute -bottom-2.5 -left-2.5 sm:-bottom-3.5 sm:-left-3.5 w-16 sm:w-20 h-24 sm:h-28 border-b-4 border-l-4 sm:border-b-[5px] sm:border-l-[5px] border-[#0B6F6D] rounded-bl-2xl pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Leader Image */}
                <img
                  src="/images/rahulsir.jpeg"
                  alt="Rahul Kumar Gupta, Director of Drepto Biodevices"
                  className="w-full h-full object-cover object-top rounded-lg shadow-md bg-slate-200"
                />
              </div>
            </div>

            {/* Quote & Attributions */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
                Since inception, Drepto Biodevices has dedicated its biomedical research to
                advancing women's health and feminine hygiene. By combining deeptech engineering
                from IIT Bombay with biocompatible transdermal technology, we developed solutions
                like MenstroHerb to liberate women from agonizing menstrual cramps and the harmful
                side effects of oral pain pills. We continue to work towards our aim of delivering
                safe, discreet, and affordable non-invasive healthcare solutions to women
                everywhere, enabling them to lead active, comfortable, and dignified lives. It's
                our conviction that women's wellness deserves the highest scientific priority!
              </p>

              {/* Leader Name in Bold Uppercase Red */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-300/60">
                <h3 className="text-base sm:text-xl lg:text-2xl font-bold uppercase tracking-wide text-slate-900">
                  RAHUL KUMAR GUPTA
                </h3>
                <p className="text-slate-600 font-medium text-xs sm:text-sm lg:text-base mt-1">
                  Director
                </p>
                <p className="text-slate-500 font-medium text-xs sm:text-sm">
                  Drepto Biodevices Pvt. Ltd. &bull; Incubated at SINE, IIT Bombay
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Red Horizontal Accent Line & Closing Quotation Mark */}
          <div className="flex items-center justify-end gap-4 mt-6 sm:mt-8">
            <div className="h-0.5 sm:h-1 bg-[#D0E6E6] flex-1 rounded-full opacity-90" />
            <span
              className="text-slate-400 text-4xl sm:text-6xl lg:text-7xl font-serif font-black leading-none select-none inline-block -mt-4"
              aria-hidden="true"
            >
              &rdquo;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const CorporateHeroSection: React.FC = () => {
  const navigate = useNavigate();

  // Feminine hygiene hero image with reliable photography fallback
  const [heroImg, setHeroImg] = useState('/images/feminine-hygiene-hero.jpg');

  // Smooth scroll tracking using requestAnimationFrame
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOverview = () => {
    const el = document.getElementById('caring-beyond');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll calculation parameters
  const maxScroll = 360;
  const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

  const imageOpacity = Math.max(0, 1 - progress * 1.35);
  const imageScale = 1 + progress * 0.06;
  const overlayDarkness = Math.min(0.85, 0.35 + progress * 0.5);
  const textTranslateY = -progress * 200; // in pixels: moves UP to cover image
  const capsuleOpacity = Math.max(0, 1 - progress * 3.5);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER: Direct Seamless Banner (NO extra empty space)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[76vh] sm:h-[84vh] md:h-[88vh] lg:h-[92vh] max-h-[1000px] overflow-hidden bg-[#052121] flex flex-col justify-end">
        {/* Dynamic Background Image: scales up gently, dims on scroll */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-75 ease-out select-none"
          style={{
            backgroundImage: `url('${heroImg}')`,
            opacity: imageOpacity,
            transform: `scale(${imageScale})`,
            willChange: 'transform, opacity',
          }}
          onError={() =>
            setHeroImg(
              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop'
            )
          }
        />

        {/* Dynamic Dark Slate Wash Overlay */}
        <div
          className="absolute inset-0 z-1 pointer-events-none transition-all duration-75 ease-out"
          style={{
            backgroundColor: `rgba(2, 28, 28, ${overlayDarkness})`,
          }}
        />

        {/* Subtle Top & Bottom Gradient Vignettes */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-2 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-2 pointer-events-none" />

        {/* Banner Foreground Layer */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12 md:pb-16 flex flex-col items-center">
          {/* Elegant Pill Capsule / Scroll Cue (Fades away instantly on scroll) */}
          <button
            onClick={scrollToOverview}
            aria-label="Scroll down to Curing the World, Caring Beyond overview"
            style={{
              opacity: capsuleOpacity,
              transition: 'opacity 0.15s ease-out',
            }}
            className="mb-4 sm:mb-6 flex flex-col items-center focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-7 h-12 sm:w-8 sm:h-14 rounded-full border-2 border-white/90 bg-black/30 backdrop-blur-xs flex flex-col items-center pt-2 transition-all shadow-md">
              <span className="w-1.5 h-2.5 sm:w-2 sm:h-3 bg-white rounded-full animate-bounce mb-1" />
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 transition-colors" />
            </div>
          </button>

          {/* Dynamic Floating Container: Moves UPwards over the image on scroll */}
          <div
            className="w-full flex flex-col items-center text-center pointer-events-none select-none"
            style={{
              transform: `translateY(${textTranslateY}px)`,
              willChange: 'transform',
            }}
          >
            {/* Subtitle Badge */}
            <div
              className="mb-2 sm:mb-4 transition-opacity duration-150"
              style={{
                opacity: Math.max(0, 1 - progress * 2),
              }}
            >
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide uppercase shadow-md max-w-[92vw] text-center">
                Feminine Hygiene &bull; Pain-Free Wellness &bull; SINE, IIT Bombay
              </span>
            </div>

            {/* Massive Typography: CURE & BEYOND (Moves up and covers the image) */}
            <h1 className="w-full text-center text-3xl sm:text-5xl md:text-7xl lg:text-[9.5rem] xl:text-[11.5rem] font-black uppercase tracking-tight text-white leading-none select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] font-display">
              CURE &amp; BEYOND
            </h1>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CORPORATE OVERVIEW: "Curing the World, Caring Beyond"
          Directly follows the Hero Banner with ZERO empty space!
          ───────────────────────────────────────────────────────────── */}
      <section id="caring-beyond" className="py-16 sm:py-24 lg:py-28 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-slate-900 text-center mb-8 sm:mb-14 lg:mb-16">
            Curing the World, <span className="text-[#0B6F6D]">Caring Beyond</span>
          </h2>

          {/* Centered Authoritative Feminine Hygiene & Healthcare Narrative */}
          <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
            <p>
              Drepto Biodevices is a pioneering Indian biomedical enterprise incubated at the
              Society for Innovation &amp; Entrepreneurship (SINE), IIT Bombay, committed to
              revolutionizing feminine hygiene, menstrual care, and non-invasive transdermal
              therapeutics. We are an R&amp;D-driven deeptech healthcare company developing
              differentiated, skin-friendly medical formulations and bio-electronic devices that
              address intimate women's healthcare challenges with clinical precision.
            </p>

            <p>
              Our specialized feminine hygiene and menstrual care platform—headlined by{' '}
              <strong className="text-slate-900 font-semibold">MenstroHerb</strong>—is engineered
              to deliver continuous, 12-hour targeted transdermal relief for dysmenorrhea and
              severe menstrual cramps. Backed by proprietary patent filings (IN202521129798), ISO
              10993-23 biocompatibility certification (0.00 Non-Irritant), and peer-reviewed
              clinical validation published in JAIMS, our formulations bypass the stomach
              completely, eliminating the gastrointestinal erosion and nausea caused by oral
              painkillers.
            </p>

            <p>
              With an unwavering commitment to biomedical science, clinical safety, and
              women's dignity, Drepto Biodevices empowers women everywhere to embrace their
              cycles comfortably, productively, and without interruption—delivering gentle,
              medical-grade feminine hygiene and therapeutic care.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/our-products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B6F6D] hover:bg-[#0B5C5A] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
              >
                <span>Discover MenstroHerb</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/our-research')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 font-semibold text-sm transition-all shadow-xs"
              >
                <span>Clinical Research Papers</span>
              </button>
            </div>
          </div>

          {/* ── Patented Transdermal Biodevice Video Showcase ── */}
          <div className="mt-14 sm:mt-20 pt-10 sm:pt-14 border-t border-slate-200/80">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#0B6F6D] animate-pulse" />
                <span>PATENTED BIODEVICETECHNOLOGY IN MOTION</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Precision Transdermal Micro-Flux Delivery
              </h3>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Watch the multi-chamber controlled reservoir kinetics, dosing button mechanism, and micro-permeation architecture engineered at SINE, IIT Bombay.
              </p>
            </div>

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300/90 shadow-2xl bg-white max-w-5xl mx-auto">
              {/* Video Frame */}
              <div className="relative w-full bg-white flex items-center justify-center p-2 sm:p-6">
                <video
                  src="/images/vid.mp4"
                  className="w-full h-auto max-h-[520px] object-contain rounded-xl shadow-xs"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. LEADERSHIP QUOTE CARD: Director Inspiring Message
          ───────────────────────────────────────────────────────────── */}
      <FounderQuoteCard />
    </div>
  );
};

export default CorporateHeroSection;
