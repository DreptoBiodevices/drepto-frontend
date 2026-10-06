import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PHARMACY_FAQS, PHARMACY_TESTIMONIALS, MEDICINES as DEFAULT_MEDICINES } from '../../constants';
import type { Medicine, Testimonial } from '../../types';
import FAQ from './FAQ';
import Pagination from '../ui/Pagination';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';

interface MedicinesProps {
  onViewDetails: (medicine: Medicine) => void;
}

/* ── shared primitives ────────────────────────────────────── */

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">{children}</p>
);

/* ── offer chip ───────────────────────────────────────────── */
const OfferChip: React.FC<{ tag: string; desc: string; code: string; onCopy: () => void }> = ({ tag, desc, code, onCopy }) => (
  <div className="border border-gray-200 p-4 flex items-start justify-between gap-4" style={{ borderRadius: '0.25rem' }}>
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">{tag}</p>
      <p className="text-sm font-bold text-gray-900 mb-2 leading-snug">{desc}</p>
      <code className="text-xs font-mono text-gray-500">{code}</code>
    </div>
    <button
      onClick={onCopy}
      style={{ borderRadius: '0.25rem' }}
      className="flex-shrink-0 text-[10px] font-bold border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-primary hover:text-primary transition-colors"
    >
      Copy
    </button>
  </div>
);

/* ── product card ─────────────────────────────────────────── */
const ProductCard: React.FC<{
  product: Medicine;
  onViewDetails: (m: Medicine) => void;
  onAdd: (m: Medicine) => void;
}> = ({ product, onViewDetails, onAdd }) => {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group flex flex-col border border-gray-100 bg-white overflow-hidden hover:border-gray-300 transition-colors duration-200" style={{ borderRadius: '0.25rem' }}>
      {/* image */}
      <div className="relative h-40 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-auto object-contain max-h-32 transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-green-600 px-2 py-0.5" style={{ borderRadius: '0.125rem' }}>
            {discount}% off
          </span>
        )}
      </div>

      {/* info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">{product.brand}</p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 flex-1 mb-2">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-3">{product.packSize}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.mrp.toFixed(2)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAdd(product)}
            style={{ borderRadius: '0.25rem' }}
            className="flex-1 py-2 bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => onViewDetails(product)}
            style={{ borderRadius: '0.25rem' }}
            className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold hover:border-gray-400 transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── testimonial ──────────────────────────────────────────── */
const TestimonialRow: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="py-5 border-b border-gray-100 last:border-0">
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
        <p className="text-xs text-gray-400">{testimonial.location}</p>
      </div>
      <p className="text-xs text-yellow-500">{'★'.repeat(5)}</p>
    </div>
    <p className="text-sm text-gray-500 leading-relaxed italic">"{testimonial.quote}"</p>
  </div>
);

/* ── main component ───────────────────────────────────────── */
const Medicines: React.FC<MedicinesProps> = ({ onViewDetails }) => {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState<Medicine[]>(DEFAULT_MEDICINES);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const fileRef = useRef<HTMLInputElement>(null);

  const addToCart = (m: Medicine) => {
    try {
      const key = 'patient_cart';
      const cart = JSON.parse(localStorage.getItem(key) || '[]');
      cart.push({ id: m.id, name: m.name, price: String(m.price), image: m.imageUrl || '' });
      localStorage.setItem(key, JSON.stringify(cart));
      window.dispatchEvent(new Event('cart:updated'));
    } catch {}
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }, [query, all]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const copyOffer = async (code: string) => {
    try { await navigator.clipboard.writeText(code); } catch {}
  };

  const handleWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent('Hi, I want to order medicines.')}`, '_blank');
  const handleCall = () => { window.location.href = 'tel:+911234567890'; };
  const handleUploadClick = () => fileRef.current?.click();
  const handleUploadChange = () => alert('Prescription uploaded');

  return (
    <div className="bg-white">

      {/* ── page header ─────────────────────────────────────── */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="border-t border-gray-100 pt-8 mb-12">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">Online Pharmacy</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none">
              Medicines,<br className="md:hidden" /> delivered.
            </h1>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed md:text-right">
              Genuine medicines at great prices.<br />Free home delivery on select orders.
            </p>
          </div>
        </div>
      </div>

      {/* ── search + actions + offers ────────────────────────── */}
      <div className="border-t border-b border-gray-100 py-8 mb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16">

            {/* search */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search medicines or brands…"
                  className="w-full pl-7 pr-4 py-2.5 border-b border-gray-200 bg-transparent text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* quick actions */}
              <div>
                <SectionLabel>Quick actions</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Order on WhatsApp', fn: handleWhatsApp },
                    { label: 'Upload prescription', fn: handleUploadClick },
                    { label: 'Call to order', fn: handleCall },
                  ].map(({ label, fn }) => (
                    <button
                      key={label}
                      onClick={fn}
                      style={{ borderRadius: '0.25rem' }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold border border-gray-200 px-3 py-2 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      {label} <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                  <input ref={fileRef} type="file" className="hidden" onChange={handleUploadChange} accept="image/*,.pdf" />
                </div>
              </div>
            </div>

            {/* offers */}
            <div className="min-w-[260px]">
              <SectionLabel>Exclusive offers</SectionLabel>
              <div className="space-y-3">
                <OfferChip tag="New user" desc="Flat 25% off on first order over ₹1,000" code="FIRST25" onCopy={() => copyOffer('FIRST25')} />
                <OfferChip tag="Health" desc="15% off + 5% cashback on all orders" code="HEALTH15" onCopy={() => copyOffer('HEALTH15')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── product grid ─────────────────────────────────────── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20">
        <div className="flex items-center justify-between mb-8">
          <SectionLabel>Popular medicines</SectionLabel>
          <div className="flex gap-2">
            {['Category', 'Brand', 'Sort by'].map(label => (
              <button
                key={label}
                style={{ borderRadius: '0.25rem' }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold border border-gray-200 px-3 py-1.5 text-gray-500 hover:border-gray-400 transition-colors"
              >
                {label} <ChevronDown className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visible.map(product => (
            <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} onAdd={addToCart} />
          ))}
        </div>

        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* ── testimonials ─────────────────────────────────────── */}
      <div className="border-t border-gray-100 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
            <div>
              <SectionLabel>Reviews</SectionLabel>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                What our<br />customers say.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {PHARMACY_TESTIMONIALS.map(t => (
                <TestimonialRow key={t.name} testimonial={t} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── faq ──────────────────────────────────────────────── */}
      <FAQ faqs={PHARMACY_FAQS} />
    </div>
  );
};

export default Medicines;