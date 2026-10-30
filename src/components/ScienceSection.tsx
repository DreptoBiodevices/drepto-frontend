import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Microscope,
  ShieldCheck,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const ScienceSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mechanism' | 'pipeline' | 'evidence'>('mechanism');

  return (
    <section className="py-20 sm:py-28 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80" id="science">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Emcure Style with Red Accent */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Microscope className="w-3.5 h-3.5 text-teal-700" />
            <span>SCIENCE &amp; INNOVATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold sm:font-black tracking-tight text-slate-900 leading-tight font-display">
            Evidence-Based Innovation in Transdermal Drug Delivery
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Overcoming the pharmacokinetic, hepatic, and gastrointestinal limitations of conventional oral painkillers through non-invasive precision bio-delivery.
          </p>

          {/* Tab Controls: Sleek Corporate Pill Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-6 p-1.5 bg-[#ebedf1] rounded-2xl max-w-xl mx-auto border border-slate-300/80 shadow-xs">
            <button
              onClick={() => setActiveTab('mechanism')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === 'mechanism'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Technology &amp; Mechanism
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === 'pipeline'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              R&amp;D Pipeline
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                activeTab === 'evidence'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Clinical &amp; Safety Data
            </button>
          </div>
        </div>

        {/* TAB 1: Mechanism & Clinical Challenge */}
        {activeTab === 'mechanism' && (
          <div className="space-y-12 animate-fade-in">
            {/* Comparison Grid: Problem vs Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Conventional Oral Limitations */}
              <div className="bg-[#ebedf1]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-300/90 relative shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/90 border border-rose-200 text-rose-800 text-xs font-bold uppercase mb-4">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>The Clinical Challenge: Oral Analgesics</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                    Limitations of Conventional Oral NSAIDs &amp; Pills
                  </h3>
                  <ul className="space-y-4 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">×</span>
                      <div>
                        <strong className="text-slate-900 block font-semibold">Severe Gastrointestinal Toxicity:</strong>
                        Oral NSAIDs cause direct mucosal contact irritation, gastritis, and stomach acid reflux in regular users.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">×</span>
                      <div>
                        <strong className="text-slate-900 block font-semibold">Extensive First-Pass Hepatic Metabolism:</strong>
                        Up to 60% of oral dosage is metabolized and discarded by the liver, requiring high chemical doses to achieve relief.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">×</span>
                      <div>
                        <strong className="text-slate-900 block font-semibold">Peak-and-Trough Serum Spikes:</strong>
                        Oral tablets lead to unpredictable plasma spikes, causing fatigue, nausea, and rapid wear-off within 3–4 hours.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
                  Result: High organ burden, gastrointestinal erosion, and poor patient comfort.
                </div>
              </div>

              {/* Drepto Transdermal Solution */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border-2 border-teal-600/30 relative shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase mb-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>The Drepto Bio-Matrix Solution</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                    Localized Transdermal Permeation &bull; 100% GI Safe
                  </h3>
                  <ul className="space-y-4 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">100% Gastrointestinal Bypass:</strong>
                        Active therapeutics diffuse directly into sub-dermal capillary beds, completely eliminating stomach acid irritation.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">12-Hour Sustained Zero-Order Kinetics:</strong>
                        Engineered polymer matrix delivers rapid onset in under 30 minutes followed by constant, steady comfort for 12 hours.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#c01226] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Ultra-Discreet &amp; Biocompatible:</strong>
                        Ultra-thin, skin-toned, non-irritant patch designed for active women—wearable undetected under any attire.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/80 text-xs text-[#c01226] font-bold flex items-center justify-between">
                  <span>Patent App: IN202521129798</span>
                  <span>ISO 10993-23 Certified Non-Irritant</span>
                </div>
              </div>
            </div>

            {/* 3 Pillars of Technology */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 sm:p-7 bg-[#ebedf1]/70 rounded-2xl border border-slate-300/90 shadow-2xs hover:shadow-md hover:border-[#c01226]/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#c01226] shadow-sm flex items-center justify-center mb-4 border border-slate-200/80 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Polymer Permeation Matrix</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Proprietary bio-adhesive matrix architecture formulated to reversibly facilitate stratum corneum transport without causing dermal irritation.
                </p>
              </div>

              <div className="p-6 sm:p-8 bg-[#ebedf1]/50 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-[#c01226]/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#c01226] shadow-sm flex items-center justify-center mb-4 border border-slate-200/80 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">12-Hour Controlled Kinetics</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Laboratory Franz cell permeation assays demonstrated 91.23% cumulative therapeutic release over 12 continuous hours, avoiding peak-dose toxicities.
                </p>
              </div>

              <div className="p-6 sm:p-8 bg-[#ebedf1]/50 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-[#c01226]/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#c01226] shadow-sm flex items-center justify-center mb-4 border border-slate-200/80 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Preclinical Safety Rigor</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Evaluated in accordance with ISO 10993-23:2021 Biological Evaluation of Medical Devices, scoring a Primary Irritation Index (PII) of 0.00 (certified non-irritant).
                </p>
              </div>
            </div>

            {/* Animated Device Mechanism Video Showcase */}
            <div className="mt-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300/90 shadow-md bg-white">
              <div className="px-5 py-3.5 bg-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-white tracking-tight">
                    Transdermal Dosing &amp; Compartment Flux Simulation
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  SINE IIT Bombay &bull; Patent App IN202521129798
                </span>
              </div>
              <div className="relative w-full bg-white flex items-center justify-center p-2 sm:p-4">
                <video
                  src="/images/vid.mp4"
                  className="w-full h-auto max-h-[460px] object-contain rounded-xl shadow-xs"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: R&D Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#ebedf1]/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-300/90 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200/80 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-display">Development Pipeline &amp; Regulatory Pathway</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Transparent stage-gate development milestones across our feminine hygiene &amp; transdermal portfolio.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c01226] animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 border border-slate-300 px-3 py-1 rounded-full">
                    Active Programs
                  </span>
                </div>
              </div>

              {/* Timeline / Roadmap items */}
              <div className="space-y-6">
                {/* Program 1: MenstroHerb Polyherbal Matrix */}
                <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-300/90 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Commercial Stage
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        Drepto MenstroHerb Transdermal Matrix (Feminine Cramp Relief)
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">Patent: IN202521129798</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Targeted smooth-muscle relaxation patch for dysmenorrhea and pelvic pain. Clinical pilot study published in peer-reviewed journal; preclinical ISO 10993 biocompatibility testing certified non-irritant.
                  </p>
                  {/* Status Steps */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-bold block text-emerald-700">Formulation</span>
                      Polymer Matrix
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-bold block text-emerald-700">ISO 10993-23</span>
                      Certified (PII 0.00)
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-bold block text-emerald-700">Clinical Pilot</span>
                      Published (JAIMS)
                    </div>
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[#c01226] font-bold">
                      <span className="font-bold block">● Commercial</span>
                      Available in India
                    </div>
                  </div>
                </div>

                {/* Program 2: Transdermal Methotrexate Delivery System */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Preclinical R&amp;D
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        Transdermal Methotrexate Delivery for Rheumatoid Arthritis
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">In Vitro Permeation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Investigational localized delivery platform to bypass systemic hepatic toxicity of DMARDs and elevate synovial joint therapeutic concentration.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-bold block text-emerald-700">Preformulation</span>
                      Carrier Synthesis
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                      <span className="font-bold block">● Ex-Vivo Franz Cells</span>
                      Skin Permeation
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <span className="font-bold block">○ In Vivo Toxicity</span>
                      Scheduled
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <span className="font-bold block">○ Phase I Safety</span>
                      Planned
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Clinical & Safety Evidence */}
        {activeTab === 'evidence' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: ISO 10993 */}
              <div className="bg-[#ebedf1]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-300/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-4 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ISO 10993-23:2021 Biological Evaluation</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3">
                    Certified 0.00 Non-Irritant Skin Score
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Drepto MenstroHerb was tested by accredited third-party laboratories following international medical device biological safety guidelines. Zero erythema and zero edema were observed across all testing intervals.
                  </p>
                  <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Test Guideline:</span>
                      <span className="font-semibold text-slate-900">ISO 10993-23:2021 (Skin Irritation)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Primary Irritation Index:</span>
                      <span className="font-bold text-emerald-600">0.00 / 8.00 (Completely Non-Irritant)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Observation Window:</span>
                      <span className="font-semibold text-slate-900">24h, 48h, 72h Continuous Evaluation</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Accredited Bio-Testing</span>
                  <span className="text-emerald-700 font-bold">100% Passed</span>
                </div>
              </div>

              {/* Card 2: JAIMS Publication */}
              <div className="bg-[#ebedf1]/60 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#c01226] text-xs font-bold uppercase mb-4 border border-red-200">
                    <FileText className="w-3.5 h-3.5 text-[#c01226]" />
                    <span>Peer-Reviewed Clinical Literature</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3">
                    Published in JAIMS Journal
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Our pilot clinical investigation into the efficacy and tolerability of transdermal herbal delivery for dysmenorrhea was accepted and published in the peer-reviewed Journal of Ayurveda and Integrated Medical Sciences.
                  </p>
                  <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Journal:</span>
                      <span className="font-semibold text-slate-900">JAIMS (Peer-Reviewed)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Focus:</span>
                      <span className="font-semibold text-slate-900">Dysmenorrhea Transdermal Bio-Delivery</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Authors:</span>
                      <span className="font-semibold text-slate-900">Drepto Scientific Team &amp; Clinical Investigators</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <button
                    onClick={() => navigate('/our-research')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c01226] hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <span>Read Full Paper in Our Research</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ScienceSection;
