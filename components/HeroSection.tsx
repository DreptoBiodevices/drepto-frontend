
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadMedicines } from './admin/MedicineData';
import { loadLabTests } from './admin/LabTestData';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ medicines: 0, labTests: 0 });

  // useEffect removed as per user request to disable API calling
  // useEffect(() => {
  //   const meds = loadMedicines();
  //   const labs = loadLabTests();
  //   setStats({
  //     medicines: meds.length,
  //     labTests: labs.length
  //   });
  // }, []);

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 bg-gradient-to-b from-white via-brand-50/20 to-clinical-surface">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Hero Content ── */}
        <div className="w-full space-y-10">
          <div className="max-w-7xl space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-brand-100/60 border border-brand-200 text-brand-800 text-sm font-bold">
              <span className="w-3 h-3 rounded-full bg-brand-600 animate-pulse" />
              <span>Next-Gen Transdermal Drug Delivery Platform</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.05]">
                Drepto Biodevices
              </h1>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-700 tracking-normal leading-tight">
                Redefining Drug Delivery with Next-Gen Innovation
              </p>
              <p className="text-slate-600 text-xl sm:text-2xl lg:text-3xl max-w-5xl leading-relaxed pt-4">
                Pioneering non-invasive, targeted transdermal therapeutic devices engineered to minimize systemic side effects, optimize precision dosage, and restore effortless daily living.
              </p>
            </div>

            {/* Stats Badges */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl pt-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-700">{stats.medicines}+</div>
                <div className="text-sm lg:text-base font-bold text-slate-500 uppercase tracking-wider mt-2">Medicines</div>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-700">{stats.labTests}+</div>
                <div className="text-sm lg:text-base font-bold text-slate-500 uppercase tracking-wider mt-2">Lab Tests</div>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-700">24/7</div>
                <div className="text-sm lg:text-base font-bold text-slate-500 uppercase tracking-wider mt-2">Support</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <button
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-700/20 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/about-us')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-soft transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* ── Video Below Hero ── */}
        <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <video
            src="/images/vid.mp4"
            className="rounded-2xl shadow-2xl w-full object-cover max-h-[480px]"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
