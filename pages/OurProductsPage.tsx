import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Product, Order } from '../types';
import { ProductService, OrderService, PaymentService } from '../lib/api_controller';
import useRazorpay from '../hooks/useRazorpay';
import { X, CheckCircle, Package, ExternalLink, Trash2, Plus, Minus } from 'lucide-react';
import VideoTestimonialsSection from '../components/VideoTestimonialsSection';
import { resolveItemOffer, getAutoFreeUnitsToAdd } from '../lib/offerCalculator';


const OurProductsPage: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [notification, setNotification] = useState('');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscription Modal State
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [formFilled, setFormFilled] = useState(false);
    const isRazorpayLoaded = useRazorpay();

    const { user, setAuthModalView } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const updateCart = () => {
            try {
                const stored = localStorage.getItem('patient_cart');
                if (stored) setCart(JSON.parse(stored));
                else setCart([]);
            } catch { }
        };
        updateCart();
        window.addEventListener('cart:updated', updateCart);
        return () => window.removeEventListener('cart:updated', updateCart);
    }, []);

    const getProductCountInCart = (productName: string) => {
        return cart.filter((item: any) => item.name === productName).length;
    };

    const decrementCart = (productName: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        const targetProduct = products.find(p => p.name === productName);
        const offer = targetProduct ? resolveItemOffer(targetProduct) : null;
        let countToRemove = 1;
        if (offer && offer.type === 'BOGO') {
            const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
            const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
            const bundle = buyQty + freeQty;
            const currentQty = currentCart.filter((item: any) => item.name === productName).length;
            if (currentQty % bundle === 0) {
                countToRemove = bundle;
            } else {
                countToRemove = currentQty % bundle;
            }
        }

        for (let i = 0; i < countToRemove; i++) {
            const index = currentCart.findLastIndex((item: any) => item.name === productName);
            if (index !== -1) {
                currentCart.splice(index, 1);
            }
        }
        localStorage.setItem('patient_cart', JSON.stringify(currentCart));
        setCart(currentCart);
        window.dispatchEvent(new Event('cart:updated'));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                // Ensure response data matches Product interface or map it
                // API response is likely in response.data or response.data.data
                // Assuming response.data is the array based on typical usage, but adapting if nested
                const fetchedProducts = Array.isArray(response.data) ? response.data :
                    (response.data.products || response.data.data || []);

                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const addToCart = (product: Product) => {
        if (!user) {
            setAuthModalView('login');
            return;
        }

        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        const currentQty = currentCart.filter((item: any) => item.name === product.name).length;
        const autoFree = getAutoFreeUnitsToAdd(product, currentQty, 1);
        const toAdd = Array.from({ length: 1 + autoFree }, (_, i) => ({
            ...product,
            isFreeProduct: i >= 1
        }));
        const updatedCart = [...currentCart, ...toAdd];
        localStorage.setItem('patient_cart', JSON.stringify(updatedCart));
        setCart(updatedCart);

        // Dispatch event to update Navbar count
        window.dispatchEvent(new Event('cart:updated'));

        if (autoFree > 0) {
            setNotification(`Added to cart + ${autoFree} FREE product auto-added! 🎁`);
        } else {
            setNotification('Added to cart!');
        }
        setTimeout(() => {
            setNotification('');
        }, 1500);
    };

    const buyNow = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            setAuthModalView('login');
            return;
        }

        if (getProductCountInCart(product.name) === 0) {
            const offer = resolveItemOffer(product);
            const buyQty = (offer && offer.type === 'BOGO') ? Math.max(1, Number(offer.buyQuantity) || 2) : 1;
            const freeQty = (offer && offer.type === 'BOGO') ? Math.max(1, Number(offer.getFreeQuantity) || 1) : 0;
            const totalToAdd = buyQty + freeQty;

            const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
            const toAdd = Array.from({ length: totalToAdd }, (_, i) => ({
                ...product,
                isFreeProduct: i >= buyQty
            }));
            const updatedCart = [...currentCart, ...toAdd];
            localStorage.setItem('patient_cart', JSON.stringify(updatedCart));
            setCart(updatedCart);
            window.dispatchEvent(new Event('cart:updated'));
        }
        navigate('/cart');
    };

    const handleSubscription = () => {
        if (!user) {
            setNotification('Please login to subscribe');
            setTimeout(() => {
                setNotification('');
                navigate('/auth', { state: { from: '/our-products' } });
            }, 1500);
            return;
        }

        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        if (existingOrders.length === 0) {
            alert("This subscription option is only open after you buy something. Please purchase a product first to unlock this.");
            return;
        }

        setShowSubscriptionModal(true);
    };

    const createSubscriptionOrder = (paymentId: string) => {
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');

        // Generate ID
        let nextIdNumber = 1;
        const dbOrders = existingOrders.filter((o: any) => o.id.startsWith('SUB'));
        if (dbOrders.length > 0) {
            const maxId = Math.max(...dbOrders.map((o: any) => parseInt(o.id.substring(3)) || 0));
            nextIdNumber = maxId + 1;
        }
        const orderId = `SUB${nextIdNumber.toString().padStart(4, '0')}`;

        const newOrder: Order = {
            id: orderId,
            userEmail: user?.email,
            date: new Date().toISOString(),
            items: [{
                name: "Drepto Premium Subscription",
                price: 1500,
                quantity: 1,
                image: "/images/logo.png", // specific placeholder for subscription
                shippingSource: "Digital"
            }],
            total: 1500,
            status: 'Active',
            shippingAddress: { // Mock address or fetch from user profile if available
                houseNo: "N/A",
                buildingName: "N/A",
                street: "Digital Subscription",
                landmark: "N/A",
                city: "N/A",
                state: "N/A",
                country: "N/A",
                pincode: "000000",
                contactNumber: user?.mobileNumber || ""
            },
            trackingId: `SUB-${Math.floor(Math.random() * 1000000)}`,
            estimatedDelivery: "Instant Activation",
            shippingMethod: "Digital",
            shippingCost: 0,
            gst: 0
        };

        // --- API INTEGRATION ---
        const saveSubscriptionToBackend = async () => {
            try {
                await OrderService.create(newOrder);
                console.log("Subscription saved to Backend successfully");
            } catch (err) {
                console.error("Failed to save subscription to Backend:", err);
            }
            
            try {
                await PaymentService.createOrder({
                    orderId: orderId,
                    transactionId: paymentId || `SUB_${Date.now()}`,
                    amount: 1500,
                    currency: 'INR',
                    shippingAddress: newOrder.shippingAddress,
                    items: newOrder.items,
                    shippingMethod: 'Digital',
                    shippingCost: 0,
                    userId: user?.id || 'guest'
                });
                console.log("Subscription Payment saved successfully");
            } catch (err) {
                console.error("Failed to save subscription payment:", err);
            }
        };
        saveSubscriptionToBackend();
        
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
        // -----------------------------
        // -----------------------------

        setNotification('Subscription Activated Successfully!');
        setShowSubscriptionModal(false);
        setFormFilled(false);

        setTimeout(() => {
            setNotification('');
            navigate(`/invoice/${orderId}`);
        }, 2000);
    };

    const handleSubscriptionPayment = () => {
        if (!isRazorpayLoaded) {
            alert("Payment gateway is loading, please wait...");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: 1500 * 100, // 1500 INR in paise
            currency: "INR",
            name: "Drepto Biodevices",
            description: "Premium Subscription",
            image: "https://drepto.com/logo.png",
            handler: function (response: any) {
                console.log("Subscription Payment Successful:", response);
                createSubscriptionOrder(response.razorpay_payment_id);
            },
            prefill: {
                name: `${user?.firstName} ${user?.lastName}` || "User",
                email: user?.email || "user@example.com",
                contact: user?.mobileNumber || ""
            },
            theme: {
                color: "#c01226"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            alert("Payment Failed: " + response.error.description);
        });
        rzp.open();
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* ── Luminous Healthcare Hero Banner ── */}
                <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f1f3f6] border-b border-slate-200/80 mb-10 sm:mb-14">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-10 left-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-2xs">
                            <Package className="w-4 h-4 text-[#c01226]" />
                            <span>OUR PRODUCTS &amp; THERAPEUTIC FORMULATIONS</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6 font-display">
                            Targeted Bio-Delivery for{' '}
                            <span className="text-[#c01226]">
                                Women &amp; Beyond
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                            Explore our clinically validated transdermal patches and non-invasive healthcare formulations engineered at SINE, IIT Bombay.
                        </p>
                    </div>
                </section>

                <div className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-16">

                {notification && (
                    <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce-in">
                        {notification}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c01226]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <div key={index} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 flex flex-col">
                                <div
                                    className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                        {product.category}
                                    </span>

                                    {/* Overlay with view details button */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    {(product.quantity || product.form || (product.packOf && product.packOf > 1)) && (
                                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                            {product.quantity && (
                                                <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                                                    {product.quantity}
                                                </span>
                                            )}
                                            {product.form && (
                                                <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                                                    {product.form}
                                                </span>
                                            )}
                                            {product.packOf && product.packOf > 1 && (
                                                <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                                                    Pack of {product.packOf}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <h3
                                        className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#c01226] transition-colors"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <div className="flex flex-col items-start w-full mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-black text-gray-900">
                                                        ₹{product.price || 0}
                                                    </span>
                                                    {product.mrp && product.mrp > (product.price || 0) && (
                                                        <span className="text-sm text-gray-400 line-through font-medium">
                                                            ₹{product.mrp}
                                                        </span>
                                                    )}
                                                </div>
                                                {product.mrp && product.mrp > (product.price || 0) && (
                                                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide mt-1">
                                                        Save {Math.round(((product.mrp - (product.price || 0)) / product.mrp) * 100)}%
                                                    </span>
                                                )}
                                                {/* Dynamic Offer Badge (Design 2: Mint pill with Tag icon) */}
                                                {(product.offer?.isActive !== false && (product.offer?.title || product.offerDescription)) && (
                                                    <span className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold tracking-wide px-3 py-0.5 rounded-full shadow-2xs">
                                                        <svg className="w-3 h-3 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                                        {product.offer?.title || product.offerDescription || 'Buy 2 Get 1 Free'}
                                                    </span>
                                                )}
                                            </div>

                                            {getProductCountInCart(product.name) > 0 ? (
                                                <>
                                                    <div className="w-full flex items-center justify-between border-2 border-yellow-400 rounded-full h-[44px] overflow-hidden bg-white mb-1.5 shadow-sm">
                                                        <button 
                                                            onClick={(e) => decrementCart(product.name, e)}
                                                            className="h-full px-4 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-300 text-gray-700 hover:text-red-600"
                                                        >
                                                            {getProductCountInCart(product.name) === 1 ? (
                                                                <Trash2 className="w-5 h-5" />
                                                            ) : (
                                                                <Minus className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <span className="font-bold text-gray-900 text-sm flex-1 text-center">
                                                            {(() => {
                                                                const qty = getProductCountInCart(product.name);
                                                                const paid = Math.ceil(qty / 2);
                                                                const free = Math.floor(qty / 2);
                                                                return free > 0
                                                                    ? `${paid} buying + ${free} FREE 🎁`
                                                                    : `${qty} in cart`;
                                                            })()}
                                                        </span>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                            className="h-full px-4 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-gray-300 text-gray-700"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    {(() => {
                                                        const qty = getProductCountInCart(product.name);
                                                        const offer = resolveItemOffer(product);
                                                        if (!offer || offer.type !== 'BOGO') return null;
                                                        const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
                                                        const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
                                                        const bundle = buyQty + freeQty;
                                                        const free = Math.floor(qty / bundle) * freeQty;
                                                        if (free > 0) {
                                                            return (
                                                                <p className="text-[10px] text-center text-emerald-600 font-semibold mb-2">
                                                                    🎁 {free} FREE unit{free > 1 ? 's' : ''} auto-added!
                                                                </p>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                    className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 mb-2"
                                                >
                                                    Add to Cart
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={(e) => buyNow(product, e)}
                                                className="w-full py-2.5 px-4 bg-[#c01226] hover:bg-red-700 shadow-md font-bold text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                {(() => {
                                                    const qty = getProductCountInCart(product.name);
                                                    const offer = resolveItemOffer(product);
                                                    const buyQty = (offer && offer.type === 'BOGO') ? Math.max(1, Number(offer.buyQuantity) || 2) : 2;
                                                    const freeQty = (offer && offer.type === 'BOGO') ? Math.max(1, Number(offer.getFreeQuantity) || 1) : 1;
                                                    const bundle = buyQty + freeQty;
                                                    const free = Math.floor(qty / bundle) * freeQty;
                                                    const paid = qty - free;
                                                    return free > 0
                                                        ? `Buy ${paid} → Got ${free} FREE 🎁`
                                                        : qty > 0 ? `In Cart (${qty}) · Proceed to Checkout` : (offer?.type === 'BOGO' ? `Buy ${buyQty} Get ${freeQty} Free (Auto-Added)` : 'Buy Now');
                                                })()}
                                            </button>
                                        </div>
                                        {/* <button
                                            onClick={() => addToCart(product)}
                                            className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-[#c01226] transition-colors shadow-md group-active:scale-95 flex items-center gap-2 font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                                            Add
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Video Reviews / Testimonials */}
                <div className="mt-16">
                    <VideoTestimonialsSection />
                </div>
            </div>
            </main>

            <Footer />


            {/* Subscription Modal */}
            {showSubscriptionModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-gray-900">Get Premium Subscription</h3>
                            <button
                                onClick={() => setShowSubscriptionModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-1">Step 1: Review Form</h4>
                                <p className="text-sm text-blue-600 mb-3">Please fill out the mandatory review form to proceed.</p>
                                <a
                                    href="https://forms.gle/PUGyMy8k5QNL6AA89"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 underline"
                                >
                                    Open Google Form <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-800">Step 2: Payment</h4>
                                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors ${formFilled ? 'bg-[#c01226] border-[#c01226] text-white' : 'border-gray-300 bg-white'}`}>
                                        {formFilled && <CheckCircle className="w-3.5 h-3.5" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formFilled}
                                        onChange={(e) => setFormFilled(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600 select-none">
                                        I confirm that I have filled and submitted the review form.
                                    </span>
                                </label>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">₹1500</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubscriptionPayment}
                                disabled={!formFilled || !isRazorpayLoaded}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${formFilled ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-teal-500/25' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Pay ₹1500 & Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OurProductsPage;
