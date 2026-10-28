import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  CheckCircle,
  Package,
} from 'lucide-react';
import { ProductService } from '../lib/api_controller';
import { Product } from '../pages/ProductDetailPage';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-suraveda',
    _id: 'prod-suraveda',
    name: 'Suraveda 24-Hr Targeted Pain Relief Patch',
    description: 'Precision transdermal matrix formulated for chronic joint inflammation, rheumatoid arthritis, and localized stiffness with continuous zero-order release.',
    price: 299,
    images: ['/images/drepto-surveda-relief.png'],
    category: 'Targeted Therapeutics',
    offerDescription: 'Buy 1 Get 1 Free',
    clinicalIndication: 'Rheumatoid Arthritis & Joint Stiffness',
    duration: '24-Hour Sustained Delivery',
    piiScore: '0.00 Non-Irritant',
  } as any,
  {
    id: 'prod-menstroherb',
    _id: 'prod-menstroherb',
    name: 'MenstroHerb Transdermal Cramp Relief Patch',
    description: 'Targeted botanical transdermal system engineered for rapid pelvic absorption, easing primary dysmenorrhea and menstrual cramping without oral gastrointestinal distress.',
    price: 249,
    images: ['/images/products/menstroherb.jpg'],
    category: 'Women Health',
    offerDescription: 'Buy 1 Get 1 Free',
    clinicalIndication: 'Dysmenorrhea & Spasmodic Cramps',
    duration: '12-Hour Continuous Relief',
    piiScore: '0.00 Non-Irritant',
  } as any,
  {
    id: 'prod-aryasoothe',
    _id: 'prod-aryasoothe',
    name: 'AryaSoothe Fast-Acting Muscle & Back Patch',
    description: 'Advanced bio-permeation matrix delivering deep musculoskeletal relief for lumbar strain, postural soreness, and muscle fatigue with high dermal tolerability.',
    price: 229,
    images: ['/images/products/aryasoothe.jpg'],
    category: 'Musculoskeletal',
    offerDescription: 'Buy 1 Get 1 Free',
    clinicalIndication: 'Lumbar Strain & Acute Muscle Soreness',
    duration: '12-Hour Rapid Onset',
    piiScore: '0.00 Non-Irritant',
  } as any,
];

const ProductSection: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await ProductService.getAllProducts();
        const fetched = Array.isArray(response.data)
          ? response.data
          : (response.data?.products || response.data?.data || []);
        if (fetched.length > 0) {
          // Merge API data with rich clinical indication attributes if missing
          const merged = fetched.slice(0, 3).map((item: any, idx: number) => ({
            ...DEFAULT_PRODUCTS[idx % DEFAULT_PRODUCTS.length],
            ...item,
            images: item.images && item.images.length > 0 ? item.images : DEFAULT_PRODUCTS[idx % DEFAULT_PRODUCTS.length].images,
          }));
          setProducts(merged);
        }
      } catch (err) {
        // Fall back gracefully to signature product line
        setProducts(DEFAULT_PRODUCTS);
      }
    };
    fetchCatalog();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
      currentCart.push({ ...product });
      localStorage.setItem('patient_cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('cart:updated'));
      setNotification(`Added "${product.name}" to cart`);
      setTimeout(() => setNotification(null), 2500);
    } catch {
      navigate('/our-products');
    }
  };

  const platforms = [
    {
      icon: <Layers className="w-6 h-6 text-brand-700" />,
      badge: 'Patent Filed Matrix',
      title: 'Polymer Transdermal Matrix',
      subtitle: 'Bio-compatible permeation engineering',
      description:
        'Engineered polymeric carrier architecture that reversibly enhances stratum corneum permeation, delivering active molecules directly to local sub-dermal capillary beds.',
      stat: 'IN202521129798',
      statLabel: 'Patent Application',
      gradient: 'from-brand-50/70 to-teal-50/30',
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-700" />,
      badge: 'Pharmacokinetics',
      title: 'Biphasic 12-Hour Sustained Release',
      subtitle: 'Zero-order steady-state diffusion',
      description:
        'Combines rapid initial onset (relief within 30 minutes) with sustained zero-order kinetic release over 12 continuous hours, avoiding peak-and-trough plasma oscillations.',
      stat: '91.23%',
      statLabel: 'Ex-Vivo Drug Release',
      gradient: 'from-teal-50/70 to-emerald-50/30',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-700" />,
      badge: 'Gastro-Sparing',
      title: 'First-Pass Metabolism Bypass',
      subtitle: 'Zero direct GI contact',
      description:
        'Circumvents gastrointestinal absorption and hepatic degradation, preventing the gastric irritation, ulcers, and hepatotoxicity typical of conventional oral NSAIDs.',
      stat: '100% Non-Oral',
      statLabel: 'GI Mucosa Safe',
      gradient: 'from-emerald-50/70 to-brand-50/30',
    },
    {
      icon: <Award className="w-6 h-6 text-brand-700" />,
      badge: 'ISO Certified',
      title: 'Biocompatibility & Preclinical Safety',
      subtitle: 'ISO 10993-23:2021 Biological Testing',
      description:
        'Rigorously tested under international medical device biological evaluation standards. Proven completely non-irritant with zero erythema and zero edema across evaluated cohorts.',
      stat: '0.00 PII',
      statLabel: 'Zero Irritation Score',
      gradient: 'from-blue-50/70 to-brand-50/30',
    },
    {
      icon: <Microscope className="w-6 h-6 text-brand-700" />,
      badge: 'R&D Pipeline',
      title: 'Targeted Methotrexate System',
      subtitle: 'Rheumatoid Arthritis Therapeutic Platform',
      description:
        'Investigational non-invasive delivery system in development to optimize localized delivery, potentially reduce systemic exposure, and improve long-term adherence for chronic arthritis.',
      stat: 'Preclinical',
      statLabel: 'Development Stage',
      gradient: 'from-amber-50/70 to-orange-50/30',
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-brand-700" />,
      badge: 'Academic Backing',
      title: 'IIT Bombay & Clinical Ecosystem',
      subtitle: 'SINE Incubation & Specialized Advisory',
      description:
        'Developed in association with faculty researchers at IIT Bombay, guided by clinical advisors from Medanta Hospital and pharmaceutical industry leaders.',
      stat: 'SINE IITB',
      statLabel: 'Deeptech Incubation',
      gradient: 'from-purple-50/70 to-brand-50/30',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-100 relative" id="platforms">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-fade-in-up">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* PART 1: COMMERCIAL FORMULATIONS SHOWCASE                 */}
        {/* ======================================================== */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200 mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Commercial Formulations Ready for Order</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Market Formulations &amp; Products
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
                Biomedical transdermal patches formulated with zero-order release kinetics to eliminate gastric irritation while maximizing targeted bioavailability.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-700 hover:bg-brand-800 shadow-sm shadow-brand-700/20 transition-all hover:shadow-md active:scale-95"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => {
              const indication = (product as any).clinicalIndication || 'Localized Targeted Therapy';
              const duration = (product as any).duration || '12-24h Sustained';
              const pii = (product as any).piiScore || '0.00 Non-Irritant';

              return (
                <div
                  key={product.id || product._id || idx}
                  className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
                  onClick={() => navigate('/our-products')}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200/80 px-2.5 py-1 rounded-full">
                        {product.category || 'Therapeutics'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        {product.offerDescription || 'Buy 1 Get 1 Free'}
                      </span>
                    </div>

                    {/* Image Box */}
                    <div className="relative rounded-2xl bg-gradient-to-b from-slate-50 to-brand-50/20 p-6 mb-5 border border-slate-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.images?.[0] || '/images/drepto-surveda-relief.png'}
                        alt={product.name}
                        className="h-48 sm:h-52 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Indication Banner */}
                    <div className="mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        {indication}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-brand-800 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5 font-normal">
                      {product.description}
                    </p>

                    {/* Clinical Specs Chips */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100 text-xs text-slate-600 mb-4">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Duration</span>
                        <span className="font-semibold text-slate-800">{duration}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Skin Safety</span>
                        <span className="font-semibold text-emerald-700">{pii}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">₹{product.price || 299}</span>
                        <span className="text-xs text-slate-400">/ pack</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs tracking-wide shadow-sm shadow-brand-700/20 transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2: PROPRIETARY DELIVERY ARCHITECTURE                */}
        {/* ======================================================== */}
        <div className="pt-12 border-t border-slate-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200 mb-3 shadow-2xs">
                <Zap className="w-3.5 h-3.5" />
                <span>Biomedical Innovation &amp; Delivery Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Proprietary Scientific Platforms
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
                Engineered to replace systemic side-effect burdens with localized, high-bioavailability transdermal therapeutics.
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => navigate('/our-research')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200/90 transition-all shadow-2xs"
              >
                <span>Explore Clinical Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Platforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {platforms.map((platform, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${platform.gradient} border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 bg-white rounded-2xl shadow-2xs border border-slate-100 group-hover:scale-105 transition-transform">
                      {platform.icon}
                    </div>
                    <span className="text-xs font-bold text-brand-800 bg-white/95 border border-brand-200/90 px-3 py-1 rounded-full shadow-2xs">
                      {platform.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-1 leading-snug">
                    {platform.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
                    {platform.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {platform.description}
                  </p>
                </div>

                {/* Bottom Stat Ribbon */}
                <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-black text-slate-900">{platform.stat}</div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {platform.statLabel}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/our-research')}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 group-hover:text-brand-700 group-hover:border-brand-300 transition-colors shadow-2xs"
                    aria-label="View research details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductSection;
