import React, { useState } from 'react';
import { Medicine, ProductFAQ } from '../../types';
import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react';

interface MedicineDetailProps {
  medicine: Medicine;
  onBack: () => void;
}

/* ── section label ────────────────────────────────────────── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">{children}</p>
);

/* ── key-value table row ──────────────────────────────────── */
const KVRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-6 py-3 border-b border-gray-100 last:border-0">
    <span className="text-xs font-semibold text-gray-400 flex-shrink-0">{label}</span>
    <span className="text-xs text-gray-700 text-right">{value}</span>
  </div>
);

/* ── info block ───────────────────────────────────────────── */
const InfoBlock: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
  <div id={id} className="scroll-mt-24 border-t border-gray-100 pt-6 pb-2">
    <SectionLabel>{title}</SectionLabel>
    <div className="text-sm text-gray-600 leading-relaxed space-y-1.5">{children}</div>
  </div>
);

/* ── list ─────────────────────────────────────────────────── */
const Ul: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map(item => (
      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
        <span className="w-1 h-1 mt-1.5 flex-shrink-0 bg-primary" />
        {item}
      </li>
    ))}
  </ul>
);

/* ── faq accordion ────────────────────────────────────────── */
const ProductFAQSection: React.FC<{ faqs: ProductFAQ[] }> = ({ faqs }) => {
  const [open, setOpen] = useState<number | null>(null);
  if (!faqs?.length) return null;

  return (
    <InfoBlock title="Frequently Asked Questions" id="product-faqs">
      <div className="space-y-0 divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center py-3.5 text-left"
            >
              <span className="text-sm font-semibold text-gray-800 pr-4">{faq.question}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${open === i ? 'max-h-64 pb-3' : 'max-h-0'}`}>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </InfoBlock>
  );
};

/* ── main ─────────────────────────────────────────────────── */
const MedicineDetail: React.FC<MedicineDetailProps> = ({ medicine, onBack }) => {
  const [mainImage, setMainImage] = useState(medicine.imageUrl);
  const [added, setAdded] = useState(false);

  const discount = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);

  const handleAddToCart = () => {
    try {
      const key = 'patient_cart';
      const cart = JSON.parse(localStorage.getItem(key) || '[]');
      cart.push({ id: medicine.id, name: medicine.name, price: String(medicine.price), image: medicine.imageUrl || '' });
      localStorage.setItem(key, JSON.stringify(cart));
      window.dispatchEvent(new Event('cart:updated'));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {}
  };

  return (
    <div className="container mx-auto px-6 max-w-6xl py-8">

      {/* back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-10"
      >
        <ArrowLeft className="w-3 h-3" /> Back to medicines
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

        {/* ── left: image + buy ──────────────────────────────── */}
        <div className="lg:sticky lg:top-28 self-start">

          {/* main image */}
          <div className="bg-gray-50 aspect-square flex items-center justify-center p-8 mb-4 overflow-hidden" style={{ borderRadius: '0.25rem' }}>
            <img src={mainImage} alt={medicine.name} className="w-full h-full object-contain" />
          </div>

          {/* thumbnail strip */}
          {medicine.images?.length > 0 && (
            <div className="flex gap-2 mb-6">
              {medicine.images.map(img => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  style={{ borderRadius: '0.25rem' }}
                  className={`w-14 h-14 border p-1 overflow-hidden transition-colors ${mainImage === img ? 'border-primary' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* brand + name */}
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">{medicine.brand}</p>
          <h1 className="text-lg font-bold text-gray-900 leading-snug mb-4">{medicine.name}</h1>

          {/* pricing */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-bold text-gray-900">₹{medicine.price}</span>
            <span className="text-sm text-gray-400 line-through">₹{medicine.mrp}</span>
            {discount > 0 && <span className="text-xs font-bold text-green-600">{discount}% off</span>}
          </div>

          {/* add to cart */}
          <button
            onClick={handleAddToCart}
            style={{ borderRadius: '0.25rem' }}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            {added ? (
              <>Added <Check className="w-4 h-4" /></>
            ) : (
              <>Add to cart <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* ── right: details ─────────────────────────────────── */}
        <div>

          {/* description */}
          <div className="border-t border-gray-100 pt-6 pb-6 mb-2">
            <SectionLabel>About this medicine</SectionLabel>
            <p className="text-sm text-gray-600 leading-relaxed">{medicine.description}</p>
          </div>

          {/* product summary table */}
          <div className="mb-2">
            <SectionLabel>Product summary</SectionLabel>
            <div>
              <KVRow label="Contains"    value={<span className="font-semibold text-primary">{medicine.contains}</span>} />
              <KVRow label="Uses"        value={medicine.uses.join(', ')} />
              <KVRow label="Side effects" value={medicine.sideEffects.join(', ')} />
              <KVRow label="Therapy"     value={medicine.therapy} />
            </div>
          </div>

          <InfoBlock title={`Uses of ${medicine.name}`} id="uses">
            <Ul items={medicine.uses} />
          </InfoBlock>

          <InfoBlock title="Contraindications" id="contraindications">
            <Ul items={medicine.contraindications} />
          </InfoBlock>

          <InfoBlock title="Side effects" id="side-effects">
            <Ul items={medicine.sideEffects} />
          </InfoBlock>

          <InfoBlock title="Precautions & warnings" id="precautions">
            <div className="space-y-3">
              {medicine.precautions.map(p => (
                <div key={p.title} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-xs font-bold text-gray-800 mb-0.5">{p.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.advice}</p>
                </div>
              ))}
            </div>
          </InfoBlock>

          <InfoBlock title="How to use" id="how-to-use">
            <p>{medicine.howToUse}</p>
          </InfoBlock>

          <InfoBlock title="Storage & disposal" id="storage">
            <p>{medicine.storage}</p>
          </InfoBlock>

          <InfoBlock title="Quick tips" id="quick-tips">
            <Ul items={medicine.quickTips} />
          </InfoBlock>

          <InfoBlock title="Dosage" id="dosage">
            <p className="font-semibold text-gray-800 text-xs mb-1">Overdose</p>
            <p className="mb-4">{medicine.dosage.overdose}</p>
            <p className="font-semibold text-gray-800 text-xs mb-1">Missed dose</p>
            <p>{medicine.dosage.missedDose}</p>
          </InfoBlock>

          <InfoBlock title="Mode of action" id="mode-of-action">
            <p>{medicine.modeOfAction}</p>
          </InfoBlock>

          <InfoBlock title="Interactions" id="interactions">
            <p>{medicine.interactions}</p>
          </InfoBlock>

          <ProductFAQSection faqs={medicine.productFaqs} />
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;