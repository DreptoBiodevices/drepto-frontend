import React, { useRef } from 'react';

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; description: string; delay: string; bgImage: string }> = ({ icon, title, description, delay, bgImage }) => (
  <div 
    className="relative aspect-[4/5] rounded-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300 animate-fade-in-up flex-shrink-0 w-80" 
    style={{ animationDelay: delay }}
  >
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:bg-black/60 transition-all"/>

    {/* Content */}
    <div className="relative h-full p-8 flex flex-col justify-between text-white">
      {/* Description - shows on hover from top */}
      <div className="opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        <p className="text-base leading-relaxed">
          {description}
        </p>
      </div>
      
      <h3 className="text-2xl font-bold transition-all duration-300 text-left">{title}</h3>
    </div>
  </div>
);

const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>;
const PharmacyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 10 22l-4-2.5V9l4-2.5L10.5 8" /><path d="M13.5 3.5 14 2l4 2.5V15l-4 2.5-3.5-1.5" /><path d="m14 2-4 2.5V15l4 2.5V2" /><path d="M10 22v-6.5l-4-2.5" /><path d="M2 9.5 6 12" /><path d="M20 14.5 14 12" /><path d="M10 8l4-2.5" /><path d="M10 15.5l4-2.5" /></svg>;
const LabIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v5h6V3" /><path d="M10 14.5a6 6 0 0 0-3.3 5H3" /><path d="M21 19.5a6 6 0 0 0-3.3-5" /><path d="M14 19.5a6 6 0 0 0-3.3-5" /><path d="M12 8v6" /><circle cx="12" cy="17" r="3" /></svg>;
const NurseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6a4 4 0 0 0-4-4Z" /><path d="M8 22v-5h8v5" /><path d="M12 7v4" /><path d="M10 9h4" /></svg>;
const AmbulanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10h4" /><path d="M12 8v4" /><rect width="16" height="12" x="4" y="5" rx="2" /><path d="M2 9h2" /><path d="M20 9h2" /><path d="M15 17v2" /><path d="M9 17v2" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ProductSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340; // card width + gap
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const features = [
    {
      icon: <VideoIcon />,
      title: 'Video Consultations',
      description: 'High-quality, secure video calls with doctors from the comfort of your home.',
      delay: '0.1s',
      bgImage: '/images/features/doctor.webp'
    },
    {
      icon: <PharmacyIcon />,
      title: 'Medicine Delivery',
      description: 'Order your prescribed medicines online and get them delivered to your doorstep.',
      delay: '0.2s',
      bgImage: '/images/features/medicine.webp'
    },
    {
      icon: <NurseIcon />,
      title: 'Home Nursing',
      description: 'Professional nursing care services available at your home for post-op recovery & elderly care.',
      delay: '0.4s',
      bgImage: '/images/features/nurse.webp'
    },
    {
      icon: <AmbulanceIcon />,
      title: 'Ambulance Service',
      description: 'Quick and reliable emergency ambulance services just a tap away.',
      delay: '0.5s',
      bgImage: '/images/features/ambulance.webp'
    },
    {
      icon: <ShieldIcon />,
      title: 'Secure Health Records',
      description: 'Your medical history and records are encrypted and stored securely, accessible only to you.',
      delay: '0.6s',
      bgImage: '/images/features/records.webp'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header row: title/desc left, buttons right */}
        <div className="flex items-end justify-between">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-bold text-primary mb-1 animate-fade-in-up tracking-tight">
              Comprehensive Care Services
            </h2>
            <p className="text-gray-600 text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              We provide a complete ecosystem for all your healthcare needs.
            </p>
          </div>


        </div>

        {/* Scrollable cards — scrollbar hidden */}
        <div
          ref={scrollRef}
          className="mt-16 overflow-x-auto"
          style={{
            scrollbarWidth: 'none',       /* Firefox */
            msOverflowStyle: 'none',      /* IE/Edge */
          }}
        >
          {/* Hide scrollbar in WebKit via inline style injection */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          <div className="hide-scrollbar flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
          
        </div>
                 {/* Scroll control buttons — flat, bordered, radius 0.25rem */}
          <div className="flex gap-2 mb-1 flex-shrink-0 justify-end">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              style={{ borderRadius: '0.25rem' }}
              className="flex items-center justify-center w-10 h-10 bg-transparent border border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              style={{ borderRadius: '0.25rem' }}
              className="flex items-center justify-center w-10 h-10 bg-transparent border border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <ChevronRight />
            </button>
          </div>
          
      </div>
    </section>
  );
};

export default ProductSection;