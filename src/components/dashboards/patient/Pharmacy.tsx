
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../lib/utils';

const Pharmacy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<{ id: number | string, name: string, price: string, image: string }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD' | ''>('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const categories = ["Pain Relief", "Cold & Flu", "Supplements", "First Aid", "Skin Care", "Diabetes Care", "Heart Health", "Baby Care"];
    // Keeping mock data empty as per previous instructions, but typing is ready for integration
    const popularItems: { id: number, name: string, price: string, image: string }[] = [];

    const handleUploadClick = () => fileInputRef.current?.click();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setIsUploading(true);
            setTimeout(() => {
                setIsUploading(false);
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            }, 2000);
        }
    };

    const addToCart = (item: typeof popularItems[0]) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return total + (isNaN(price) ? 0 : price);
        }, 0);
    };

    // Sync with localStorage so other pages (e.g., MedicineDetail) can add items
    useEffect(() => {
        try {
            const stored = localStorage.getItem('patient_cart');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setCart(parsed);
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('patient_cart', JSON.stringify(cart));
        } catch {}
    }, [cart]);

    useEffect(() => {
        const handleCartUpdated = () => {
            try {
                const stored = localStorage.getItem('patient_cart');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) setCart(parsed);
                }
            } catch {}
        };
        window.addEventListener('cart:updated', handleCartUpdated as EventListener);
        return () => window.removeEventListener('cart:updated', handleCartUpdated as EventListener);
    }, []);

    // Quick Add Medicine (when no catalog data yet)
    const [newMedName, setNewMedName] = useState('');
    const [newMedPrice, setNewMedPrice] = useState('');
    const handleQuickAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(newMedPrice);
        if (!newMedName.trim() || isNaN(priceNum) || priceNum <= 0) return;
        const med = {
            id: Date.now(),
            name: newMedName.trim(),
            price: `${priceNum}`,
            image: ''
        };
        setCart((c) => [...c, med]);
        setNewMedName('');
        setNewMedPrice('');
        setIsCartOpen(true);
    };

    return (
        <div className="animate-fade-in-up pb-10 relative">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div className="flex-1 max-w-md relative">
                    <input 
                        type="text" 
                        placeholder="Search medicines..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="ml-4 p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-purple-50 hover:text-purple-600 transition-colors relative group"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-gray-50 group-hover:scale-110 transition-transform">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Link to Full Catalog */}
            <div className="mb-6 text-right">
                <button 
                    onClick={() => navigate('/medicines')}
                    className="text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline flex items-center justify-end gap-1 ml-auto"
                >
                    Browse Full Medicine Catalog
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
            </div>

            {/* Upload Prescription Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-8 text-white mb-10 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10 mb-6 md:mb-0 max-w-md">
                    <h2 className="text-3xl font-bold mb-2">Have a Prescription?</h2>
                    <p className="text-purple-100 opacity-90">Upload your doctor's prescription and let us organize your medicine delivery.</p>
                </div>
                <div className="relative z-10">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                    {uploadSuccess ? (
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 animate-fade-in-up">
                             <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                             Uploaded Successfully
                        </div>
                    ) : (
                        <button onClick={handleUploadClick} disabled={isUploading} className="bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-purple-50 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-80 disabled:cursor-wait min-w-[160px] justify-center">
                            {isUploading ? <span className="animate-pulse">Uploading...</span> : <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Upload Now
                            </>}
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Add Medicine */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Quick Add Medicine</h4>
                <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="Medicine name"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newMedPrice}
                        onChange={(e) => setNewMedPrice(e.target.value)}
                        placeholder="Price (INR)"
                        className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700">Add</button>
                </form>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Categories</h3>
                    <button className="text-sm text-purple-600 font-bold hover:underline">View All</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map(cat => (
                        <button key={cat} className="flex-shrink-0 bg-white px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:border-purple-500 hover:text-purple-600 hover:shadow-md transition-all whitespace-nowrap">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {popularItems.length > 0 ? popularItems.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 group flex flex-col">
                            <div className="h-32 w-full bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-1 text-sm line-clamp-2 min-h-[2.5em]">{item.name}</h4>
                            <div className="flex items-center justify-between mt-auto pt-2">
                                <p className="text-purple-600 font-bold">{(() => { const n = parseFloat(item.price.replace(/[^0-9.]/g, '')); return isNaN(n) ? item.price.replace('$', '₹') : formatCurrency(n); })()}</p>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors shadow-sm active:scale-95"
                                    title="Add to Cart"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <p className="text-gray-500 font-medium">No products found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Drawer / Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsCartOpen(false)}
                    ></div>
                    
                    {/* Cart Panel */}
                    <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-left" style={{animationDirection: 'reverse', animationName: 'slideInRight'}}>
                         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                 <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                 My Cart
                             </h3>
                             <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                             </button>
                         </div>

                         <div className="flex-1 overflow-y-auto p-6 space-y-4">
                             {cart.length === 0 ? (
                                 <div className="text-center py-20 flex flex-col items-center">
                                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                         <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                     </div>
                                     <p className="text-gray-500 font-medium">Your cart is empty.</p>
                                     <button onClick={() => setIsCartOpen(false)} className="mt-4 text-purple-600 font-bold hover:underline">Continue Shopping</button>
                                 </div>
                             ) : (
                                 cart.map((item, index) => (
                                     <div key={index} className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all bg-white shadow-sm">
                                         <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                                         <div className="flex-1">
                                             <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                             <p className="text-purple-600 font-bold">{(() => { const n = parseFloat(item.price.replace(/[^0-9.]/g, '')); return isNaN(n) ? item.price.replace('$', '₹') : formatCurrency(n); })()}</p>
                                         </div>
                                         <button onClick={() => removeFromCart(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                         </button>
                                     </div>
                                 ))
                             )}
                         </div>

                         {cart.length > 0 && (
                             <div className="p-6 border-t border-gray-100 bg-gray-50">
                                 <div className="flex justify-between items-center mb-4">
                                     <span className="text-gray-500 font-medium">Total Amount</span>
                                     <span className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotal())}</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3">
                                     <button onClick={() => setIsCartOpen(false)} className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all">Continue Shopping</button>
                                     <button onClick={() => { setIsPaymentOpen(true); setPaymentMethod(''); setPaymentSuccess(false); setPaymentProcessing(false); }} className="w-full py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95">
                                         Proceed to Payment
                                     </button>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            )}
            {isPaymentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                        <button onClick={() => setIsPaymentOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Select Payment Method</h3>
                        <p className="text-sm text-gray-500 mb-4">Amount payable: <span className="font-semibold text-gray-800">{formatCurrency(calculateTotal())}</span></p>
                        <div className="space-y-2">
                            {(['UPI','Card','COD'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setPaymentMethod(m)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${paymentMethod === m ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className="font-bold">{m}</span>
                                    {paymentMethod === m && <span className="text-xs font-bold">Selected</span>}
                                </button>
                            ))}
                        </div>
                        <div className="mt-5">
                            {!paymentSuccess ? (
                                <button
                                    disabled={!paymentMethod || paymentProcessing}
                                    onClick={() => {
                                        setPaymentProcessing(true);
                                        setTimeout(() => {
                                            setPaymentProcessing(false);
                                            setPaymentSuccess(true);
                                        }, 1500);
                                    }}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${paymentMethod ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    {paymentProcessing ? 'Processing...' : 'Pay Now'}
                                </button>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 mb-2">Payment Successful</p>
                                    <p className="text-sm text-gray-500 mb-4">Your order has been placed.</p>
                                    <button
                                        onClick={() => { setIsPaymentOpen(false); setIsCartOpen(false); }}
                                        className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pharmacy;
