import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetailModal, { Product } from '../components/ProductDetailModal';
import { ProductService } from '../lib/api_controller';
import useRazorpay from '../hooks/useRazorpay';
import { X, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Order } from '../types';

/* ── Spinner ──────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
  </div>
);

/* ── Product Card ─────────────────────────────────────────── */
const ProductCard: React.FC<{
  product: Product;
  index: number;
  onView: () => void;
  onSample: () => void;
  onSubscribe: () => void;
}> = ({ product, index, onView, onSample, onSubscribe }) => (
  <div className="group flex flex-col border-b border-gray-100 py-8 first:pt-0 md:border-b-0 md:py-0">
    {/* image */}
    <div
      className="overflow-hidden bg-gray-50 aspect-[4/3] mb-5 cursor-pointer"
      onClick={onView}
    >
      <img
        src={product.images?.[0] ?? '/images/placeholder.png'}
        alt={product.name}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
      />
    </div>

    {/* index + category */}
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs tabular-nums text-gray-300">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
        {product.category}
      </span>
    </div>

    {/* name */}
    <h3
      className="text-base font-bold text-gray-900 mb-1 cursor-pointer hover:text-primary transition-colors duration-200 leading-snug"
      onClick={onView}
    >
      {product.name}
    </h3>

    {/* description */}
    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-5">
      {product.description}
    </p>

    {/* pricing + actions */}
    <div className="mt-auto space-y-2">
      <button
        onClick={onSample}
        style={{ borderRadius: '0.25rem' }}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors duration-200"
      >
        <span>Sample — ₹90</span>
        <span className="text-xs text-gray-400 line-through">MRP ₹190</span>
      </button>
      <button
        onClick={onSubscribe}
        style={{ borderRadius: '0.25rem' }}
        className="w-full flex items-center justify-between px-4 py-3 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors duration-200"
      >
        <span>Subscribe</span>
        <span>₹1,500 / yr</span>
      </button>
    </div>
  </div>
);

/* ── Subscription Modal ───────────────────────────────────── */
const SubscriptionModal: React.FC<{
  formFilled: boolean;
  setFormFilled: (v: boolean) => void;
  onPay: () => void;
  onClose: () => void;
  razorpayReady: boolean;
}> = ({ formFilled, setFormFilled, onPay, onClose, razorpayReady }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40">
    <div className="bg-white w-full max-w-md" style={{ borderRadius: '0.25rem' }}>

      {/* header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Premium Subscription</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* step 1 */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
            01 — Review Form
          </p>
          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
            Fill out the mandatory review form before proceeding to payment.
          </p>
          <a
            href="https://forms.gle/PUGyMy8k5QNL6AA89"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity"
          >
            Open form <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="border-t border-gray-100" />

        {/* step 2 */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
            02 — Confirm & Pay
          </p>

          <label className="flex items-start gap-3 cursor-pointer mb-5">
            <div
              className={`w-4 h-4 mt-0.5 flex-shrink-0 border flex items-center justify-center transition-colors ${
                formFilled ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
              style={{ borderRadius: '0.125rem' }}
            >
              {formFilled && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={formFilled}
              onChange={e => setFormFilled(e.target.checked)}
            />
            <span className="text-xs text-gray-500 leading-relaxed select-none">
              I confirm I have submitted the review form.
            </span>
          </label>

          <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-5">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Total</span>
            <span className="text-xl font-bold text-gray-900">₹1,500</span>
          </div>

          <button
            onClick={onPay}
            disabled={!formFilled || !razorpayReady}
            style={{ borderRadius: '0.25rem' }}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors duration-200"
          >
            Pay ₹1,500 & Subscribe
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ── Toast ────────────────────────────────────────────────── */
const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{ borderRadius: '0.25rem' }}
    className="fixed top-24 right-4 bg-gray-900 text-white text-sm font-medium px-5 py-3 z-50 shadow-lg"
  >
    {message}
  </div>
);

/* ── Page ─────────────────────────────────────────────────── */
const OurProductsPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [notification, setNotification] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const isRazorpayLoaded = useRazorpay();
  const { user } = useAuth();
  const navigate = useNavigate();

  const dummyRefs = {
    home: { current: null }, product: { current: null },
    about: { current: null }, contact: { current: null },
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('patient_cart');
      if (stored) setCart(JSON.parse(stored));
    } catch {}

    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        const fetched = Array.isArray(response.data)
          ? response.data
          : (response.data.products || response.data.data || []);
        setProducts(fetched);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const notify = (msg: string, then?: () => void, delay = 1200) => {
    setNotification(msg);
    setTimeout(() => { setNotification(''); then?.(); }, delay);
  };

  const addToCart = (product: Product) => {
    if (!user) {
      notify('Please login to get samples', () => navigate('/login', { state: { from: '/our-products' } }));
      return;
    }
    const current = JSON.parse(localStorage.getItem('patient_cart') || '[]');
    const updated = [...current, { ...product, price: 90, mrp: 190, freeShipping: true }];
    localStorage.setItem('patient_cart', JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event('cart:updated'));
    notify('Sample added!', () => navigate('/cart'));
  };

  const handleSubscription = () => {
    if (!user) {
      notify('Please login to subscribe', () => navigate('/login', { state: { from: '/our-products' } }));
      return;
    }
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    if (existing.length === 0) {
      alert('Please purchase a product first to unlock subscription.');
      return;
    }
    setShowSubscriptionModal(true);
  };

  const createSubscriptionOrder = (paymentId: string) => {
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    const subs = existing.filter((o: any) => o.id.startsWith('SUB'));
    const nextNum = subs.length > 0
      ? Math.max(...subs.map((o: any) => parseInt(o.id.substring(3)) || 0)) + 1
      : 1;
    const orderId = `SUB${String(nextNum).padStart(4, '0')}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: [{ name: 'Drepto Premium Subscription', price: 1500, quantity: 1, image: '/images/logo.png', shippingSource: 'Digital' }],
      total: 1500,
      status: 'Active',
      shippingAddress: { houseNo: 'N/A', buildingName: 'N/A', street: 'Digital Subscription', landmark: 'N/A', city: 'N/A', state: 'N/A', country: 'N/A', pincode: '000000', contactNumber: user?.mobileNumber || '' },
      trackingId: `SUB-${Math.floor(Math.random() * 1000000)}`,
      estimatedDelivery: 'Instant Activation',
      shippingMethod: 'Digital',
      shippingCost: 0,
      gst: 0,
    };

    localStorage.setItem('orders', JSON.stringify([newOrder, ...existing]));
    setShowSubscriptionModal(false);
    setFormFilled(false);
    notify('Subscription activated!', () => navigate(`/invoice/${orderId}`));
  };

  const handleSubscriptionPayment = () => {
    if (!isRazorpayLoaded) { alert('Payment gateway loading, please wait…'); return; }
    const rzp = new (window as any).Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 150000,
      currency: 'INR',
      name: 'Drepto Biodevices',
      description: 'Premium Subscription',
      handler: (response: any) => createSubscriptionOrder(response.razorpay_payment_id),
      prefill: { name: `${user?.firstName} ${user?.lastName}`, email: user?.email, contact: user?.mobileNumber },
      theme: { color: '#0D9488' },
    });
    rzp.on('payment.failed', (r: any) => alert('Payment failed: ' + r.error.description));
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead
        title="Our Products — Drepto Biodevices"
        description="Explore Drepto's transdermal drug delivery products. Get samples at handling charges or subscribe for premium access."
        keywords="drepto products, transdermal, drug delivery, rheumatoid arthritis, medical devices"
        url="/our-products"
      />

      <Navbar sectionRefs={dummyRefs as any} />

      <main className="flex-grow pb-24">
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="py-4">
            <Breadcrumbs items={[{ label: 'Our Products' }]} />
          </div>

          {/* page header */}
          <div className="border-t border-gray-100 pt-8 mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Products</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-none">
                Our Products.
              </h1>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed md:text-right">
                Sample any product for just ₹90 handling charges.
                Subscribe for full annual access at ₹1,500.
              </p>
            </div>
          </div>

          {notification && <Toast message={notification} />}

          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {products.map((product, i) => (
                <ProductCard
                  key={i}
                  product={product}
                  index={i}
                  onView={() => setSelectedProduct(product)}
                  onSample={() => addToCart(product)}
                  onSubscribe={handleSubscription}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {showSubscriptionModal && (
        <SubscriptionModal
          formFilled={formFilled}
          setFormFilled={setFormFilled}
          onPay={handleSubscriptionPayment}
          onClose={() => { setShowSubscriptionModal(false); setFormFilled(false); }}
          razorpayReady={isRazorpayLoaded}
        />
      )}
    </div>
  );
};

export default OurProductsPage;