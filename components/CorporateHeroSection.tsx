import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

export const FounderQuoteCard: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Grey Rounded Container */}
        <div className="relative bg-[#ebedf1] rounded-[2rem] sm:rounded-[2.75rem] p-6 sm:p-12 lg:p-16 shadow-sm border border-slate-200/50">
          {/* Top Red Quotation Mark & Horizontal Accent Line */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <span
              className="text-[#c01226] text-5xl sm:text-6xl lg:text-7xl font-serif font-black leading-none select-none inline-block -mb-2"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <div className="h-0.5 sm:h-1 bg-[#c01226] flex-1 rounded-full opacity-90" />
          </div>

          {/* Inner Content: Portrait + Quote Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Leader Portrait with Red L-Bracket Accent */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-44 sm:w-52 md:w-60 aspect-[4/5] flex-shrink-0">
                {/* Red L-shaped Corner Accent Bracket (Bottom-Left) */}
                <div
                  className="absolute -bottom-2.5 -left-2.5 sm:-bottom-3.5 sm:-left-3.5 w-16 sm:w-20 h-24 sm:h-28 border-b-4 border-l-4 sm:border-b-[5px] sm:border-l-[5px] border-[#c01226] rounded-bl-2xl pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Leader Image */}
                <img
                  src="/images/rahulsir.jpeg"
                  alt="Rahul Kumar Gupta, Founder and CEO of Drepto Biodevices"
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
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide text-[#c01226]">
                  RAHUL KUMAR GUPTA
                </h3>
                <p className="text-slate-600 font-medium text-xs sm:text-sm lg:text-base mt-1">
                  Founder and Chief Executive Officer
                </p>
                <p className="text-slate-500 font-medium text-xs sm:text-sm">
                  Drepto Biodevices Pvt. Ltd. &bull; Incubated at SINE, IIT Bombay
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Red Horizontal Accent Line & Closing Quotation Mark */}
          <div className="flex items-center justify-end gap-4 mt-6 sm:mt-8">
            <div className="h-0.5 sm:h-1 bg-[#c01226] flex-1 rounded-full opacity-90" />
            <span
              className="text-[#c01226] text-5xl sm:text-6xl lg:text-7xl font-serif font-black leading-none select-none inline-block -mt-4"
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
  const [patientImg, setPatientImg] = useState(
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'
  );

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
  // Over the first 360px of natural scroll:
  // - The text translates UP by up to 200px, moving directly over and covering the image
  // - The background image fades out smoothly to the dark slate background
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
      <section className="relative w-full h-[76vh] sm:h-[84vh] md:h-[88vh] lg:h-[92vh] max-h-[1000px] overflow-hidden bg-slate-950 flex flex-col justify-end">
        {/* Background Image: Fades out smoothly as text rises */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{
            opacity: imageOpacity,
            transform: `scale(${imageScale})`,
            willChange: 'opacity, transform',
          }}
        >
          <img
            src={heroImg}
            alt="Feminine Hygiene, Comfort, and Wellness"
            onError={() =>
              setHeroImg(
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1920&auto=format&fit=crop'
              )
            }
            className="w-full h-full object-cover object-[center_30%]"
          />
        </div>

        {/* Dynamic Darkening Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-150"
          style={{
            backgroundColor: `rgba(15, 23, 42, ${overlayDarkness})`,
          }}
        />

        {/* Cinematic Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

        {/* Center / Bottom Content: Text moves UP and covers the image as you scroll */}
        <div className="relative z-20 w-full flex flex-col items-center justify-end px-4 sm:px-6 pb-6 sm:pb-8 md:pb-10">
          {/* Scroll Down Capsule Indicator */}
          <button
            onClick={scrollToOverview}
            aria-label="Scroll to company overview"
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-md">
                Feminine Hygiene &bull; Pain-Free Wellness &bull; SINE, IIT Bombay
              </span>
            </div>

            {/* Massive Typography: CURE & BEYOND (Moves up and covers the image) */}
            <h1 className="w-full text-center text-[2.85rem] sm:text-6xl md:text-8xl lg:text-[9.5rem] xl:text-[11.5rem] font-black uppercase tracking-tight text-white leading-none select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] font-display">
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
          {/* Section Heading in Signature Emcure Crimson Red */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#c01226] text-center mb-12 sm:mb-16 lg:mb-20">
            Curing the World, Caring Beyond
          </h2>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Authoritative Feminine Hygiene & Healthcare Narrative */}
            <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed text-justify sm:text-left font-normal">
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
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/our-products')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c01226] hover:bg-[#a00f20] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Discover MenstroHerb</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/our-research')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 font-semibold text-sm transition-all shadow-xs"
                >
                  <span>Clinical Research Papers</span>
                </button>
              </div>
            </div>

            {/* Right Column: Serene Woman Radiating Feminine Wellness with Red Accent Stripe */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
                {/* Photo */}
                <div className="relative overflow-hidden rounded-xl shadow-lg border border-slate-100 bg-slate-100">
                  <img
                    src={patientImg}
                    alt="Serene, comfortable woman experiencing feminine wellness"
                    onError={() =>
                      setPatientImg(
                        'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop'
                      )
                    }
                    className="w-full h-[380px] sm:h-[460px] lg:h-[500px] object-cover object-center"
                  />
                </div>

                {/* Signature Red Vertical Accent Bar (bottom-right) */}
                <div
                  className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 w-3 sm:w-4 h-28 sm:h-36 bg-[#c01226] rounded-xs shadow-md pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. LEADERSHIP QUOTE CARD: Founder & CEO Inspiring Message
          ───────────────────────────────────────────────────────────── */}
      <FounderQuoteCard />
    </div>
  );
};

export default CorporateHeroSection;
