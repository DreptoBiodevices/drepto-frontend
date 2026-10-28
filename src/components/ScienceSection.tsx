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
} from 'lucide-react';

export const ScienceSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mechanism' | 'pipeline' | 'evidence'>('mechanism');

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 relative overflow-hidden border-y border-slate-200/80" id="science">
      {/* Background Ambient Clinical Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Microscope className="w-3.5 h-3.5 text-brand-600" />
            <span>The Science &amp; Technology Platform</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Evidence-Based Innovation in Transdermal Drug Delivery
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Overcoming the critical pharmacokinetic and safety limitations of conventional oral and injectable therapeutics through precision biomedical delivery.
          </p>

          {/* Tab Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 max-w-xl mx-auto shadow-inner">
            <button
              onClick={() => setActiveTab('mechanism')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'mechanism'
                  ? 'bg-white text-brand-800 shadow-md shadow-slate-200/80 border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Technology &amp; Mechanism
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-white text-brand-800 shadow-md shadow-slate-200/80 border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              R&amp;D Pipeline Stage
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'evidence'
                  ? 'bg-white text-brand-800 shadow-md shadow-slate-200/80 border border-slate-200/60'
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
              
              {/* Conventional Limitations */}
              <div className="bg-rose-50/40 rounded-3xl p-6 sm:p-8 border border-rose-200/80 relative shadow-soft">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-bold uppercase mb-4">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  The Clinical Challenge: Oral &amp; Systemic Delivery
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                  Limitations of Current Rheumatoid Arthritis &amp; Pain Therapy
                </h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <div>
                      <strong className="text-slate-900 block">Severe Gastrointestinal Toxicity:</strong>
                      Oral NSAIDs and systemic medications frequently induce gastritis, peptic ulceration, and abdominal distress.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <div>
                      <strong className="text-slate-900 block">Extensive First-Pass Hepatic Metabolism:</strong>
                      Oral molecules undergo massive liver degradation before reaching systemic circulation, necessitating elevated dosage burdens.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</span>
                    <div>
                      <strong className="text-slate-900 block">Peak-and-Trough Plasma Oscillations:</strong>
                      Oral dosing creates rapid spikes and valleys in drug serum levels, contributing to adverse side effects and low patient compliance.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Drepto Transdermal Solution */}
              <div className="bg-gradient-to-br from-brand-50/70 via-teal-50/30 to-white rounded-3xl p-6 sm:p-8 border border-brand-200 relative shadow-elevated">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 border border-brand-300 text-brand-900 text-xs font-bold uppercase mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  The Drepto Approach: Targeted Transdermal Matrix
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                  Engineered Localized Permeation with Gastro-Sparing Action
                </h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">100% Gastrointestinal Bypass:</strong>
                      Direct dermal absorption circumvents the gastrointestinal tract and stomach lining, mitigating common GI adverse events.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Biphasic Zero-Order Release Profile:</strong>
                      Engineered polymeric matrix achieves initial rapid onset (&lt;30 mins) followed by 12+ hours sustained steady-state delivery.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Improved Patient Tolerability &amp; Adherence:</strong>
                      Non-invasive, discreet application eliminates needle discomfort and complex multi-dose schedules.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3 Pillars of Technology */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-elevated hover:border-brand-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 border border-brand-100">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Polymer Permeation Matrix</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Proprietary bio-adhesive matrix architecture (Patent App IN202521129798) formulated to reversibly facilitate stratum corneum transport without causing dermal irritation.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-elevated hover:border-brand-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 border border-teal-100">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Controlled Release Kinetics</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Laboratory Franz cell permeation assays demonstrated 91.23% cumulative therapeutic release over 12 continuous hours, avoiding peak-dose toxicities.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-elevated hover:border-brand-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Preclinical Safety Rigor</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Evaluated in accordance with ISO 10993-23:2021 Biological Evaluation of Medical Devices, scoring a Primary Irritation Index (PII) of 0.00 (certified non-irritant).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: R&D Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Development Pipeline &amp; Regulatory Pathway</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Transparent stage-gate development milestones across our transdermal portfolio.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">Active Programs</span>
                </div>
              </div>

              {/* Timeline / Roadmap items */}
              <div className="space-y-6">
                
                {/* Program 1: MenstroHerb Polyherbal Matrix */}
                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Lead Program
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        Drepto MenstroHerb Transdermal Matrix (Formulation &amp; Safety)
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">Patent: IN202521129798</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Targeted smooth-muscle relaxation patch for pelvic discomfort. Clinical pilot study published in peer-reviewed journal; preclinical ISO 10993 biocompatibility testing certified non-irritant.
                  </p>
                  {/* Status Steps */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-bold block">✓ Formulation</span>
                      Completed
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-bold block">✓ ISO 10993 Safety</span>
                      Certified (PII 0.00)
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-bold block">✓ Human Pilot Study</span>
                      Published (JAIMS)
                    </div>
                    <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 font-bold">
                      <span className="font-bold block">● Commercial Stage</span>
                      Available in India
                    </div>
                  </div>
                </div>

                {/* Program 2: Transdermal Methotrexate Delivery System */}
                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Preclinical R&amp;D
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        Targeted Transdermal Methotrexate System (Rheumatoid Arthritis)
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">Investigation Pipeline</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Novel delivery system being developed to improve localized bioavailability, potentially reduce systemic exposure, and improve treatment tolerability and patient compliance in chronic rheumatoid arthritis management.
                  </p>
                  {/* Status Steps */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-bold block">✓ Concept &amp; Design</span>
                      Formulation Matrix
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                      <span className="font-bold block">● Preclinical Diffusion</span>
                      In-Vitro Permeation
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500">
                      <span className="font-bold block">○ In-Vivo Animal Study</span>
                      Planned Protocol
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500">
                      <span className="font-bold block">○ Clinical &amp; CDSCO</span>
                      Regulatory Pathway
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Clinical & Safety Data */}
        {activeTab === 'evidence' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Publication 1: JAIMS */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200">
                      Peer-Reviewed Journal Publication
                    </span>
                    <span className="text-xs text-slate-500 font-mono">JAIMS 2026; 11(7)</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Clinical Evaluation &amp; Permeation Kinetics of Transdermal Matrix
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Peer-reviewed clinical investigation detailing biphasic drug release, patient reported relief speed, and gastro-sparing pharmacological properties.
                  </p>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
                      <div className="text-3xl font-black text-brand-800">96%</div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">Relief onset &lt;30 mins</div>
                    </div>
                    <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
                      <div className="text-3xl font-black text-brand-800">91.23%</div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">Ex-vivo cumulative release</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Certified Open Access</span>
                  <button
                    onClick={() => navigate('/our-research')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors"
                  >
                    <span>Read Full Paper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Publication 2: ISO 10993 */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      Medical Device Preclinical Safety
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Study NLS-TX-270/26</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    ISO 10993-23:2021 Biological Evaluation of Medical Devices
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Standardized GLP-compliant in-vivo skin irritation study evaluating dermal compatibility, erythema, and edema formation over continuous exposure.
                  </p>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                      <div className="text-3xl font-black text-teal-800">0.00</div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">Primary Irritation Index (PII)</div>
                    </div>
                    <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                      <div className="text-3xl font-black text-teal-800">100%</div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">Non-irritant rating</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Certified Laboratory Report</span>
                  <button
                    onClick={() => navigate('/our-research')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    <span>Inspect Safety Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Institutional Backing Footer Ribbon */}
        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
            <span>Incubated at <strong>Society for Innovation &amp; Entrepreneurship (SINE), IIT Bombay</strong></span>
          </div>
          <div className="flex items-center gap-6">
            <span>Patent App: <strong>IN202521129798</strong></span>
            <span>Trademark: <strong>7344054</strong></span>
            <button
              onClick={() => navigate('/our-research')}
              className="font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors"
            >
              <span>Scientific Publications Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScienceSection;
