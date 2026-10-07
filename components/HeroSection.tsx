import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { ProductService } from '../lib/api_controller';
import { Product } from './ProductDetailModal';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getAllProducts();
        const fetchedProducts = Array.isArray(response.data) ? response.data : (response.data.products || response.data.data || []);
        if (fetchedProducts.length > 0) {
          setFeaturedProduct(fetchedProducts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch featured product", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-16 lg:py-20 bg-gradient-to-b from-white via-brand-50/20 to-clinical-surface">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -right-20 w-64 sm:w-96 h-64 sm:h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-56 sm:w-80 h-56 sm:h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Hero Content ── */}
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full lg:w-3/5 space-y-5 sm:space-y-10 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-brand-100/60 border border-brand-200 text-brand-800 text-xs sm:text-sm font-bold">
              <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-brand-600 animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>

            <div className="space-y-3 sm:space-y-6">
              <h1 className="hero-title text-3xl sm:text-5xl lg:text-[6.5rem] font-extrabold text-slate-900 tracking-tight leading-tight lg:leading-[1.1]">
                {t('hero.title')}
              </h1>
              <p className="hero-subtitle text-lg sm:text-3xl lg:text-5xl font-semibold text-brand-700 tracking-normal leading-tight">
                {t('hero.subtitle')}
              </p>
              <p className="hero-description text-slate-600 text-sm sm:text-xl lg:text-2xl max-w-5xl leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 pt-2 sm:pt-6">
              <button
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-white bg-brand-700 hover:bg-brand-800 shadow-md shadow-brand-700/20 transition-all active:scale-95"
              >
                <span>{t('hero.getStarted')}</span>
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/about-us')}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-soft transition-all active:scale-95"
              >
                {t('hero.learnMore')}
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-end relative z-10 mt-12 lg:mt-0">
             {/* Small Product Card */}
             {featuredProduct && (
               <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 w-full sm:max-w-sm animate-fade-in-up mx-auto lg:mx-0" style={{ animationDelay: '0.4s' }}>
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-brand-50 to-white mb-6 group cursor-pointer border border-brand-100" onClick={() => navigate('/our-products')}>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 flex items-center gap-1 border border-brand-200">
                          <span className="w-2 h-2 rounded-full bg-brand-600"></span> Featured
                      </div>
                      <img 
                          src={featuredProduct.images?.[0] || "/images/drepto-surveda-relief.png"} 
                          alt={featuredProduct.name} 
                          className="w-full h-52 object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                      />
                  </div>
                  <div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{featuredProduct.name}</h3>
                      <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed font-medium">{featuredProduct.description}</p>
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                          <div className="flex flex-col">
                              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</span>
                              <span className="text-2xl font-black text-slate-900 leading-none">₹{featuredProduct.price || 0}</span>
                          </div>
                          <button 
                              onClick={() => navigate('/our-products')}
                              className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-700/10 flex items-center gap-2 font-bold group"
                          >
                              <span>Buy</span>
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                          </button>
                      </div>
                  </div>
              </div>
             )}
          </div>
        </div>

        {/* ── Video Below Hero ── */}
        <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <video
            src="/images/vid.mp4"
            className="rounded-2xl shadow-2xl w-full object-cover max-h-[480px]"
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
