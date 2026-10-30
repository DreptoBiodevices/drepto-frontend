import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Microscope,
  Building2,
  Award,
  ShieldCheck,
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-t border-slate-200/80" id="purpose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Emcure Style with Red Accent */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Target className="w-3.5 h-3.5 text-[#c01226]" />
            <span>CORPORATE IDENTITY &amp; PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight font-display">
            Engineering Non-Invasive Therapeutic Freedom
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Advancing biomedical innovation from the laboratories of IIT Bombay to deliver gentle, high-efficacy transdermal care for women and chronic pain sufferers.
          </p>
        </div>

        {/* ── Mission & SINE Incubation Cards (2 Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

          {/* ── Card 1: Mission & Patient Care ── */}
          <div className="bg-[#ebedf1]/60 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Top red accent rule */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c01226]" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#c01226] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-red-50 text-[#c01226] border border-red-200">
                  01 &bull; OUR PURPOSE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight font-display">
                Liberating Women from the Toxicity of Oral Pain Pills
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Millions of young women suffer monthly from severe dysmenorrhea and menstrual cramps, often forced to consume oral NSAIDs that cause gastritis, acid reflux, and organ strain. Our purpose is to replace oral medication burdens with gentle, non-invasive transdermal solutions like MenstroHerb—delivering localized, 12-hour continuous comfort so women can live, learn, and lead without interruption.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200/80">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    100% Gastrointestinal Bypass — Zero stomach lining contact or acid burning
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    Biphasic steady-state kinetics delivering 12 continuous hours of pelvic comfort
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    Discreet, non-invasive patch application that respects feminine dignity
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Drepto Bio-Matrix System</span>
              <span className="text-[#c01226] font-bold">Patent: IN202521129798</span>
            </div>
          </div>

          {/* ── Card 2: SINE, IIT Bombay Ecosystem ── */}
          <div className="bg-[#ebedf1]/60 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Top red accent rule */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c01226]" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#c01226] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-red-50 text-[#c01226] border border-red-200">
                  02 &bull; DEEPTECH HERITAGE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight font-display">
                Incubated at SINE, Indian Institute of Technology Bombay
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Drepto Biodevices operates at the vanguard of Indian deep-tech biomedical engineering. Supported by SINE at IIT Bombay, our research synthesizes advanced biocompatible polymer chemistry, clinical pharmacology, and precision device engineering to transform traditional drug administration into next-generation localized therapeutics.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200/80">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    Incubated at SINE, IIT Bombay with multidisciplinary scientific advisory
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    Evaluated under international ISO 10993-23:2021 medical device standards
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800">
                    Clinical pilot publication accepted in peer-reviewed journal (JAIMS)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>SINE Ecosystem</span>
              <span className="text-[#c01226] font-bold">Mumbai, 400076</span>
            </div>
          </div>

        </div>

        {/* ── 4 Executive Metrics Cards in Emcure Style ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#ebedf1] rounded-2xl p-6 border border-slate-200/80 text-center shadow-2xs hover:shadow-sm transition-all">
            <div className="text-3xl sm:text-4xl font-black text-[#c01226] font-display">0.00</div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-1">Primary Irritation Index</div>
            <div className="text-[11px] text-slate-500 mt-0.5">ISO 10993-23 Certified Non-Irritant</div>
          </div>

          <div className="bg-[#ebedf1] rounded-2xl p-6 border border-slate-200/80 text-center shadow-2xs hover:shadow-sm transition-all">
            <div className="text-3xl sm:text-4xl font-black text-[#c01226] font-display">91.2%</div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-1">Ex-Vivo Drug Release</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Franz Cell 12-Hour Permeation</div>
          </div>

          <div className="bg-[#ebedf1] rounded-2xl p-6 border border-slate-200/80 text-center shadow-2xs hover:shadow-sm transition-all">
            <div className="text-3xl sm:text-4xl font-black text-[#c01226] font-display">12 hrs</div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-1">Continuous Steady Relief</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Biphasic Zero-Order Kinetics</div>
          </div>

          <div className="bg-[#ebedf1] rounded-2xl p-6 border border-slate-200/80 text-center shadow-2xs hover:shadow-sm transition-all">
            <div className="text-3xl sm:text-4xl font-black text-[#c01226] font-display">100%</div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-1">GI Tract Bypass</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero Stomach Acid Erosion</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
