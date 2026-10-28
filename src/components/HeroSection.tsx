import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { ProductService } from '../lib/api_controller';
import { Product } from '../pages/ProductDetailPage';
import { ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Check, FileText } from 'lucide-react';

const FALLBACK_PRODUCT: Product = {
  id: 'suraveda-default',
  _id: 'suraveda-default',
  name: 'Suraveda 24-Hr Targeted Pain Relief Patch',
  description: 'Precision polymeric transdermal system engineered for continuous localized delivery in rheumatoid and chronic joint discomfort—bypassing first-pass metabolism with zero GI irritation.',
  price: 299,
  images: ['/images/drepto-surveda-relief.png'],
  offerDescription: 'Buy 1 Get 1 Free • Clinical Introductory Offer',
  category: 'Targeted Therapeutics',
} as any;

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getAllProducts();
        const fetchedProducts = Array.isArray(response.data)
          ? response.data
          : (response.data?.products || response.data?.data || []);
        if (fetchedProducts.length > 0) {
          setFeaturedProduct(fetchedProducts[0]);
        } else {
          setFeaturedProduct(FALLBACK_PRODUCT);
        }
      } catch (error) {
        console.error("Failed to fetch featured product", error);
        setFeaturedProduct(FALLBACK_PRODUCT);
      }
    };
    fetchProduct();
  }, []);

  const displayProduct = featuredProduct || FALLBACK_PRODUCT;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
      currentCart.push({ ...displayProduct });
      localStorage.setItem('patient_cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('cart:updated'));
      navigate('/cart');
    } catch {
      navigate('/our-products');
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20 lg:py-24 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/50">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-24 w-80 sm:w-[32rem] h-80 sm:h-[32rem] bg-brand-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Main Hero Split ── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clinical Positioning & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 relative z-10">
            {/* Clinical Stage Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/90 text-brand-900 text-xs font-bold tracking-tight shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline Group */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="hero-title text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {t('hero.title')}
              </h1>
              <p className="hero-subtitle text-xl sm:text-2xl lg:text-3xl font-bold text-brand-700 tracking-tight leading-snug">
                {t('hero.subtitle')}
              </p>
              <p className="hero-description text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal pt-1">
                {t('hero.description')}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1">
              <button
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-700/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 group"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="ml-2.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/our-research')}
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-brand-400 hover:text-brand-800 transition-all active:scale-95"
              >
                <FileText className="mr-2 w-4 h-4 text-brand-700" />
                <span>Clinical &amp; Patent Dossier</span>
              </button>
            </div>

            {/* Scientific Credentials Badges */}
            <div className="pt-6 sm:pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl border-t border-slate-200/90">
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10px] font-bold text-brand-800 uppercase tracking-widest">Patent Filed</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">IN202521129798</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Polymer Bio-Matrix</div>
              </div>
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10px] font-bold text-brand-800 uppercase tracking-widest">ISO 10993-23</div>
                <div className="text-xs font-bold text-emerald-700 mt-1">0.00 PII Non-Irritant</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Dermal Safety Verified</div>
              </div>
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10px] font-bold text-brand-800 uppercase tracking-widest">Peer-Reviewed</div>
                <div className="text-xs font-bold text-slate-900 mt-1">JAIMS Journal</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Indexed Research Paper</div>
              </div>
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[10px] font-bold text-brand-800 uppercase tracking-widest">Incubation</div>
                <div className="text-xs font-bold text-slate-900 mt-1">SINE, IIT Bombay</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Deeptech Translation</div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Commercial Product Showcase Card */}
          <div className="lg:col-span-5 flex justify-center relative z-10">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 relative overflow-hidden group">
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-500" />
              
              {/* Product Header Pill */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/90 text-brand-800 text-xs font-bold tracking-tight">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  Featured Commercial Therapeutic
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  In Stock
                </span>
              </div>

              {/* Product Image Frame */}
              <div
                className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-brand-50/30 p-5 mb-5 border border-slate-100 cursor-pointer"
                onClick={() => navigate('/our-products')}
              >
                <img 
                  src={displayProduct.images?.[0] || "/images/drepto-surveda-relief.png"} 
                  alt={displayProduct.name} 
                  className="w-full h-52 sm:h-56 object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {displayProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-2">
                  {displayProduct.description}
                </p>

                {/* Clinical Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Release</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">12-24 Hrs</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absorption</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">100% GI-Safe</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PII Score</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">0.00 Non-Irritant</div>
                  </div>
                </div>

                {/* Offer & Price Ribbon */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded mb-1">
                      {displayProduct.offerDescription || 'Buy 1 Get 1 Free'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900 leading-none">
                        ₹{displayProduct.price && displayProduct.price > 0 ? displayProduct.price : 299}
                      </span>
                      <span className="text-xs font-medium text-slate-400">/ pack</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-brand-700/20 active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Institutional Backing Bar ── */}
        <div className="mt-14 sm:mt-18 py-5 px-6 sm:px-8 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Institutional Incubation &amp; Research Backing
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                SINE — IIT Bombay
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                BIRAC (Dept. of Biotechnology)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                JAIMS Clinical Journal
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                Controller General of Patents (CGPDTM)
              </span>
            </div>
          </div>
        </div>

        {/* ── Video Display with Clinical Chassis ── */}
        <div className="mt-10 sm:mt-12 relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950">
          <div className="px-6 py-3.5 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-white tracking-tight">Transdermal Kinetic Release &amp; Polymer Matrix Architecture</span>
            </div>
            <span className="hidden sm:inline text-slate-400 text-[11px] font-mono">
              Franz Diffusion Cell Evaluation • Ex-Vivo Bio-Permeation Demonstration
            </span>
          </div>
          <video
            src="/images/vid.mp4"
            className="w-full object-cover max-h-[460px]"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
