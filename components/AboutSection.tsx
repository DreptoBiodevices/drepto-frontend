import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50" id="purpose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* ── Left Card: Our Purpose ── */}
          <div className="lg:col-span-7 bg-brand-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Background subtle glow */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-200">Who We Are</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 text-white">Our Purpose.</h2>

              <div className="mt-8 space-y-8">
                {/* Mission Block */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold tracking-widest text-teal-300">01 — MISSION</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Redefining how patients receive treatment.</h3>
                  <p className="text-slate-100/90 text-sm sm:text-base leading-relaxed">
                    Our mission is to revolutionize the treatment of rheumatoid arthritis by providing an innovative, non-invasive, and patient-friendly transdermal methotrexate delivery solution. We aim to improve patient outcomes, safety, and compliance by reducing dosage requirements and side effects.
                  </p>
                </div>

                {/* Vision Block */}
                <div className="space-y-2 pt-2 border-t border-brand-600/60">
                  <div className="text-xs font-mono font-bold tracking-widest text-teal-300">02 — VISION</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">A world without the burden of invasive care.</h3>
                  <p className="text-slate-100/90 text-sm sm:text-base leading-relaxed">
                    Our vision is to revolutionize the treatment of rheumatoid arthritis, transforming lives with our innovative drug delivery systems. We dream of a world where patients experience relief without the burden of invasive procedures or harsh side effects. Driven by compassion and a commitment to excellence, we aim to set new standards in healthcare.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer indicator */}
            <div className="pt-8 text-xs font-medium text-brand-200">
              Drepto Research &amp; Development Initiative
            </div>
          </div>

          {/* ── Right Card: Careers ── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col justify-between relative">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-teal-400">Careers</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white leading-tight">
                Join our team.<br />Shape medical technology.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                We're a small, ambitious team building diagnostic &amp; drug delivery tools that matter. If you're driven by impact and want to work on hard problems in healthcare, we want to hear from you.
              </p>

              {/* Highlight Badges */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                  <span className="font-medium">Cutting-edge bio-MEMS &amp; biomedical research</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                  <span className="font-medium">Collaborative interdisciplinary culture</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                  <span className="font-medium">Real career growth &amp; equity incentives</span>
                </div>
              </div>
            </div>

            {/* Career CTA */}
            <div className="pt-10">
              <a
                href="mailto:careers@drepto.in"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white text-slate-900 hover:bg-brand-50 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md"
              >
                <span>Apply now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;