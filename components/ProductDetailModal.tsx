import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Leaf, AlertCircle, BookOpen, Check, Truck, Building2, Box, Star, Upload, Video, Camera, Trash2, Plus, Minus } from 'lucide-react';

export interface Product {
    name: string;
    description: string;
    detailedDescription?: string;
    price: number;
    mrp: number;
    images: string[];
    category: string;
    ingredients?: string[];
    benefits?: string[];
    sideEffects?: string[];
    developmentStory?: string;
}

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}


const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [reviews, setReviews] = useState<{id: number, name: string, rating: number, comment: string, media?: string}[]>([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', media: null as string | null });
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

    const [showSourceSelection, setShowSourceSelection] = useState(false);
    const [shippingSource, setShippingSource] = useState<'IIT Bombay' | 'Warehouse' | null>(null);
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCart = () => {
            try {
                const stored = localStorage.getItem('patient_cart');
                if (stored) {
                    const cart = JSON.parse(stored);
                    setCartCount(cart.filter((item: any) => item.name === product?.name).length);
                } else {
                    setCartCount(0);
                }
            } catch { }
        };
        updateCart();
        window.addEventListener('cart:updated', updateCart);
        return () => window.removeEventListener('cart:updated', updateCart);
    }, [product]);

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        const index = currentCart.findLastIndex((item: any) => item.name === product?.name);
        if (index !== -1) {
            currentCart.splice(index, 1);
            localStorage.setItem('patient_cart', JSON.stringify(currentCart));
            window.dispatchEvent(new Event('cart:updated'));
        }
    };

    const confirmAddToCart = (source: 'IIT Bombay' | 'Warehouse') => {
        const productWithSource = { ...product, shippingSource: source };
        onAddToCart(productWithSource);
        setShowSourceSelection(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-full max-h-[90vh] shadow-2xl relative flex flex-col lg:flex-row overflow-hidden animate-scale-in border border-gray-100">

                {/* Close Button - Floated */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md text-gray-800 rounded-full hover:bg-gray-100 transition-all shadow-sm border border-gray-200 group"
                >
                    <X className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </button>

                {/* Left Column: Image Area */}
                <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden shrink-0 h-[35%] lg:h-auto border-b lg:border-b-0 lg:border-r border-gray-100">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    {product.images && product.images.length > 0 ? (
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                            <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
                                <img
                                    src={product.images[activeImageIndex] || product.images[0]}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto p-2 max-w-full custom-scrollbar">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${activeImageIndex === idx ? 'border-brand-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover bg-white" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300 z-10 p-12">
                            <Leaf className="w-24 h-24 mb-4 opacity-50" />
                            <p className="font-medium">No Image Available</p>
                        </div>
                    )}

                    {/* Tags overlay for Image */}
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6 flex flex-col gap-2 z-10">
                        <span className="bg-white/90 backdrop-blur-md text-gray-800 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-wider shadow-sm border border-gray-100 self-start">
                            {product.category}
                        </span>
                        {discount > 0 && (
                            <span className="bg-red-500 text-white px-3 py-1 lg:px-4 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-wider shadow-sm self-start animate-pulse">
                                {discount}% OFF
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white min-h-0 flex-1">

                    {/* Header Section */}
                    <div className="p-6 lg:p-10 border-b border-gray-100 bg-white shrink-0">
                        <h2 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                            {product.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="text-3xl font-black text-brand-700">₹{product.price || 0}</span>
                            {product.mrp && product.mrp > (product.price || 0) && (
                                <span className="text-lg text-gray-400 line-through font-medium">₹{product.mrp}</span>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 custom-scrollbar overscroll-contain">
                        {/* Description */}
                        <div className="prose prose-lg text-gray-600 max-w-none">
                            <h3 className="text-gray-900 font-bold text-lg mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Overview
                            </h3>
                            <p className="leading-relaxed">{product.description}</p>
                        </div>

                        {/* Detailed Description Highlight */}
                        {product.detailedDescription && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BookOpen className="w-24 h-24 text-blue-900" />
                                </div>
                                <p className="text-blue-900 italic font-medium relative z-10 leading-relaxed">
                                    "{product.detailedDescription}"
                                </p>
                            </div>
                        )}

                        {/* Usage & Benefits Sections (Abbreviated for brevity, keeping structure) */}
                        {product.ingredients && product.ingredients.length > 0 && ( /* ... */
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-600" /> Key Ingredients</h3>
                                <div className="flex flex-wrap gap-2">{product.ingredients.map((ing, idx) => <span key={idx} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-100">{ing}</span>)}</div>
                            </div>
                        )}

                        {/* More sections... omitted to focus on changes, but re-including necessary existing structure */}
                        {product.developmentStory && (
                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-gray-900 font-bold text-lg mb-3">The Story</h3>
                                <p className="text-gray-500 italic text-sm leading-relaxed">{product.developmentStory}</p>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> 
                                Customer Reviews
                            </h3>
                            
                            {/* Existing Reviews */}
                            <div className="space-y-4 mb-8">
                                {reviews.map((r) => (
                                    <div key={r.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-900">{r.name}</span>
                                            <div className="flex items-center gap-3">
                                                {r.name === "You" && (
                                                    <div className="flex items-center gap-2 mr-2 border-r border-gray-300 pr-3">
                                                        <button 
                                                            className="text-xs text-brand-600 hover:underline font-semibold"
                                                            onClick={() => {
                                                                setEditingReviewId(r.id);
                                                                setReviewForm({ rating: r.rating, comment: r.comment, media: r.media || null });
                                                            }}
                                                        >Edit</button>
                                                        <button 
                                                            className="text-xs text-red-500 hover:underline font-semibold"
                                                            onClick={() => setReviews(reviews.filter(rev => rev.id !== r.id))}
                                                        >Delete</button>
                                                    </div>
                                                )}
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} className={`w-4 h-4 ${idx < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{r.comment}</p>
                                        {r.media && (
                                            <div className="mt-3">
                                                {r.media.startsWith('data:video') ? (
                                                    <video src={r.media} controls className="h-24 rounded-lg border border-gray-200" />
                                                ) : (
                                                    <img src={r.media} className="h-24 rounded-lg object-cover border border-gray-200" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Write/Edit Review Form */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-3">{editingReviewId !== null ? "Edit Your Review" : "Write a Review"}</h4>
                                
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                    <span className="text-sm font-medium text-gray-500 ml-2">
                                        {['Terrible', 'Poor', 'Average', 'Good', 'Excellent!'][reviewForm.rating - 1]}
                                    </span>
                                </div>

                                <textarea 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 mb-3"
                                    placeholder="Share your experience with this product..."
                                    rows={3}
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                ></textarea>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <label className="cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                            <Camera className="w-4 h-4" /> Photo
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if(file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => setReviewForm({...reviewForm, media: e.target?.result as string});
                                                    reader.readAsDataURL(file);
                                                }
                                            }} />
                                        </label>
                                        <label className="cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                            <Video className="w-4 h-4" /> Video
                                            <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if(file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => setReviewForm({...reviewForm, media: e.target?.result as string});
                                                    reader.readAsDataURL(file);
                                                }
                                            }} />
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        {editingReviewId !== null && (
                                            <button 
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1.5 px-4 rounded-lg text-sm transition-colors mr-2"
                                                onClick={() => {
                                                    setEditingReviewId(null);
                                                    setReviewForm({rating: 5, comment: '', media: null});
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button 
                                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition-colors"
                                            onClick={() => {
                                                if(!reviewForm.comment.trim()) return;
                                                
                                                if (editingReviewId !== null) {
                                                    setReviews(reviews.map(r => r.id === editingReviewId ? { ...r, ...reviewForm } : r));
                                                    setEditingReviewId(null);
                                                } else {
                                                    setReviews([{ id: Date.now(), name: "You", ...reviewForm }, ...reviews]);
                                                }
                                                setReviewForm({rating: 5, comment: '', media: null});
                                            }}
                                        >
                                            {editingReviewId !== null ? "Update" : "Submit"}
                                        </button>
                                    </div>
                                </div>
                                {reviewForm.media && (
                                    <div className="mt-3 relative inline-block">
                                        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 cursor-pointer z-10" onClick={() => setReviewForm({...reviewForm, media: null})}>
                                            <X className="w-3 h-3 text-white" />
                                        </div>
                                        {reviewForm.media.startsWith('data:video') ? (
                                            <video src={reviewForm.media} className="h-16 rounded opacity-80" />
                                        ) : (
                                            <img src={reviewForm.media} className="h-16 rounded opacity-80" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 lg:p-10 border-t border-gray-100 mt-auto">
                        {cartCount > 0 ? (
                            <div className="w-full flex items-center justify-between border-2 border-yellow-400 rounded-full h-[56px] overflow-hidden bg-white shadow-sm">
                                <button 
                                    onClick={handleDecrement}
                                    className="h-full px-6 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-300 text-gray-700 hover:text-red-600"
                                >
                                    {cartCount === 1 ? (
                                        <Trash2 className="w-6 h-6" />
                                    ) : (
                                        <Minus className="w-6 h-6" />
                                    )}
                                </button>
                                <span className="font-bold text-gray-900 text-lg flex-1 text-center">
                                    {cartCount} in cart
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); confirmAddToCart('Warehouse'); }}
                                    className="h-full px-6 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-gray-300 text-gray-700"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); confirmAddToCart('Warehouse'); }}
                                className="w-full bg-gray-900 text-white py-4 rounded-full hover:bg-orange-500 transition-all shadow-lg flex items-center justify-center gap-2 font-bold text-lg group active:scale-[0.98]"
                            >
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Source Selection Modal Overlay */}

        </div>
    );
};

export default ProductDetailModal;

