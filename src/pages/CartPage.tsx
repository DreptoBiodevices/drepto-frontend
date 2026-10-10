import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ShippingAddressForm from '../components/ShippingAddressForm';
import { Address, Order } from '../types';
import { Truck, X, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import useRazorpay from '../hooks/useRazorpay';
import { PaymentService, OrderService } from '../lib/api_controller';

type CheckoutStep = 'cart' | 'address' | 'payment';

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'cart',    label: 'Cart'     },
  { key: 'address', label: 'Shipping' },
  { key: 'payment', label: 'Payment'  },
];

/* ── Step progress bar ────────────────────────────────────── */
const StepBar: React.FC<{ current: CheckoutStep }> = ({ current }) => {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-0 mb-14">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-2">
            <span className={`text-xs tabular-nums font-semibold ${i <= idx ? 'text-gray-900' : 'text-gray-300'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`text-xs font-semibold tracking-widest uppercase ${i <= idx ? 'text-gray-900' : 'text-gray-300'}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-4 ${i < idx ? 'bg-gray-900' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ── Back link ────────────────────────────────────────────── */
const BackLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-6"
  >
    <ArrowLeft className="w-3 h-3" /> {label}
  </button>
);

/* ── Section label ────────────────────────────────────────── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">{children}</p>
);

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shippingMethod] = useState<'India Post'>('India Post');
  const [distance, setDistance] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(7);
  const isRazorpayLoaded = useRazorpay();

  const dummyRefs = {
    home: { current: null }, product: { current: null },
    about: { current: null }, contact: { current: null },
  };

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem('patient_cart');
        if (stored) setCart(JSON.parse(stored));
      } catch {}
    };
    load();
    window.addEventListener('cart:updated', load);
    return () => window.removeEventListener('cart:updated', load);
  }, []);

  useEffect(() => {
    if (shippingAddress?.pincode) {
      const pinVal = parseInt(shippingAddress.pincode.substring(0, 3) || '100');
      setDistance((pinVal % 9) * 150 + 50);
    }
  }, [shippingAddress]);

  useEffect(() => {
    const hasFree = cart.length > 0 && cart.every(i => i.freeShipping);
    const days = 5 + Math.floor(distance / 200);
    setShippingCost(hasFree ? 0 : 19);
    setEstimatedDays(days);
  }, [distance, cart]);

  const removeFromCart = (idx: number) => {
    const next = [...cart];
    next.splice(idx, 1);
    setCart(next);
    localStorage.setItem('patient_cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cart:updated'));
  };

  const subtotal = () => cart.reduce((sum, item) => {
    const p = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
    return sum + (isNaN(p) ? 0 : p);
  }, 0);

  const total = () => subtotal() + shippingCost;

  const handleProceedToCheckout = () => {
    if (!user) { navigate('/login', { state: { from: '/cart' } }); return; }
    setCheckoutStep('address');
  };

  const handleAddressSubmit = (address: Address) => {
    setShippingAddress(address);
    setCheckoutStep('payment');
  };

  const createOrder = async (rzpPaymentId: string) => {
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    const dbOrders = existing.filter((o: any) => o.id.startsWith('DB'));
    const nextNum = dbOrders.length > 0
      ? Math.max(...dbOrders.map((o: any) => parseInt(o.id.substring(2)) || 0)) + 1 : 1;
    const orderId = `DB${String(nextNum).padStart(4, '0')}`;

    const items = cart.map(item => ({
      name: item.name || item.title,
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, '')),
      quantity: 1,
      image: Array.isArray(item.images) ? item.images[0] : item.image,
      shippingSource: item.shippingSource,
    }));

    const newOrder: Order = {
      id: orderId, date: new Date().toISOString(), items,
      paymentId: rzpPaymentId, total: total(), status: 'Placed',
      shippingAddress: shippingAddress!,
      trackingId: `TRK-${Math.floor(Math.random() * 1000000)}`,
      estimatedDelivery: new Date(Date.now() + estimatedDays * 86400000).toDateString(),
      shippingMethod, shippingCost,
    };

    localStorage.setItem('orders', JSON.stringify([newOrder, ...existing]));

    try {
        await OrderService.create({
            ...newOrder,
            userEmail: user?.email || '',
        });
        console.log("Order saved to database successfully via OrderService!");
    } catch (err) {
        console.error("Failed to save order to database:", err);
    }

    try {
        await PaymentService.createOrder({
            orderId: orderId,
            transactionId: rzpPaymentId || `TXN_${Date.now()}`,
            amount: newOrder.total,
            currency: 'INR',
            shippingAddress: newOrder.shippingAddress,
            items: newOrder.items,
            shippingMethod: shippingMethod,
            shippingCost: shippingCost,
            userId: user?.id || 'guest'
        });
        console.log("Payment saved to database successfully via PaymentService!");
    } catch (err) {
        console.error("Failed to save payment to database:", err);
    }

    setCart([]);
    localStorage.removeItem('patient_cart');
    window.dispatchEvent(new Event('cart:updated'));
    setSuccess(true);
    setTimeout(() => { setSuccess(false); navigate(`/invoice/${orderId}`); }, 2000);
  };

  const handlePayment = async () => {
    if (!shippingAddress || !user || !isRazorpayLoaded) return;
    setProcessing(true);
    try {
      const rzp = new (window as any).Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(total() * 100),
        currency: 'INR',
        name: 'Drepto Biodevices',
        description: 'Medical Products Purchase',
        handler: (r: any) => createOrder(r.razorpay_payment_id),
        prefill: { name: `${user.firstName} ${user.lastName}`, email: user.email, contact: String(user.mobileNumber || '') },
        theme: { color: '#0D9488' },
      });
      rzp.on('payment.failed', (r: any) => { alert('Payment failed: ' + r.error.description); setProcessing(false); });
      rzp.open();
    } catch {
      alert('Failed to open payment. Try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar sectionRefs={dummyRefs as any} />

      <main className="flex-grow pb-24">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* page header */}
          <div className="border-t border-gray-100 pt-8 mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Checkout</p>
            <h1 className="text-4xl font-bold text-gray-900 leading-none">
              {checkoutStep === 'cart' ? 'Your Cart' : checkoutStep === 'address' ? 'Shipping' : 'Payment'}
            </h1>
          </div>

          {/* step bar — only when cart has items */}
          {cart.length > 0 && <StepBar current={checkoutStep} />}

          {/* ── Empty state ───────────────────────── */}
          {cart.length === 0 && !success && (
            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200">
              <Truck className="w-8 h-8 text-gray-300 mb-4" />
              <p className="text-sm text-gray-500 mb-4">Your cart is empty.</p>
              <button
                onClick={() => navigate('/our-products')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity"
              >
                Browse Products <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* ── Cart step ─────────────────────────── */}
          {checkoutStep === 'cart' && cart.length > 0 && (
            <div className="grid md:grid-cols-[1fr_280px] gap-12">

              {/* item list */}
              <div className="divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5 py-5 first:pt-0">
                    <div className="w-16 h-16 bg-gray-50 overflow-hidden flex-shrink-0">
                      <img
                        src={Array.isArray(item.images) ? item.images[0] : item.image}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name || item.title}</p>
                      <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                      {item.shippingSource && (
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                          Ships from {item.shippingSource}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ₹{typeof item.price === 'number' ? item.price : item.price.replace('$', '')}
                    </p>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* order summary */}
              <div className="border-l border-gray-100 pl-10 sticky top-28 self-start">
                <SectionLabel>Summary</SectionLabel>
                <div className="divide-y divide-gray-100">
                  <div className="flex justify-between py-2.5 text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-gray-400 italic text-xs">At next step</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm font-bold text-gray-900">
                    <span>Est. Total</span>
                    <span>₹{subtotal().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  style={{ borderRadius: '0.25rem' }}
                  className="w-full mt-6 flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Proceed to Shipping
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Address step ──────────────────────── */}
          {checkoutStep === 'address' && (
            <div className="max-w-xl">
              <SectionLabel>Delivery address</SectionLabel>
              <ShippingAddressForm
                onSubmit={handleAddressSubmit}
                initialAddress={shippingAddress || undefined}
              />
              <BackLink label="Back to Cart" onClick={() => setCheckoutStep('cart')} />
            </div>
          )}

          {/* ── Payment step ──────────────────────── */}
          {checkoutStep === 'payment' && (
            <div className="max-w-sm">
              {success ? (
                <div className="flex flex-col items-center py-20">
                  <Check className="w-10 h-10 text-primary mb-4" />
                  <p className="text-base font-bold text-gray-900 mb-1">Order placed.</p>
                  <p className="text-xs text-gray-400">Redirecting to your invoice…</p>
                </div>
              ) : (
                <>
                  {/* address recap */}
                  <SectionLabel>Shipping to</SectionLabel>
                  <div className="border-b border-gray-100 pb-5 mb-6">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {shippingAddress?.houseNo}, {shippingAddress?.street},<br />
                        {shippingAddress?.city} — {shippingAddress?.pincode}
                      </p>
                      <button
                        onClick={() => setCheckoutStep('address')}
                        className="text-[10px] font-semibold tracking-widest uppercase text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity ml-4 flex-shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* delivery method — India Post only */}
                  <SectionLabel>Delivery method</SectionLabel>
                  <div className="border border-primary bg-primary/5 px-4 py-3 mb-8 flex items-center justify-between" style={{ borderRadius: '0.25rem' }}>
                    <div>
                      <p className="text-sm font-bold text-gray-900">India Post</p>
                      <p className="text-xs text-gray-400">Est. {estimatedDays} business days</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                    </p>
                  </div>

                  {/* totals */}
                  <SectionLabel>Total</SectionLabel>
                  <div className="divide-y divide-gray-100 mb-6">
                    <div className="flex justify-between py-2.5 text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{subtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 text-sm text-gray-500">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between py-3 text-sm font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total().toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
                    Clicking "Pay now" opens the secure Razorpay gateway.
                  </p>

                  <button
                    onClick={handlePayment}
                    disabled={processing || !isRazorpayLoaded}
                    style={{ borderRadius: '0.25rem' }}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    {processing ? (
                      <>
                        <span>Processing…</span>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{total().toFixed(2)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <BackLink label="Back to Address" onClick={() => setCheckoutStep('address')} />
                </>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default CartPage;