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
  CheckCircle2,
  Package,
  ShoppingBag,
} from 'lucide-react';

const ProductSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fa] border-t border-slate-200/80" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Emcure Style with Red Accent */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c01226] bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200/90 mb-3 shadow-2xs">
              <Package className="w-3.5 h-3.5 text-[#c01226]" />
              <span>OUR PRODUCTS &amp; THERAPEUTIC FORMULATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight font-display">
              Targeted Transdermal Care for Women &amp; Beyond
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              Engineered at SINE, IIT Bombay to replace systemic side-effect burdens with localized, high-bioavailability transdermal therapeutics.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate('/our-products')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#c01226] hover:bg-red-700 transition-all shadow-md cursor-pointer group"
            >
              <span>View Complete Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── FLAGSHIP PRODUCT HERO SPOTLIGHT: MENSTROHERB ── */}
        <div className="relative bg-[#ebedf1] rounded-[2rem] sm:rounded-[2.75rem] p-6 sm:p-12 lg:p-14 shadow-sm border border-slate-200/70 mb-14">
          
          {/* Top Red Quotation & Line Accent */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-white text-[#c01226] border border-slate-200 shadow-2xs">
              Flagship Innovation &bull; Feminine Hygiene &amp; Cramp Relief
            </span>
            <div className="h-0.5 bg-[#c01226] flex-1 rounded-full opacity-60" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Visual Product Box with L-bracket Accent */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/3] sm:aspect-square flex-shrink-0">
                {/* Red L-shaped Corner Accent Bracket */}
                <div
                  className="absolute -bottom-2.5 -left-2.5 sm:-bottom-3.5 sm:-left-3.5 w-16 sm:w-20 h-24 sm:h-28 border-b-4 border-l-4 sm:border-b-[5px] sm:border-l-[5px] border-[#c01226] rounded-bl-2xl pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Product Image / Visual Showcase */}
                <div className="w-full h-full bg-gradient-to-br from-white via-slate-50 to-red-50/40 rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 rounded-md bg-[#c01226] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                      12-Hour Sustained Relief
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500">IN202521129798</span>
                  </div>

                  <div className="my-auto text-center py-4">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-red-100/70 border border-red-200 text-[#c01226] flex items-center justify-center shadow-inner">
                      <HeartPulse className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 font-display">
                      MenstroHerb<span className="text-[#c01226]">™</span>
                    </h4>
                    <p className="text-xs font-bold text-[#c01226] tracking-wider uppercase mt-1">
                      Polyherbal Transdermal Patch
                    </p>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                      Non-Invasive Menstrual Cramp &amp; Pelvic Spasm Relief
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>100% Stomach Safe</span>
                    <span className="text-emerald-700 font-bold">ISO 10993 Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Narrative & Clinical Advantages */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
                Drepto MenstroHerb<span className="text-[#c01226]">™</span> Transdermal Patch
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#c01226] uppercase tracking-wider mt-1 mb-4">
                Targeted Relief for Primary &amp; Secondary Dysmenorrhea
              </p>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal mb-6">
                MenstroHerb is India's premier targeted polyherbal transdermal patch engineered at SINE, IIT Bombay. Formulated with pure therapeutic botanical extracts (Vitex agnus-castus, Zingiber officinale, Mentha piperita, and Eucalyptus globulus), it diffuses directly into local pelvic capillary beds to relax uterine smooth muscles without the harmful stomach burning, ulcers, and drowsiness of oral painkiller tablets.
              </p>

              {/* 4 Pillars of Product Superiority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    <strong>100% Gastrointestinal Bypass</strong> (Zero stomach irritation)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    <strong>12-Hour Continuous Relief</strong> with sub-30 min rapid onset
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    <strong>Discreet &amp; Skin-Toned</strong> (Wearable undetected under any outfit)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    <strong>0.00 Non-Irritant Score</strong> (ISO 10993-23 Certified)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/our-products')}
                  className="px-6 py-3 rounded-xl bg-[#c01226] hover:bg-red-700 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order MenstroHerb Online</span>
                </button>
                <button
                  onClick={() => navigate('/our-research')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-sm tracking-wide transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <span>View Clinical Research Dossier</span>
                  <ArrowRight className="w-4 h-4 text-[#c01226]" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* ── 3-COLUMN THERAPEUTIC PIPELINE & FORMULATIONS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-red-50 text-[#c01226] rounded-2xl border border-red-100 group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#c01226] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  Feminine Hygiene
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                MenstroHerb Cycle Care Packs
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                5-Patch Travel &bull; 10-Patch Monthly
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                Flexible pack formats designed for young women, working professionals, and athletes seeking continuous cycle comfort and dignified non-invasive protection.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-base font-black text-slate-900">Starting at ₹349</span>
              <button
                onClick={() => navigate('/our-products')}
                className="text-xs font-bold text-[#c01226] hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  Preclinical R&amp;D
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                ArthriTrans Rheumatoid System
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Non-Invasive DMARD Bio-Delivery
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                Investigational targeted delivery system designed to deliver disease-modifying agents directly to inflamed joints while circumventing systemic gastro-hepatic toxicity.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500">Pipeline Stage: Franz Cells</span>
              <button
                onClick={() => navigate('/our-research')}
                className="text-xs font-bold text-[#c01226] hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-red-50 text-[#c01226] rounded-2xl border border-red-100 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Patent Filed
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Bio-Polymer Matrix Platform
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Licensing &amp; Pharmaceutical CDMO
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                Proprietary polymer matrix technology available for co-development and licensing to formulate poorly soluble APIs into non-invasive, high-permeation transdermal patches.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-500">App: IN202521129798</span>
              <button
                onClick={() => navigate('/contact')}
                className="text-xs font-bold text-[#c01226] hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Partner With Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductSection;
