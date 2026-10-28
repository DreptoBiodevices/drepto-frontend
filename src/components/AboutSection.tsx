import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import {
  Target,
  Sparkles,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Microscope,
  Building2,
  TrendingUp,
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden border-b border-slate-200/80" id="purpose">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Target className="w-3.5 h-3.5 text-brand-600" />
            <span>{t('about.whoWeAre')} • {t('about.ourPurpose')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Engineering the Future of Targeted Therapeutics
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Advancing biomedical innovation through biocompatible transdermal technologies—delivering effective chronic therapies while eliminating painful injections and gastrointestinal burdens.
          </p>
        </div>

        {/* ── Key Clinical Metrics Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">12+ Hrs</div>
            <div className="text-xs font-bold text-brand-800 uppercase tracking-wider mt-1">Sustained Steady-State</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero-Order Release Profile</div>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">100%</div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">Gastrointestinal Bypass</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero Gastric Irritation</div>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">0.00 PII</div>
            <div className="text-xs font-bold text-brand-800 uppercase tracking-wider mt-1">ISO 10993-23 Certified</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Non-Irritant Biocompatibility</div>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-center">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">SINE</div>
            <div className="text-xs font-bold text-brand-800 uppercase tracking-wider mt-1">IIT Bombay Incubation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Deeptech Translation Lab</div>
          </div>
        </div>

        {/* ── Mission & Vision Cards (2 Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* ── Card 1: Mission ── */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 to-teal-500" />
            
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-700 flex items-center justify-center shadow-xs">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                  01 — {t('about.mission')}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Redefining targeted therapeutic delivery.
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Our mission is to advance the treatment of chronic inflammatory conditions, including rheumatoid arthritis, by developing innovative, non-invasive transdermal drug delivery platforms. We aim to improve localized therapeutic bioavailability, reduce systemic exposure, and optimize patient tolerability and treatment adherence.
              </p>

              {/* Key Highlights */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">100% Gastrointestinal Bypass mitigating stomach lining erosion</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Controlled zero-order release kinetics for stable plasma levels</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">High patient tolerability with discreet, non-invasive application</span>
                </div>
              </div>
            </div>

            {/* Footer Institutional Anchor */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Drepto R&amp;D Bio-Platform</span>
              <span className="text-brand-700 font-semibold">Patent App: IN202521129798</span>
            </div>
          </div>

          {/* ── Card 2: Vision ── */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  02 — {t('about.vision')}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                A world without the burden of invasive care.
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Our vision is to transform therapeutic delivery through cutting-edge biomedical engineering. We envision a future where chronic disease management is empowered by non-invasive transdermal systems that alleviate treatment burdens, minimize adverse events, and restore patient quality of life.
              </p>

              {/* Key Highlights */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Needle-free daily living for chronic rheumatoid arthritis patients</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Translational biomedical engineering from benchtop to clinical bedside</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">ISO 10993 certified biocompatibility with certified non-irritant safety</span>
                </div>
              </div>
            </div>

            {/* Footer Institutional Anchor */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Clinical Translation</span>
              <span className="text-teal-700 font-semibold">Incubated at SINE, IIT Bombay</span>
            </div>
          </div>

        </div>

        {/* ── Careers & Innovation Banner ── */}
        <div className="bg-gradient-to-br from-brand-50/90 via-teal-50/40 to-white rounded-3xl p-8 sm:p-12 border border-brand-200/90 shadow-soft hover:shadow-elevated transition-all relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 border border-brand-300 text-brand-900 text-xs font-bold uppercase tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5 text-brand-700" />
                <span>Careers at Drepto</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Join our team. Shape the next frontier of medical technology.
              </h3>
              
              <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
                We're a dedicated, interdisciplinary team building transdermal therapeutics and biomedical platforms that make a tangible difference. If you're driven by clinical impact and want to solve challenging healthcare problems, we'd love to work with you.
              </p>

              {/* Value Badges */}
              <div className="flex flex-wrap gap-2.5 mt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                  <Microscope className="w-3.5 h-3.5 text-brand-600" />
                  Bio-MEMS &amp; Formulation Research
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  SINE, IIT Bombay Ecosystem
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Career Growth &amp; Equity Incentives
                </span>
              </div>
            </div>

            {/* Right CTA Action */}
            <div className="lg:col-span-4 flex flex-col sm:items-start lg:items-end justify-center">
              <div className="bg-white p-6 rounded-2xl border border-brand-200/80 shadow-md w-full max-w-sm">
                <span className="text-xs font-bold text-brand-800 uppercase tracking-wider block mb-1">
                  Actively Recruiting
                </span>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Openings in biomedical engineering, polymer formulation, and clinical research.
                </p>
                <a
                  href="mailto:careers@dreptobiodevices.com"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-brand-700/20"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-[11px] text-slate-400 block text-center mt-2.5 font-medium">
                  Direct email: careers@dreptobiodevices.com
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;