
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ShippingAddressForm from '../components/ShippingAddressForm';
import { Address, Order } from '../types';
import { Truck, MapPin, CreditCard, X, Check } from 'lucide-react';
import useRazorpay from '../hooks/useRazorpay';
import { supabase } from '../lib/supabase';

type CheckoutStep = 'cart' | 'address' | 'payment';

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const { user, setAuthModalView } = useAuth();
    const navigate = useNavigate();
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [processing, setProcessing] = useState(false); // Can be removed later if unused
    const [success, setSuccess] = useState(false);

    const [shippingMethod, setShippingMethod] = useState<'India Post' | 'Speed Post'>('India Post');
    const [distance, setDistance] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [estimatedDays, setEstimatedDays] = useState<number>(7);

    // Load Razorpay script
    const isRazorpayLoaded = useRazorpay();

    useEffect(() => {
        const loadCart = () => {
            try {
                const stored = localStorage.getItem('patient_cart');
                if (stored) setCart(JSON.parse(stored));
            } catch { }
        };
        loadCart();
        window.addEventListener('cart:updated', loadCart);
        return () => window.removeEventListener('cart:updated', loadCart);
    }, []);

    // Mock distance calculation based on pincode
    useEffect(() => {
        if (shippingAddress?.pincode) {
            // Simple mock: take first 3 digits mod 10 * 100 + random base
            const pinVal = parseInt(shippingAddress.pincode.substring(0, 3) || "100");
            const mockDistance = (pinVal % 9) * 150 + 50; // Range: 50km - 1250km
            setDistance(mockDistance);
        }
    }, [shippingAddress]);

    // Recalculate shipping cost and time when method or distance changes
    useEffect(() => {
        let cost = 0;
        let days = 7;

        // Check if any item in cart has free shipping (Handling charge model)
        const hasFreeShipping = cart.length > 0 && cart.every(item => item.freeShipping);

        if (hasFreeShipping) {
            cost = 0;
            // Days calculation remains same
            if (shippingMethod === 'India Post') {
                days = 5 + Math.floor(distance / 200);
            } else {
                days = 2 + Math.floor(distance / 400);
            }
        } else if (shippingMethod === 'India Post') {
            // Updated pricing for 20g product: 19 to 30 range
            // cost = distance <= 200 ? 19 : 30;
            cost = 19;
            days = 5 + Math.floor(distance / 200); // Base 5 days + 1 day per 200km
        } else {
            cost = 90 + (distance * 0.25); // Base 90 + 0.25 per km
            days = 2 + Math.floor(distance / 400); // Faster: Base 2 days
        }

        setShippingCost(Math.round(cost));
        setEstimatedDays(days);
    }, [shippingMethod, distance]);

    const addOneToCart = (item: any) => {
        const newCart = [...cart, { ...item }];
        setCart(newCart);
        localStorage.setItem('patient_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart:updated'));
    };

    const removeOneFromCart = (name: string) => {
        const newCart = [...cart];
        const index = newCart.findIndex(item => (item.name || item.title) === name);
        if (index > -1) {
            newCart.splice(index, 1);
            setCart(newCart);
            localStorage.setItem('patient_cart', JSON.stringify(newCart));
            window.dispatchEvent(new Event('cart:updated'));
        }
    };

    const removeAllFromCart = (name: string) => {
        const newCart = cart.filter(item => (item.name || item.title) !== name);
        setCart(newCart);
        localStorage.setItem('patient_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart:updated'));
    };

    const groupedCart = (() => {
        const groups = new Map();
        cart.forEach((item) => {
            const key = item.name || item.title;
            if (groups.has(key)) {
                groups.get(key).quantity += 1;
            } else {
                groups.set(key, { ...item, quantity: 1 });
            }
        });
        return Array.from(groups.values());
    })();

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => {
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                : item.price;
            return total + (isNaN(price) ? 0 : price);
        }, 0);
    };

    // const gstRate = 0.18;
    // const calculateGST = () => (calculateSubtotal() + shippingCost) * gstRate;
    // const gstRate = 0.18;
    // const calculateGST = () => (calculateSubtotal() + shippingCost) * gstRate;
    // const calculateTotal = () => calculateSubtotal() + shippingCost + calculateGST();
    const calculateTotal = () => calculateSubtotal() + shippingCost;

    const handleProceedToCheckout = () => {
        if (!user) {
            setAuthModalView('login');
            return;
        }
        setCheckoutStep('address');
    };

    // Load Saved Address
    useEffect(() => {
        if (user && checkoutStep === 'address') {
            const fetchAddress = async () => {
                try {
                    // Assuming getById uses userId or we need a new endpoint for 'getMyAddress'
                    // If endpoint is /shipping-address/:id, we need a way to get address by user ID.
                    // If the backend returns user's address on GET /shipping-address/user/:userId
                    // For now, let's assume we can fetch it or it's part of user profile.
                    // If not readily available, we might need to rely on local state or ask user to enter.
                    // Let's try to fetch using user ID if supported, or skip if we don't know the ID.

                    // Note: based on api_controller, we have getById(id). 
                    // If we don't have an address ID stored in user profile, we can't fetch it directly 
                    // unless there's an endpoint like /shipping-address?userId=...
                    // For this implementation, we will proceed with saving the address.
                    // If the user object has an address, we can use it.

                } catch (error) {
                    console.error("Failed to fetch address", error);
                }
            };
            fetchAddress();
        }
    }, [user, checkoutStep]);

    const handleAddressSubmit = async (address: Address) => {
        setShippingAddress(address);
        // Address will be saved via the create-order endpoint
        setCheckoutStep('payment');
    };

    const createOrder = async (rzpPaymentId: string) => {
        // Create Order Object for localStorage (legacy/backup)
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');

        // Generate DBxxxx ID
        let nextIdNumber = 1;
        const dbOrders = existingOrders.filter((o: any) => o.id.startsWith('DB'));
        if (dbOrders.length > 0) {
            const maxId = Math.max(...dbOrders.map((o: any) => parseInt(o.id.substring(2)) || 0));
            nextIdNumber = maxId + 1;
        }
        const orderId = `DB${nextIdNumber.toString().padStart(4, '0')}`;

        const orderItems = cart.map(item => ({
            name: item.name || item.title,
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, '')),
            quantity: 1,
            image: Array.isArray(item.images) ? item.images[0] : item.image,
            shippingSource: item.shippingSource
        }));

        const newOrder: Order = {
            id: orderId,
            date: new Date().toISOString(),
            items: orderItems,
            paymentId: rzpPaymentId,
            total: calculateTotal(),
            status: 'Placed',
            shippingAddress: shippingAddress!,
            trackingId: `TRK-${Math.floor(Math.random() * 1000000)}`,
            estimatedDelivery: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000).toDateString(),
            shippingMethod: shippingMethod,
            shippingCost: shippingCost,
        };

        // Save to LocalStorage (Legacy/Backup)
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        // --- SAVE TO SUPABASE ---
        try {
            const { error } = await supabase
                .from('orders')
                .insert({
                    id: orderId,
                    user_id: user?.id || 'guest',
                    user_email: user?.email || '',
                    total_amount: newOrder.total,
                    status: 'Placed',
                    shipping_address: {
                        houseNo: shippingAddress!.houseNo,
                        street: shippingAddress!.street,
                        city: shippingAddress!.city,
                        state: shippingAddress!.state,
                        pincode: shippingAddress!.pincode,
                        country: 'India',
                        contactNumber: String(user?.mobileNumber || ''),
                        landmark: shippingAddress!.landmark || '',
                    },
                    items: orderItems,
                    payment_id: rzpPaymentId,
                    shipping_method: shippingMethod,
                    shipping_cost: shippingCost,
                    created_at: new Date().toISOString(),
                });

            if (error) {
                console.error("Supabase insert error:", error);
                alert("Order placed but failed to sync with database. Your order is saved locally.");
            } else {
                console.log("Order saved to Supabase successfully!");
            }
        } catch (err) {
            console.error("Failed to save order to Supabase:", err);
        }
        // -------------------------

        setCart([]);
        localStorage.removeItem('patient_cart');
        window.dispatchEvent(new Event('cart:updated'));

        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            navigate(`/invoice/${newOrder.id}`);
        }, 2000);
    };

    const handlePayment = async () => {
        if (!shippingAddress || !user) return;

        if (!isRazorpayLoaded) {
            alert("Payment gateway is loading, please wait...");
            return;
        }

        setProcessing(true);

        try {
            const totalAmount = calculateTotal();
            const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

            const options = {
                key: key,
                amount: Math.round(totalAmount * 100), // Razorpay expects amount in paise
                currency: "INR",
                name: "Drepto Biodevices",
                description: "Medical Products Purchase",
                image: "https://drepto.com/logo.png",
                handler: function (response: any) {
                    console.log("Payment Successful:", response);
                    createOrder(response.razorpay_payment_id);
                },
                prefill: {
                    name: `${user.firstName} ${user.lastName}` || "User",
                    email: user.email || "user@example.com",
                    contact: String(user.mobileNumber || "")
                },
                theme: {
                    color: "#0D9488"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
                console.error(response.error);
                setProcessing(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error("Error opening payment:", error);
            alert("Failed to initiate payment. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {checkoutStep === 'cart' ? 'Your Cart' : checkoutStep === 'address' ? 'Shipping Address' : 'Payment'}
                </h1>

                {/* Progress Indicators */}
                {cart.length > 0 && (
                    <div className="flex items-center justify-center mb-8 space-x-4">
                        <div className={`flex items-center gap-2 ${checkoutStep === 'cart' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
                            <span>Cart</span>
                        </div>
                        <div className="w-12 h-1 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${checkoutStep === 'address' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
                            <span>Shipping</span>
                        </div>
                        <div className="w-12 h-1 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${checkoutStep === 'payment' ? 'text-primary font-bold' : 'text-gray-500'}`}>
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">3</div>
                            <span>Payment</span>
                        </div>
                    </div>
                )}

                {cart.length === 0 && !success ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Your cart is empty.</p>
                        <button onClick={() => navigate('/our-products')} className="mt-4 text-primary font-semibold hover:underline">
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        {checkoutStep === 'cart' && (
                            <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
                                <div className="md:col-span-2 space-y-4">
                                    {groupedCart.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={Array.isArray(item.images) ? item.images[0] : item.image}
                                                    alt={item.name || item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">{item.name || item.title}</h3>
                                                <p className="text-gray-500 text-sm">{item.category}</p>
                                                {item.shippingSource && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                                                        <Truck className="w-3 h-3" />
                                                        From: {item.shippingSource}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="text-primary font-bold">
                                                        ₹{typeof item.price === 'number' ? item.price : item.price.replace('$', '')}
                                                    </p>
                                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                                        <button 
                                                            onClick={() => removeOneFromCart(item.name || item.title)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-200 hover:text-red-500 font-bold transition-colors"
                                                        >-</button>
                                                        <span className="px-3 py-1 font-bold text-sm bg-white border-x border-gray-200">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => addOneToCart(item)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-200 hover:text-green-600 font-bold transition-colors"
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeAllFromCart(item.name || item.title)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="md:col-span-1">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                                        <div className="flex justify-between mb-2 text-gray-600">
                                            <span>Subtotal</span>
                                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        {/* <div className="flex justify-between mb-4 text-gray-600 text-sm italic">
                                            <span>Shipping & GST</span>
                                            <span>Calculated at checkout</span>
                                        </div> */}
                                        <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                                            <span>Est. Total</span>
                                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {checkoutStep === 'address' && (
                            <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-slide-in-right">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                                        <p className="text-sm text-gray-500">Where should we create your order?</p>
                                    </div>
                                </div>
                                <ShippingAddressForm onSubmit={handleAddressSubmit} initialAddress={shippingAddress || undefined} />
                                <button
                                    onClick={() => setCheckoutStep('cart')}
                                    className="mt-4 text-gray-500 hover:text-gray-900 text-sm font-medium"
                                >
                                    &larr; Back to Cart
                                </button>
                            </div>
                        )}

                        {checkoutStep === 'payment' && (
                            <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-slide-in-right">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Review & Pay</h2>
                                        <p className="text-sm text-gray-500">Select delivery & complete purchase</p>
                                    </div>
                                </div>

                                {success ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-green-600">Order Placed!</h3>
                                        <p className="text-gray-500 mt-2">Redirecting to order history...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 rounded-xl text-sm border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-semibold text-gray-700">Shipping to:</div>
                                                    <div className="text-gray-600 mt-1">
                                                        {shippingAddress?.houseNo}, {shippingAddress?.street}, {shippingAddress?.city} - {shippingAddress?.pincode}
                                                    </div>
                                                </div>
                                                <button onClick={() => setCheckoutStep('address')} className="text-primary text-xs font-bold hover:underline">One-Edit</button>
                                            </div>
                                        </div>

                                        {/* Shipping Method Selection */}
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-3">Delivery Method</h3>
                                            <div className="space-y-3">
                                                <div
                                                    onClick={() => setShippingMethod('India Post')}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${shippingMethod === 'India Post' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'India Post' ? 'border-primary' : 'border-gray-300'}`}>
                                                            {shippingMethod === 'India Post' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-800">India Post</div>
                                                            <div className="text-xs text-gray-500">Est. {5 + Math.floor(distance / 200)} days</div>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-gray-700">
                                                        {/* ₹{distance <= 200 ? 19 : 30} */}

                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="pt-4 mt-4 border-t space-y-2">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Subtotal</span>
                                                <span>₹{calculateSubtotal().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Shipping ({shippingMethod})</span>
                                                <span>₹{shippingCost.toFixed(2)}</span>
                                            </div>
                                            {/* <div className="flex justify-between text-sm text-gray-600">
                                                <span>GST (18%)</span>
                                                <span>₹{calculateGST().toFixed(2)}</span>
                                            </div> */}
                                            <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-dashed">
                                                <span>Total Amount</span>
                                                <span>₹{calculateTotal().toFixed(2)}</span>
                                            </div>

                                            <p className="text-xs text-center text-gray-500 mt-4">
                                                Clicking "Pay Now" will open the secure Razorpay payment gateway.
                                            </p>

                                            <button
                                                onClick={handlePayment}
                                                disabled={processing || !isRazorpayLoaded}
                                                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    `Pay ₹${calculateTotal().toFixed(2)}`
                                                )}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setCheckoutStep('address')}
                                            disabled={processing}
                                            className="w-full text-center text-gray-500 hover:text-gray-900 text-sm font-medium mt-2"
                                        >
                                            &larr; Back to Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};
export default CartPage;
