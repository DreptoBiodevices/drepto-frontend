import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="bg-primary py-12 overflow-hidden min-h-[calc(100vh-120px)]">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* top rule + label */}

        <div className="border-t border-white/20 pt-8 ">

       <p className="text-xs font-semibold tracking-widest uppercase text-white/40">
            Who we are
          </p>
          </div>
        {/* large heading — left edge, deliberately oversized */}
        <h2 className="text-6xl md:text-8xl font-bold text-white leading-none tracking-tight mb-4">
          Our<br />Purpose.
        </h2>

        {/* two-column split — no cards, ruled dividers only */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/15">

          {/* Mission */}
          <div className="pb-12 md:pb-0 md:pr-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-8">
              01 — Mission
            </p>
            <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
              Redefining how patients receive treatment.
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              We are building a non-invasive, transdermal methotrexate delivery system that 
              reduces dosage requirements and eliminates the side effects of conventional 
              rheumatoid arthritis therapy — improving outcomes, safety, and daily compliance.
            </p>
          </div>

          {/* Vision */}
          <div className="pt-12 md:pt-0 md:pl-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-8">
              02 — Vision
            </p>
            <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
              A world without the burden of invasive care.
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              We envision a future where patients with chronic conditions experience genuine 
              relief — free from needles, hospitalisation, and harsh systemic effects. 
              Driven by compassion and scientific rigour, we are setting new standards in 
              drug delivery and patient-centred healthcare.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
