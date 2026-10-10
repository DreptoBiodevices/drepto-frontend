import React from 'react';

const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>;
const PharmacyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 10 22l-4-2.5V9l4-2.5L10.5 8" /><path d="M13.5 3.5 14 2l4 2.5V15l-4 2.5-3.5-1.5" /><path d="m14 2-4 2.5V15l4 2.5V2" /><path d="M10 22v-6.5l-4-2.5" /><path d="M2 9.5 6 12" /><path d="M20 14.5 14 12" /><path d="M10 8l4-2.5" /><path d="M10 15.5l4-2.5" /></svg>;
const LabIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v5h6V3" /><path d="M10 14.5a6 6 0 0 0-3.3 5H3" /><path d="M21 19.5a6 6 0 0 0-3.3-5" /><path d="M14 19.5a6 6 0 0 0-3.3-5" /><path d="M12 8v6" /><circle cx="12" cy="17" r="3" /></svg>;
const NurseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6a4 4 0 0 0-4-4Z" /><path d="M8 22v-5h8v5" /><path d="M12 7v4" /><path d="M10 9h4" /></svg>;
const AmbulanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10h4" /><path d="M12 8v4" /><rect width="16" height="12" x="4" y="5" rx="2" /><path d="M2 9h2" /><path d="M20 9h2" /><path d="M15 17v2" /><path d="M9 17v2" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

const serviceImages: Record<string, string> = {
  'Video Consultations': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
  'Medicine Delivery': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
  'Home Nursing': 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=600&q=80',
  'Ambulance Service': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
  'Secure Health Records': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
};

const serviceBadges: Record<string, string> = {
  'Video Consultations': 'Live Doctor',
  'Medicine Delivery': 'Express Delivery',
  'Home Nursing': 'Qualified Staff',
  'Ambulance Service': '24/7 Response',
  'Secure Health Records': 'Encrypted & Safe',
};

const serviceSubtitles: Record<string, string> = {
  'Video Consultations': 'Connect with verified rheumatologists in minutes',
  'Medicine Delivery': 'Authentic therapeutics delivered to your doorstep',
  'Home Nursing': 'Compassionate, certified in-home clinical care',
  'Ambulance Service': 'Rapid emergency dispatch across metro hubs',
  'Secure Health Records': 'End-to-end encrypted health record management',
};

const ProductSection: React.FC = () => {
  const features = [
    {
      icon: <VideoIcon />,
      title: 'Video Consultations',
      description: 'High-quality, secure video calls with doctors from the comfort of your home.',
      delay: '0.1s'
    },
    {
      icon: <PharmacyIcon />,
      title: 'Medicine Delivery',
      description: 'Order your prescribed medicines online and get them delivered to your doorstep.',
      delay: '0.2s'
    },
    {
      icon: <NurseIcon />,
      title: 'Home Nursing',
      description: 'Professional nursing care services available at your home for post-op recovery & elderly care.',
      delay: '0.4s'
    },
    {
      icon: <AmbulanceIcon />,
      title: 'Ambulance Service',
      description: 'Quick and reliable emergency ambulance services just a tap away.',
      delay: '0.5s'
    },
    {
      icon: <ShieldIcon />,
      title: 'Secure Health Records',
      description: 'Your medical history and records are encrypted and stored securely, accessible only to you.',
      delay: '0.6s'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded border border-brand-100 mb-2">
              Healthcare Ecosystem
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Care Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              We provide a complete ecosystem for all your healthcare and clinical needs.
            </p>
          </div>
          {/* Arrow controls (decorative) */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <button className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition-colors shadow-soft" title="Previous">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-brand-700 transition-colors shadow-soft" title="Next">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Services Grid Cards — Dark image card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: feature.delay }}
            >
              {/* Image */}
              <div className="h-52 overflow-hidden relative">
                <img
                  alt={feature.title}
                  src={serviceImages[feature.title] || ''}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                  {serviceBadges[feature.title]}
                </div>
              </div>
              {/* Content */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <h3 className="text-base font-bold text-white group-hover:text-brand-200 transition-colors">{feature.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{serviceSubtitles[feature.title]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;