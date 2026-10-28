import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Video,
  Pill,
  HeartPulse,
  Ambulance,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  highlights: string[];
  image: string;
  solidBg: string;
}

const features: FeatureItem[] = [
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Clinical Video Consultations',
    subtitle: 'Direct high-fidelity access to verified rheumatology specialists',
    description:
      'Encrypted, low-latency tele-rheumatology consultations with certified clinical specialists. Seamlessly share clinical records, acquire targeted treatment plans, and track longitudinal inflammatory biomarkers.',
    badge: 'Specialist Network',
    highlights: [
      'Board-certified rheumatologists',
      'End-to-end encrypted sessions',
      'Instant digitized prescription sharing',
      'Longitudinal follow-up tracking',
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    solidBg: 'bg-slate-900',
  },
  {
    icon: <Pill className="w-6 h-6" />,
    title: 'Therapeutic Cold-Chain Dispatch',
    subtitle: 'Certified transdermal patches and biologic therapies delivered direct',
    description:
      'Direct order fulfillment for targeted transdermal NSAID formulations and chronic therapeutics. Sourced strictly through GMP-certified channels with temperature-monitored courier logistics.',
    badge: 'GMP Certified Logistics',
    highlights: [
      'Batch-verified authentic formulations',
      'Cold-chain integrity guarantee',
      'Automated refill scheduling',
      'Validated prescription authentication',
    ],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
    solidBg: 'bg-teal-900',
  },
  {
    icon: <HeartPulse className="w-6 h-6" />,
    title: 'In-Home Specialized Nursing',
    subtitle: 'Compassionate, protocol-driven clinical care for chronic arthritis',
    description:
      'Certified clinical nursing assistance right at home for acute flare-up management, post-arthroplasty rehabilitation, and geriatric joint mobility support.',
    badge: 'Clinical Protocol',
    highlights: [
      'Certified nursing practitioners',
      'Post-operative joint rehabilitation',
      'Targeted mobility assistance',
      'Standardized vitals & flare telemetry',
    ],
    image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=600&q=80',
    solidBg: 'bg-slate-800',
  },
  {
    icon: <Ambulance className="w-6 h-6" />,
    title: 'Priority Clinical Transit Support',
    subtitle: 'Rapid emergency ambulance dispatch across major urban healthcare clusters',
    description:
      'Dedicated 24/7 emergency response infrastructure equipped for acute rheumatological and orthopedic transport, connected directly to regional tertiary research hospitals.',
    badge: '24/7 Response',
    highlights: [
      'Dedicated medical transit dispatch',
      'Real-time GPS fleet tracking',
      'Fully equipped paramedic systems',
      'Under 15-minute rapid response tier',
    ],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
    solidBg: 'bg-slate-900',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Biometric Encrypted Health Vault',
    subtitle: 'AES-256 cloud repository for patient telemetry and diagnostic history',
    description:
      'High-security, HIPAA/ISO-compliant digital architecture for longitudinal synovial fluid analysis, radiographic scans, dosage histories, and physician notes.',
    badge: 'Zero-Knowledge Security',
    highlights: [
      'AES-256 zero-knowledge encryption',
      'HIPAA & ISO-27001 validated storage',
      'Permission-gated specialist access',
      'Complete longitudinal health records',
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    solidBg: 'bg-teal-900',
  },
];

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-grow">
        {/* Monochromatic Institutional Hero Header */}
        <section className="relative overflow-hidden pt-36 pb-24 bg-slate-950 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Integrated Healthcare & Research Infrastructure</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Precision Therapeutics &{' '}
                <span className="text-teal-400">
                  Comprehensive Patient Ecosystem
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                From breakthrough transdermal drug delivery platforms to seamless tele-rheumatology and home clinical care — our ecosystem delivers holistic chronic arthritis management.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Staggered Grid */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Side */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200 shadow-xl shadow-slate-900/5">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
                      />
                      {/* Solid Monochromatic Tag */}
                      <div className="absolute top-4 left-4 bg-slate-900 text-white border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                        {feature.badge}
                      </div>
                      {/* Solid Icon Box */}
                      <div className={`absolute bottom-6 right-6 p-3.5 rounded-2xl ${feature.solidBg} text-white border border-slate-700 shadow-xl`}>
                        {feature.icon}
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Side */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-teal-400 text-xs font-bold uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5" />
                        {feature.title}
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        {feature.subtitle}
                      </h2>
                      <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Highlights Cards with tactile micro-interactions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {feature.highlights.map((highlight) => (
                        <motion.div
                          key={highlight}
                          whileHover={{ x: 4, borderColor: "#0F172A" }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-800">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Monochromatic Obsidian CTA Section */}
        <section className="py-24 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 tracking-tight">
                Advance Your Arthritis Management with Precision Therapeutics
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Connect with Drepto Biodevices' clinical teams to review proprietary patch formulations, preclinical trial data, or request specialized partner samples.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.025, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/our-products')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-teal-950/20 hover:bg-teal-500 transition-all group"
                >
                  Explore Therapeutic Platforms
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.025, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-sm tracking-wide hover:bg-slate-700 hover:text-white transition-all"
                >
                  Contact Clinical Team
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;