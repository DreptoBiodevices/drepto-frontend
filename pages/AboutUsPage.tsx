import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import { FounderQuoteCard } from '../components/CorporateHeroSection';
import { Award, Target, Lightbulb, Users, Building2, ShieldCheck } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const dummyRefs = {
    homeRef: React.useRef(null),
    aboutRef: React.useRef(null),
    teamRef: React.useRef(null),
    galleryRef: React.useRef(null),
    contactRef: React.useRef(null),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sleek Dark Transparent Navbar */}
      <Navbar
        sectionRefs={dummyRefs as any}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-grow">
        {/* ── Luminous Healthcare Hero Banner ── */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f1f3f6] border-b border-slate-200/80">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-2xs">
                <Users className="w-4 h-4 text-[#c01226]" />
                <span>ABOUT DREPTO BIODEVICES</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6 font-display">
                Innovating Healthcare,{' '}
                <span className="text-[#c01226]">
                  Delivering Comfort Beyond
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
                Pioneering targeted transdermal therapeutic platforms at SINE, IIT Bombay to replace oral painkiller toxicity with gentle, dignified, non-invasive patient care.
              </p>
            </div>

            {/* Highlight Stats: Emcure-inspired Soft Grey Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-14 max-w-4xl mx-auto">
              {[
                { icon: <Target className="w-5 h-5 text-[#c01226]" />, label: 'Founded', value: '2025' },
                { icon: <Building2 className="w-5 h-5 text-[#c01226]" />, label: 'Incubated at', value: 'SINE IITB' },
                { icon: <ShieldCheck className="w-5 h-5 text-[#c01226]" />, label: 'Core Platform', value: 'Transdermal' },
                { icon: <Lightbulb className="w-5 h-5 text-[#c01226]" />, label: 'R&D Pipeline', value: 'Patented' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#ebedf1] rounded-[2rem] p-5 text-center border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#c01226] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Purpose, Mission & SINE Incubation */}
        <AboutSection />

        {/* Visual Journey Gallery */}
        <GallerySection />

        {/* Founder & CEO Thought Leadership Card */}
        <FounderQuoteCard />

        {/* Executive Leadership & Advisory Team */}
        <TeamSection />

        {/* Institutional Contact & Partnerships */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
