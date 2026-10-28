import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Activity,
  ShieldCheck,
  Zap,
  Microscope,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  HeartPulse,
} from 'lucide-react';

const ProductSection: React.FC = () => {
  const navigate = useNavigate();

  const platforms = [
    {
      icon: <Layers className="w-7 h-7 text-brand-600" />,
      badge: 'Patent Filed Matrix',
      title: 'Polymer Transdermal Matrix',
      subtitle: 'Bio-compatible permeation engineering',
      description:
        'Engineered polymeric carrier architecture that reversibly enhances stratum corneum permeation, delivering active molecules directly to local sub-dermal capillary beds.',
      stat: 'IN202521129798',
      statLabel: 'Patent Application',
      gradient: 'from-brand-50 to-teal-50/30',
    },
    {
      icon: <Clock className="w-7 h-7 text-brand-600" />,
      badge: 'Pharmacokinetics',
      title: 'Biphasic 12-Hour Sustained Release',
      subtitle: 'Zero-order steady-state diffusion',
      description:
        'Combines rapid initial onset (relief within 30 minutes) with sustained zero-order kinetic release over 12 continuous hours, avoiding peak-and-trough plasma oscillations.',
      stat: '91.23%',
      statLabel: 'Ex-Vivo Drug Release',
      gradient: 'from-teal-50 to-emerald-50/30',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-brand-600" />,
      badge: 'Gastro-Sparing',
      title: 'First-Pass Metabolism Bypass',
      subtitle: 'Zero direct GI contact',
      description:
        'Circumvents gastrointestinal absorption and hepatic degradation, preventing the gastric irritation, ulcers, and hepatotoxicity typical of conventional oral NSAIDs and immunosuppressants.',
      stat: '100% Non-Oral',
      statLabel: 'GI Mucosa Safe',
      gradient: 'from-emerald-50 to-brand-50/30',
    },
    {
      icon: <Award className="w-7 h-7 text-brand-600" />,
      badge: 'ISO Certified',
      title: 'Biocompatibility & Preclinical Safety',
      subtitle: 'ISO 10993-23:2021 Biological Testing',
      description:
        'Rigorously tested under international medical device biological evaluation standards. Proven completely non-irritant with zero erythema and zero edema across evaluated cohorts.',
      stat: '0.00 PII',
      statLabel: 'Zero Irritation Score',
      gradient: 'from-blue-50 to-brand-50/30',
    },
    {
      icon: <Microscope className="w-7 h-7 text-brand-600" />,
      badge: 'R&D Pipeline',
      title: 'Targeted Methotrexate System',
      subtitle: 'Rheumatoid Arthritis Therapeutic Platform',
      description:
        'Investigational non-invasive delivery system in development to optimize localized delivery, potentially reduce systemic exposure, and improve long-term adherence for chronic arthritis.',
      stat: 'Preclinical',
      statLabel: 'Development Stage',
      gradient: 'from-amber-50 to-orange-50/30',
    },
    {
      icon: <HeartPulse className="w-7 h-7 text-brand-600" />,
      badge: 'Academic Backing',
      title: 'IIT Bombay & Clinical Ecosystem',
      subtitle: 'SINE Incubation & Specialized Advisory',
      description:
        'Developed in association with faculty researchers at IIT Bombay, guided by clinical advisors from Medanta Hospital and pharmaceutical industry leaders.',
      stat: 'SINE IITB',
      statLabel: 'Deeptech Incubation',
      gradient: 'from-purple-50 to-brand-50/30',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100" id="platforms">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200 mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Biomedical Innovation &amp; Delivery Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Proprietary Transdermal Platforms
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              Engineered to replace systemic side-effect burdens with localized, high-bioavailability transdermal therapeutics.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate('/our-research')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all shadow-sm"
            >
              <span>Explore Clinical Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {platforms.map((platform, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${platform.gradient} border border-slate-200/80 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {platform.icon}
                  </div>
                  <span className="text-xs font-bold text-brand-800 bg-white/90 border border-brand-200/80 px-3 py-1 rounded-full shadow-xs">
                    {platform.badge}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-1 leading-snug">
                  {platform.title}
                </h3>
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
                  {platform.subtitle}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {platform.description}
                </p>
              </div>

              {/* Bottom Stat Ribbon */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-slate-900">{platform.stat}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {platform.statLabel}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/our-research')}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-brand-700 group-hover:border-brand-300 transition-colors"
                  aria-label="View research details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductSection;