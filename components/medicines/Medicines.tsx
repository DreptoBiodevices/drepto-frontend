
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PHARMACY_FAQS, PHARMACY_TESTIMONIALS, MEDICINES as DEFAULT_MEDICINES } from '../../constants';
import type { Medicine, Testimonial } from '../../types';
import FAQ from './FAQ';
import { loadMedicines } from '../admin/MedicineData';
import Pagination from '../ui/Pagination';

interface MedicinesProps {
  onViewDetails: (medicine: Medicine) => void;
}

// Icons
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
);

// Helper Components
const ServiceIcon: React.FC<{ icon: string, title: string, subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
    <img src={icon} alt={title} className="h-16 w-16 mb-3 object-contain" />
    <h3 className="font-bold text-white">{title}</h3>
    <p className="text-sm text-teal-100 opacity-90">{subtitle}</p>
  </div>
);

const OrderOption: React.FC<{ icon: string, title: string, actionText: string, onClick: () => void }> = ({ icon, title, actionText, onClick }) => (
  <div className="flex-1 flex flex-col items-center p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow">
    <img src={icon} alt={title} className="h-10 w-10 mb-2" />
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <button onClick={onClick} className="mt-2 text-sm font-bold text-teal-600 hover:text-teal-700">{actionText}</button>
  </div>
);

const OfferCard: React.FC<{ title: string, code: string, description: string, onAction: () => void }> = ({ title, code, description, onAction }) => (
  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center hover:border-teal-400 transition-colors">
    <div className="flex-1">
      <p className="text-xs font-bold text-teal-600 bg-teal-50 inline-block px-2 py-0.5 rounded">{title}</p>
      <p className="text-sm font-bold text-gray-800 mt-1">{description}</p>
      <div className="mt-2">
        <button onClick={onAction} className="px-3 py-1 text-xs font-bold text-teal-700 border border-teal-600 rounded hover:bg-teal-50">
          {code}
        </button>
      </div>
    </div>
    <div className="text-teal-500">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col">
    <div className="flex-grow">
      <svg className="w-8 h-8 text-gray-200 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.913 16 16.017 16H19.017C19.569 16 20.017 15.552 20.017 15V9C20.017 8.448 19.569 8 19.017 8H15.017C14.465 8 14.017 8.448 14.017 9V11C14.017 11.552 13.569 12 13.017 12H12.017V5H22.017V15C22.017 18.314 19.331 21 16.017 21H14.017V21ZM5.01697 21L5.01697 18C5.01697 16.896 5.91297 16 7.01697 16H10.017C10.569 16 11.017 15.552 11.017 15V9C11.017 8.448 10.569 8 10.017 8H6.01697C5.46497 8 5.01697 8.448 5.01697 9V11C5.01697 11.552 4.56897 12 4.01697 12H3.01697V5H13.017V15C13.017 18.314 10.331 21 7.01697 21H5.01697V21Z"></path></svg>
      <p className="text-gray-600 italic text-sm">"{testimonial.quote}"</p>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="font-bold text-gray-900">{testimonial.name}</p>
      <p className="text-xs text-gray-500">{testimonial.location}</p>
    </div>
  </div>
);

const FilterDropdown: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto whitespace-nowrap">
    <span>{label}</span>
    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
  </button>
);

const ProductCard: React.FC<{ product: Medicine; onViewDetails: (medicine: Medicine) => void; onAdd: (m: Medicine) => void; }> = ({ product, onViewDetails, onAdd }) => {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
      <div className="relative h-44 bg-gray-50 flex items-center justify-center p-6">
        <img src={product.imageUrl} alt={product.name} className="h-full w-auto object-contain max-h-36 transition-transform duration-500 group-hover:scale-110" />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm shadow-red-200">{discount}% OFF</div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1 tracking-wider bg-teal-50 inline-block self-start px-2 py-0.5 rounded-full">{product.brand}</p>
        <h3 className="text-sm font-bold text-gray-900 flex-grow leading-snug mb-2 line-clamp-2" title={product.name}>{product.name}</h3>
        <p className="text-xs text-gray-400 font-medium mb-3">{product.packSize}</p>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-extrabold text-gray-900">₹{product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 line-through font-medium">₹{product.mrp.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAdd(product)} className="flex-1 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 active:scale-95">
              ADD
            </button>
            <button onClick={() => onViewDetails(product)} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95">
              VIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Medicines: React.FC<MedicinesProps> = ({ onViewDetails }) => {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState<Medicine[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const fileRef = useRef<HTMLInputElement>(null);

  // Load medicines from localStorage, fallback to constants
  // useEffect removed as per user request to disable API calling
  // useEffect(() => {
  //   const load = () => {
  //     try {
  //       const items = loadMedicines();
  //       // If we have items in filtering or data management, we should trust loadMedicines
  //       // However, if it returns ONLY the initial seed, we might want to check if that's intended.
  //       // For now, let's treat loadMedicines as the Single Source of Truth.
  //       setAll(items);
  //     } catch {
  //       setAll(DEFAULT_MEDICINES);
  //     }
  //   };
  //   load();
  //   const onUpdate = () => load();
  //   window.addEventListener('medicines:updated', onUpdate);
  //   window.addEventListener('storage', onUpdate as any);
  //   return () => {
  //     window.removeEventListener('medicines:updated', onUpdate);
  //     window.removeEventListener('storage', onUpdate as any);
  //   };
  // }, []);

  const addToCart = (m: Medicine) => {
    try {
      const key = 'patient_cart';
      const stored = localStorage.getItem(key);
      const cart: Array<{ id: number | string; name: string; price: string; image: string }> = stored ? JSON.parse(stored) : [];
      cart.push({ id: m.id, name: m.name, price: String(m.price), image: m.imageUrl || '' });
      localStorage.setItem(key, JSON.stringify(cart));
      window.dispatchEvent(new Event('cart:updated'));
    } catch { }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = all || [];
    if (!q) return source;
    return source.filter((p) =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [query, all]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const copyOffer = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Coupon ${code} copied`);
    } catch { }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hi, I want to order medicines.');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+911234567890';
  };

  const handleUploadClick = () => fileRef.current?.click();
  const handleUploadChange = () => alert('Prescription uploaded');

  return (
    <div className="bg-white">
      {/* Mobile Layout (Visible only on mobile) */}
      <div className="md:hidden px-4 pt-4 pb-4 space-y-5 bg-white">

        {/* 0. Header Banner */}
        {/* 0. Header Banner - Prime Style */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-200/50 relative overflow-hidden mb-4">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1 tracking-tight">Welcome to Pharmacy</h2>
            <p className="text-sm font-medium text-teal-50">Your premium health store.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
        </div>

        {/* 1. Service Highlights - Premium */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <img src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" alt="COD" className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 leading-tight">Cash on<br />Delivery</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <img src="https://cdn-icons-png.flaticon.com/512/2979/2979684.png" alt="Express" className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 leading-tight">Express<br />Delivery</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-2">
              <img src="https://cdn-icons-png.flaticon.com/512/1584/1584808.png" alt="Returns" className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 leading-tight">Easy<br />Returns</span>
          </div>
        </div>

        {/* 2. Quick Actions */}
        <div>
          <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3 ml-1">Quick Actions</p>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group active:bg-gray-50">
              <div className="bg-emerald-50 p-2 rounded-full group-active:scale-90 transition-transform">
                <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" alt="WhatsApp" className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">WhatsApp</span>
            </button>
            <button onClick={handleUploadClick} className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group active:bg-gray-50">
              <div className="bg-blue-50 p-2 rounded-full group-active:scale-90 transition-transform">
                <img src="https://cdn-icons-png.flaticon.com/512/2301/2301134.png" alt="Upload" className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">Upload Rx</span>
            </button>
            <button onClick={handleCall} className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group active:bg-gray-50">
              <div className="bg-orange-50 p-2 rounded-full group-active:scale-90 transition-transform">
                <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="Call" className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700">Call Now</span>
            </button>
          </div>
        </div>

        {/* 3. Offers Slider (Grid) */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Exclusive Offers</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl text-white relative overflow-hidden shadow-md flex flex-col justify-between min-h-[100px]">
              <div className="relative z-10">
                <p className="text-[10px] font-bold opacity-90 mb-0.5">NEW USER</p>
                <p className="text-sm font-extrabold mb-1 leading-tight">Flat 25% OFF</p>
              </div>
              <div className="relative z-10 flex items-center justify-between mt-2">
                <code className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-mono">FIRST25</code>
                <button onClick={() => copyOffer('FIRST25')} className="text-[9px] bg-white text-pink-600 px-2 py-1 rounded-full font-bold shadow-sm">Copy</button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
              </div>
            </div>
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl text-white relative overflow-hidden shadow-md flex flex-col justify-between min-h-[100px]">
              <div className="relative z-10">
                <p className="text-[10px] font-bold opacity-90 mb-0.5">HEALTH</p>
                <p className="text-sm font-extrabold mb-1 leading-tight">15% OFF + Back</p>
              </div>
              <div className="relative z-10 flex items-center justify-between mt-2">
                <code className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-mono">HEALTH15</code>
                <button onClick={() => copyOffer('HEALTH15')} className="text-[9px] bg-white text-violet-600 px-2 py-1 rounded-full font-bold shadow-sm">Copy</button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 shadow-inner"
          />
        </div>
      </div>

      {/* Desktop Hero Section (Hidden on Mobile) */}
      <section className="hidden md:block bg-[#0f3460] relative overflow-hidden pt-24 pb-32">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Get Medicines Fast with <span className="text-teal-400">Superfast Delivery</span>
            </h1>
            <p className="text-blue-200 text-lg font-medium">Genuine medicines, great discounts, and doorstep delivery.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceIcon icon="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" title="Cash on Delivery" subtitle="Available on all orders" />
            <ServiceIcon icon="https://cdn-icons-png.flaticon.com/512/2979/2979684.png" title="Express Delivery" subtitle="Within 24 hours in select cities" />
            <ServiceIcon icon="https://cdn-icons-png.flaticon.com/512/1584/1584808.png" title="Easy Returns" subtitle="No questions asked return policy" />
          </div>
        </div>
      </section>

      {/* Desktop Search, Order & Offers Section (Hidden on Mobile) */}
      <section className="hidden md:block bg-gray-50 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="relative flex-grow w-full">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search for Medicines, Health Products..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 text-gray-800"
                />
              </div>
              <button onClick={() => setPage(1)} className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center lg:text-left">Quick Order Options</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <OrderOption onClick={handleWhatsApp} icon="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" title="WhatsApp Order" actionText="Chat Now" />
                  <OrderOption onClick={handleUploadClick} icon="https://cdn-icons-png.flaticon.com/512/2301/2301134.png" title="Upload Rx" actionText="Upload" />
                  <OrderOption onClick={handleCall} icon="https://cdn-icons-png.flaticon.com/512/724/724664.png" title="Call to Order" actionText="Call Now" />
                </div>
                <input ref={fileRef} type="file" className="hidden" onChange={handleUploadChange} accept="image/*,.pdf" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center lg:text-left">Exclusive Offers</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <OfferCard title="NEW USER" description="Flat 25% OFF on first order > ₹1000" code="FIRST25" onAction={() => copyOffer('FIRST25')} />
                  <OfferCard title="HEALTH" description="Get 15% OFF + 5% Cashback" code="HEALTH15" onAction={() => copyOffer('HEALTH15')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section (Visible on both Mobile and Desktop) */}
      <section className="bg-gray-50 pb-16 pt-4 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-extrabold text-gray-900 mb-4 md:mb-0 self-start md:self-auto">Popular Medicines</h2>
            <div className="flex flex-wrap gap-2 self-start md:self-auto">
              <FilterDropdown label="Category" />
              <FilterDropdown label="Brand" />
              <FilterDropdown label="Sort By" />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} onAdd={addToCart} />
            ))}
          </div>

          <div className="mt-8 md:mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>

        {/* Testimonials (Desktop only for now to save space on mobile, or can be enabled) */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-500 mt-2">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PHARMACY_TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      <FAQ faqs={PHARMACY_FAQS} />
    </div>
  );
};

export default Medicines;
