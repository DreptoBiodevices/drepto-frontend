
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ShippingAddressForm from '../components/ShippingAddressForm';
import { Address, Order } from '../types';
import { Truck, MapPin, CreditCard, X, Check } from 'lucide-react';

type CheckoutStep = 'cart' | 'address' | 'payment';

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
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
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                : item.price;
            return total + (isNaN(price) ? 0 : price);
        }, 0);
    };

    const handleProceedToCheckout = () => {
        if (!user) {
            navigate('/auth', { state: { from: '/cart' } });
            return;
        }
        setCheckoutStep('address');
    };

    const handleAddressSubmit = (address: Address) => {
        setShippingAddress(address);
        setCheckoutStep('payment');
    };

    const handlePayment = () => {
        if (!shippingAddress || !user) return;

        setProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);

            // Create Order Object
            const newOrder: Order = {
                id: `ORD-${Date.now()}`,
                date: new Date().toISOString(),
                items: cart.map(item => ({
                    name: item.name || item.title,
                    price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, '')),
                    quantity: 1, // Assuming quantity 1 for now
                    image: Array.isArray(item.images) ? item.images[0] : item.image,
                    shippingSource: item.shippingSource
                })),
                total: calculateTotal(),
                status: 'Placed',
                shippingAddress: shippingAddress,
                trackingId: `TRK-${Math.floor(Math.random() * 1000000)}`,
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString() // +5 days
            };

            // Save to LocalStorage
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

            setCart([]);
            localStorage.removeItem('patient_cart');
            window.dispatchEvent(new Event('cart:updated'));

            setTimeout(() => {
                setSuccess(false);
                navigate('/orders'); // Redirect to Order History
            }, 2000);
        }, 2000);
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
                                    {cart.map((item, idx) => (
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
                                                <p className="text-primary font-bold mt-1">
                                                    ${typeof item.price === 'number' ? item.price : item.price.replace('$', '')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(idx)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                                        <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
                                        <p className="text-sm text-gray-500">Complete your purchase</p>
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
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-xl mb-4 text-sm">
                                            <div className="font-semibold text-gray-700">Shipping to:</div>
                                            <div className="text-gray-600">
                                                {shippingAddress?.houseNo}, {shippingAddress?.buildingName ? `${shippingAddress.buildingName}, ` : ''}{shippingAddress?.street}, {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}, {shippingAddress?.country}
                                            </div>
                                        </div>

                                        <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center gap-3 cursor-pointer ring-2 ring-primary relative">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">💳</div>
                                            <div>
                                                <p className="font-bold text-gray-900">Credit/Debit Card</p>
                                                <p className="text-xs text-gray-500">Secure encryption</p>
                                            </div>
                                            <div className="ml-auto w-4 h-4 rounded-full bg-primary"></div>
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
