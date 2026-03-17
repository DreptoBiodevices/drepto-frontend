import React, { useState, useEffect } from 'react';
import { IKContext, IKImage } from 'imagekitio-react';

const urlEndpoint = 'https://ik.imagekit.io/ke6x9gsjs';
const publicKey = 'public_Hauz4WSMbOr/vm58ZbnpsPR/h1o=';

const galleryImagePaths = [
  'Drepto/45.jpeg', 'Drepto/11.jpeg', 'Drepto/42.jpeg',
  'Drepto/8.jpeg', 'Drepto/7.jpeg', 'Drepto/5.jpg', 'Drepto/4.jpg',
  'Drepto/9.jpeg', 'Drepto/44.jpeg',
];

const awardImagePaths = ['Drepto/aweard1.jpeg'];

const ChevLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

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

  const prev = () => setCurrentIndex((p) => (p === 0 ? galleryImagePaths.length - 1 : p - 1));
  const next = () => setCurrentIndex((p) => (p + 1) % galleryImagePaths.length);

  return (
    <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
      <section
        className="bg-white py-24 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container mx-auto px-6 max-w-6xl">

          {/* ── Gallery ─────────────────────────────────────────── */}
          <div className="mb-28">

            {/* header row */}
            <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Visual Journey</p>
                <h2 className="text-4xl font-bold text-gray-900 leading-none">Gallery</h2>
              </div>

              {/* counter + nav */}
              <div className="flex items-center gap-4">
                <span className="text-sm tabular-nums text-gray-400 mr-2">
                  <span className="text-gray-900 font-semibold">{String(currentIndex + 1).padStart(2, '0')}</span>
                  {' / '}
                  {String(galleryImagePaths.length).padStart(2, '0')}
                </span>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  style={{ borderRadius: '0.25rem' }}
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors duration-200"
                >
                  <ChevLeft />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  style={{ borderRadius: '0.25rem' }}
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors duration-200"
                >
                  <ChevRight />
                </button>
              </div>
            </div>

            {/* image strip */}
            <div className="overflow-hidden aspect-video bg-gray-50">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {galleryImagePaths.map((path, i) => (
                  <div key={i} className="w-full flex-shrink-0 h-full">
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

            {/* dot rail — below image, left-aligned, minimal */}
            <div className="flex items-center gap-2 mt-5">
              {galleryImagePaths.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 h-px ${
                    i === currentIndex
                      ? 'w-8 bg-gray-900'
                      : 'w-4 bg-gray-300 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Awards ──────────────────────────────────────────── */}
          <div>
            {/* section label */}
            <div className="border-b border-gray-100 pb-6 mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Recognition</p>
              <h2 className="text-4xl font-bold text-gray-900 leading-none">Awards & Distinction</h2>
            </div>

            {/* split layout */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-0">

              {/* left — award image */}
              <div className="relative overflow-hidden bg-gray-50 aspect-[4/5] md:aspect-auto">
                <div
                  className="flex h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${awardIndex * 100}%)` }}
                >
                  {awardImagePaths.map((path, i) => (
                    <div key={i} className="w-full flex-shrink-0 h-full min-h-[400px]">
                      <IKImage
                        path={path}
                        transformation={[{ height: '800', width: '600', crop: 'at_max' }]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* right — text */}
              <div className="flex flex-col justify-center px-10 py-14 md:px-14 border border-l-0 border-gray-100">
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-6">
                  Certified Achievement
                </p>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight mb-6">
                  Celebrating excellence in medical innovation.
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm">
                  Each award represents a milestone in our commitment to quality, 
                  rigorous research, and meaningful impact on healthcare outcomes.
                </p>

                {/* ruled stat rows */}
                <div className="divide-y divide-gray-100">
                  {[
                    { label: 'Category', value: 'Medical Technology' },
                    { label: 'Recognition', value: 'Excellence in Innovation' },
                    { label: 'Status', value: 'Certified Achievement' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-3.5">
                      <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{label}</span>
                      <span className="text-sm text-gray-700 font-medium">{value}</span>
                    </div>
                  ))}
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