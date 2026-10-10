import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Video,
  Pill,
  TestTube2,
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
  color: string; // gradient accent
}

const features: FeatureItem[] = [
  {
    icon: <Video className="w-7 h-7" />,
    title: 'Video Consultations',
    subtitle: 'Connect with verified rheumatologists in minutes',
    description:
      'High-quality, secure video calls with certified doctors from the comfort of your home. Get prescriptions, follow-ups, and specialist opinions without stepping out.',
    badge: 'Live Doctor',
    highlights: [
      'Board-certified specialists',
      'End-to-end encrypted calls',
      'Instant prescription sharing',
      'Follow-up scheduling',
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: <Pill className="w-7 h-7" />,
    title: 'Medicine Delivery',
    subtitle: 'Authentic therapeutics delivered to your doorstep',
    description:
      'Order prescribed medicines online and get them delivered fast. We source only from licensed pharmacies ensuring 100% genuine products.',
    badge: 'Express Delivery',
    highlights: [
      '100% genuine medicines',
      'Express & same-day delivery',
      'Auto-refill reminders',
      'Prescription management',
    ],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
    color: 'from-emerald-500 to-teal-600',
  },
    icon: <HeartPulse className="w-7 h-7" />,
    title: 'Home Nursing',
    subtitle: 'Compassionate, certified in-home clinical care',
    description:
      'Professional nursing care at your home for post-operative recovery, elderly care, and chronic condition management.',
    badge: 'Qualified Staff',
    highlights: [
      'Certified nursing professionals',
      'Post-operative care',
      'Elderly care specialists',
      'Flexible scheduling',
    ],
    image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=600&q=80',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: <Ambulance className="w-7 h-7" />,
    title: 'Ambulance Service',
    subtitle: 'Rapid emergency dispatch across metro hubs',
    description:
      'Quick and reliable emergency ambulance services available 24/7. GPS-tracked, fully equipped vehicles at your service in minutes.',
    badge: '24/7 Response',
    highlights: [
      '24/7 availability',
      'GPS-tracked vehicles',
      'Fully equipped ambulances',
      'Average response < 15 min',
    ],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
    color: 'from-red-500 to-orange-600',
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'Secure Health Records',
    subtitle: 'End-to-end encrypted health record management',
    description:
      'Your medical history, prescriptions, and reports are encrypted and stored securely. Access them anytime, share with doctors effortlessly.',
    badge: 'Encrypted & Safe',
    highlights: [
      'AES-256 encryption',
      'HIPAA-compliant storage',
      'One-click doctor sharing',
      'Complete medical timeline',
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    color: 'from-cyan-500 to-blue-600',
  },
];

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900">
          {/* Background glows */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-200 text-sm font-bold mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Complete Healthcare Ecosystem</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Everything You Need for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-teal-300">
                  Better Health
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                From video consultations with specialists to doorstep medicine delivery and lab tests — 
                we provide a comprehensive suite of healthcare services designed around your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-20">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Side */}
                  <div className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 uppercase tracking-wide shadow-sm">
                        {feature.badge}
                      </div>
                      {/* Icon Overlay */}
                      <div className={`absolute bottom-6 right-6 p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="space-y-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${feature.color} text-white text-xs font-bold uppercase tracking-wider`}>
                        <Zap className="w-3 h-3" />
                        {feature.title}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {feature.subtitle}
                      </h3>
                      <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {feature.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-brand-700 via-brand-800 to-brand-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of patients who trust Drepto Biodevices for their complete healthcare needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-800 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
