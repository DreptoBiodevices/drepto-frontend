import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showPayment, setShowPayment] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('patient_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart:updated'));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            // Price is now a number in the new schema
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                : item.price;
            return total + (isNaN(price) ? 0 : price);
        }, 0);
    };

    const handleCheckout = () => {
        if (!user) {
            // Redirect to login with return path
            navigate('/auth', { state: { from: '/cart' } });
            return;
        }
        setShowPayment(true);
    };

    const handlePayment = () => {
        setProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setCart([]);
            localStorage.removeItem('patient_cart');
            window.dispatchEvent(new Event('cart:updated'));
            setTimeout(() => {
                setShowPayment(false);
                setSuccess(false);
                navigate('/dashboard'); // Or correct order history page
            }, 2000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Your cart is empty.</p>
                        <button onClick={() => navigate('/our-products')} className="mt-4 text-primary font-semibold hover:underline">
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        {/* Handle both old (string) and new (array) image formats */}
                                        <img
                                            src={Array.isArray(item.images) ? item.images[0] : item.image}
                                            alt={item.name || item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{item.name || item.title}</h3>
                                        <p className="text-gray-500 text-sm">{item.category}</p>
                                        <p className="text-primary font-bold mt-1">
                                            ${typeof item.price === 'number' ? item.price : item.price.replace('$', '')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(idx)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                                <div className="flex justify-between mb-2 text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4 text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                                    <span>Total</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                                >
                                    Proceed to Checkout
                                </button>
                                {!user && (
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                        You will be asked to login first.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-fade-in-up">
                        <button
                            onClick={() => setShowPayment(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center">Secure Checkout</h2>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-600">Payment Successful!</h3>
                                <p className="text-gray-500 mt-2">Thank you for your purchase.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">💳</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Credit/Debit Card</p>
                                        <p className="text-xs text-gray-500">Secure encryption</p>
                                    </div>
                                    <div className="ml-auto w-4 h-4 rounded-full border-4 border-primary"></div>
                                </div>
                                <div className="p-4 border rounded-xl flex items-center gap-3 opacity-50 cursor-not-allowed">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">📱</div>
                                    <div>
                                        <p className="font-bold text-gray-900">UPI / Wallet</p>
                                        <p className="text-xs text-gray-500">Coming soon</p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t">
                                    <div className="flex justify-between text-sm mb-4">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            'Pay Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
