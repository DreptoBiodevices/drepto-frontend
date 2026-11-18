import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Activity,
  ShieldCheck,
  ArrowRight,
  Package,
} from 'lucide-react';

const ProductSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fa] border-t border-slate-200/80" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Emcure Style with Red Accent */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-300/80 mb-3 shadow-2xs">
              <Package className="w-3.5 h-3.5 text-slate-700" />
              <span>OUR PRODUCTS &amp; THERAPEUTIC FORMULATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold sm:font-black text-slate-900 tracking-tight leading-tight font-display">
              Targeted Transdermal Care for Women &amp; Beyond
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              Engineered at SINE, IIT Bombay to replace systemic side-effect burdens with localized, high-bioavailability transdermal therapeutics.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate('/our-products')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md cursor-pointer group"
            >
              <span>View Complete Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── 3-COLUMN THERAPEUTIC PIPELINE & FORMULATIONS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-300/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-[#F4F9F9] text-[#0B6F6D] rounded-2xl border border-[#D0E6E6] group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-[#0B6F6D] bg-[#F4F9F9] border border-[#D0E6E6] px-3 py-1 rounded-full">
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
                className="text-xs font-bold text-slate-900 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
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
                <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
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
                className="text-xs font-bold text-[#0B6F6D] hover:text-[#0B5C5A] flex items-center gap-1 cursor-pointer"
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
                <div className="p-3 bg-[#F4F9F9] text-[#0B6F6D] rounded-2xl border border-[#D0E6E6] group-hover:scale-105 transition-transform">
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
                className="text-xs font-bold text-[#0B6F6D] hover:text-[#0B5C5A] flex items-center gap-1 cursor-pointer"
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
