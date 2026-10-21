import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, Leaf, BookOpen, Star, Camera, Video,
    Trash2, Plus, Minus, Edit, X, ChevronLeft, ChevronRight,
    Shield, Zap, Award, Package
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, ProductService } from '../lib/api_controller';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export interface Product {
    _id?: string;
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

type Tab = 'specifications' | 'description' | 'manufacturer';

const SPECS = [
    { label: 'Sales Package', value: '2 Pain Relief Patches' },
    { label: 'Pack of', value: '2' },
    { label: 'Brand', value: 'MENSTROHERB SHEET' },
    { label: 'Model Name', value: 'Drepto Menstro Herb Sheet' },
    { label: 'Quantity', value: '2 Patches' },
    { label: 'Form', value: 'Plaster & Patch' },
    { label: 'Container Type', value: 'Sachet' },
    { label: 'Application Area', value: 'Lower Abdomen, Back' },
    { label: 'Ideal For', value: 'Adults' },
    { label: 'Pre Delivery', value: 'Yes' },
    { label: 'Post Delivery', value: 'Yes' },
    { label: 'Organic', value: 'Yes' },
    { label: 'Manufacturing Process', value: 'Cruelty Free' },
    { label: 'Maximum Shelf Life', value: '36 Months' },
    { label: 'License Number', value: 'AUS-940' },
    { label: 'Prescription Required', value: 'No' },
    { label: 'Net Quantity', value: '2 Patches' },
];

const COMPOSITION = 'Peppermint Satva (Mentha piperita): 15%, Taila Parni (Eucalyptus globulus): 5%, Shallaki Guggul (Boswellia serrata): 3%, Haridra Satva (Curcuma longa): 1%, Cinnamon Oil (Cinnamomum zeylanicum), Excipients q.s.';

const KEY_FEATURES = [
    'Up to 12 hours long-lasting relief',
    'Instant cramp relief sensation',
    '100% herbal active formulation',
    'Contains 15% Peppermint Satva for cooling relief',
    'Contains 5% Taila Parni for warming muscle comfort',
    'Contains 3% Shallaki Guggul to ease inflammation',
    'Contains 1% Haridra Satva and cinnamon oil',
    'Ayurvedic Proprietary Medicine',
    'Technology developed by IIT Bombay researchers',
    'Patent-filed patch technology',
    'Targeted lower abdomen and lower back application',
    'Easy peel-and-stick design',
    'Discreet and comfortable to wear',
    'Single-use and hygienic packaging',
    'Pack of 2 patches (75 cm² each)',
];

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, setAuthModalView } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>('specifications');
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '', images: [], videos: [] } as any);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [notification, setNotification] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowLeft' && product) setActiveImageIndex(i => (i - 1 + product.images.length) % product.images.length);
            if (e.key === 'ArrowRight' && product) setActiveImageIndex(i => (i + 1) % product.images.length);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxOpen, product]);

    useEffect(() => {
        if (id) {
            ProductService.getProductById(id)
                .then(res => setProduct(res.data))
                .catch(err => console.error('Failed to fetch product', err))
                .finally(() => setLoading(false));
        }
    }, [id]);

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

    useEffect(() => {
        if (product && product._id) {
            api.get(`/reviews/product/${product._id}`)
                .then(res => setReviews(res.data))
                .catch(err => console.error('Failed to fetch reviews', err));
        } else {
            setReviews([]);
        }
    }, [product]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex justify-center items-center pt-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col justify-center items-center pt-24 text-gray-500">
                    <Leaf className="w-16 h-16 mb-4 opacity-50" />
                    <h2 className="text-xl font-bold">Product not found</h2>
                    <button onClick={() => navigate('/our-products')} className="mt-4 text-primary font-medium hover:underline">
                        Return to Products
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        const index = currentCart.findLastIndex((item: any) => item.name === product.name);
        if (index !== -1) {
            currentCart.splice(index, 1);
            localStorage.setItem('patient_cart', JSON.stringify(currentCart));
            window.dispatchEvent(new Event('cart:updated'));
        }
    };

    const confirmAddToCart = (source: 'IIT Bombay' | 'Warehouse') => {
        if (!user) { setAuthModalView('login'); return; }
        const productWithSource = { ...product, shippingSource: source };
        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        localStorage.setItem('patient_cart', JSON.stringify([...currentCart, productWithSource]));
        window.dispatchEvent(new Event('cart:updated'));
        setNotification('Added to cart!');
        setTimeout(() => setNotification(''), 1500);
    };

    const prevImage = () => setActiveImageIndex(i => (i - 1 + product.images.length) % product.images.length);
    const nextImage = () => setActiveImageIndex(i => (i + 1) % product.images.length);

    const paid = Math.ceil(cartCount / 2);
    const free = Math.floor(cartCount / 2);

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <Navbar />

            {/* ── Lightbox Modal ── */}
            {lightboxOpen && product.images && product.images.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors z-10"
                        onClick={e => { e.stopPropagation(); setLightboxOpen(false); }}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image counter */}
                    <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-semibold">
                        {activeImageIndex + 1} / {product.images.length}
                    </p>

                    {/* Main lightbox image */}
                    <div
                        className="relative flex items-center justify-center w-full max-w-5xl px-16"
                        onClick={e => e.stopPropagation()}
                    >
                        {product.images.length > 1 && (
                            <button
                                onClick={e => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 w-11 h-11 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <img
                            src={product.images[activeImageIndex]}
                            alt={product.name}
                            className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
                            style={{ background: 'transparent' }}
                        />
                        {product.images.length > 1 && (
                            <button
                                onClick={e => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 w-11 h-11 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Thumbnail strip in lightbox */}
                    {product.images.length > 1 && (
                        <div
                            className="absolute bottom-6 flex gap-2 px-4 py-2 bg-black/40 rounded-2xl overflow-x-auto max-w-[90vw]"
                            onClick={e => e.stopPropagation()}
                        >
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={e => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImageIndex === idx
                                            ? 'border-white scale-110 shadow-lg'
                                            : 'border-white/30 opacity-50 hover:opacity-80'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Hint */}
                    <p className="absolute top-4 left-4 text-white/40 text-[11px]">Press Esc or click outside to close · ← → to navigate</p>
                </div>
            )}

            {/* Toast */}
            {notification && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-semibold">
                    ✓ {notification}
                </div>
            )}

            <main className="flex-grow pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

                    {/* Breadcrumb */}
                    <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
                        <span>/</span>
                        <button onClick={() => navigate('/our-products')} className="hover:text-primary">Products</button>
                        <span>/</span>
                        <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
                    </nav>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex flex-col lg:flex-row">

                            {/* LEFT: Image Gallery */}
                            <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100">
                                {/* Main Image */}
                                <div className="relative bg-gray-50 flex items-center justify-center" style={{ minHeight: 420 }}>
                                    {product.images && product.images.length > 0 ? (
                                        <>
                                            <img
                                                src={product.images[activeImageIndex]}
                                                alt={product.name}
                                                onClick={() => setLightboxOpen(true)}
                                                className="w-full h-[420px] object-contain p-6 transition-opacity duration-300 cursor-zoom-in"
                                                style={{ background: '#f8f8f8' }}
                                                title="Click to enlarge"
                                            />
                                            {/* Zoom hint */}
                                            <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1">
                                                🔍 Click to zoom
                                            </div>
                                            {product.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevImage}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-200 z-10"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-200 z-10"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-300 h-[420px]">
                                            <Leaf className="w-20 h-20 mb-3 opacity-40" />
                                            <p className="text-sm font-medium">No Image Available</p>
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        {discount > 0 && (
                                            <span className="bg-red-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-sm shadow">
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnail Strip */}
                                {product.images && product.images.length > 1 && (
                                    <div className="flex gap-2 px-4 py-3 border-t border-gray-100 overflow-x-auto bg-white">
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`shrink-0 w-[72px] h-[72px] rounded-lg border-2 overflow-hidden transition-all ${activeImageIndex === idx
                                                    ? 'border-primary shadow-md scale-105'
                                                    : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                                                    }`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover bg-gray-50" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3 p-4 border-t border-gray-100 bg-gray-50">
                                    {[
                                        { icon: Shield, label: 'IIT Bombay Backed', color: 'text-blue-600' },
                                        { icon: Zap, label: '12 Hr Relief', color: 'text-orange-500' },
                                        { icon: Leaf, label: '100% Herbal', color: 'text-green-600' },
                                        { icon: Award, label: 'Patent Filed', color: 'text-purple-600' },
                                    ].map(({ icon: Icon, label, color }) => (
                                        <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
                                            <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                                            <span className="text-[11px] font-bold text-gray-700">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Product Info */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Product Header */}
                                <div className="p-6 lg:p-8 border-b border-gray-100">
                                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                                        {product.category}
                                    </span>
                                    <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug mb-4">
                                        {product.name}
                                    </h1>

                                    {/* Rating */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-1 bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded-md">
                                            <span>4.3</span>
                                            <Star className="w-3.5 h-3.5 fill-white" />
                                        </div>
                                        <span className="text-sm text-gray-500">{reviews.length} Ratings</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-3 mb-3">
                                        <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
                                        {product.mrp > product.price && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through font-medium">₹{product.mrp}</span>
                                                <span className="text-base font-bold text-green-600">{discount}% off</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Buy 1 Get 1 Free */}
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-md shadow-orange-200 animate-pulse">
                                        🎁 Buy 1 Get 1 Free — Pay for 1, Receive 2!
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 px-6 lg:px-8 bg-white">
                                    <div className="flex gap-0 -mb-px">
                                        {(['specifications', 'description', 'manufacturer'] as Tab[]).map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                                    }`}
                                            >
                                                {tab === 'specifications' ? 'Specifications' : tab === 'description' ? 'Description' : 'Manufacturer Info'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-white" style={{ maxHeight: 480 }}>

                                    {/* Specifications Tab */}
                                    {activeTab === 'specifications' && (
                                        <div>
                                            <h2 className="text-base font-extrabold text-gray-900 mb-4">All details</h2>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-100">In the Box</h3>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                    {SPECS.slice(0, 2).map(({ label, value }) => (
                                                        <div key={label}>
                                                            <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
                                                            <p className="text-sm font-semibold text-gray-800">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-100">General</h3>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                    {SPECS.slice(2, 11).map(({ label, value }) => (
                                                        <div key={label}>
                                                            <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
                                                            <p className="text-sm font-semibold text-gray-800">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold text-gray-800 mb-2 pb-1 border-b border-gray-100">Composition</h3>
                                                <p className="text-sm text-blue-700 font-medium leading-relaxed">{COMPOSITION}</p>
                                            </div>

                                            <div className="mb-6">
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                    {SPECS.slice(11).map(({ label, value }) => (
                                                        <div key={label}>
                                                            <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
                                                            <p className="text-sm font-semibold text-gray-800">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-100">Key Features</h3>
                                                <p className="text-sm text-blue-700 font-medium leading-relaxed">
                                                    {KEY_FEATURES.join(', ')}.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description Tab */}
                                    {activeTab === 'description' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-primary" /> Overview
                                                </h3>
                                                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                                            </div>

                                            {product.detailedDescription && (
                                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                                    <p className="text-sm text-blue-900 font-medium italic leading-relaxed">
                                                        "{product.detailedDescription}"
                                                    </p>
                                                </div>
                                            )}

                                            {product.ingredients && product.ingredients.length > 0 && (
                                                <div>
                                                    <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                                                        <Leaf className="w-5 h-5 text-green-600" /> Key Ingredients
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.ingredients.map((ing, idx) => (
                                                            <span key={idx} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-100">
                                                                {ing}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {product.benefits && product.benefits.length > 0 && (
                                                <div>
                                                    <h3 className="text-base font-extrabold text-gray-900 mb-3">Benefits</h3>
                                                    <ul className="space-y-2">
                                                        {product.benefits.map((b, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                                    <span className="text-green-600 text-[10px] font-bold">✓</span>
                                                                </span>
                                                                {b}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {product.developmentStory && (
                                                <div className="border-t pt-5">
                                                    <h3 className="text-base font-extrabold text-gray-900 mb-2">The Story</h3>
                                                    <p className="text-sm text-gray-600 italic leading-relaxed">{product.developmentStory}</p>
                                                </div>
                                            )}

                                            {/* Reviews */}
                                            <div className="border-t pt-5">
                                                <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Customer Reviews
                                                </h3>
                                                <div className="space-y-4 mb-6">
                                                    {reviews.length === 0 && (
                                                        <p className="text-sm text-gray-400 italic">No reviews yet. Be the first!</p>
                                                    )}
                                                    {reviews.map(r => (
                                                        <div key={r._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-bold text-gray-900 text-sm">
                                                                    {r.userId?.firstName ? `${r.userId.firstName} ${r.userId.lastName || ''}`.trim() : 'Customer'}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex gap-0.5">
                                                                        {[...Array(5)].map((_, idx) => (
                                                                            <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                                                        ))}
                                                                    </div>
                                                                    {user && (r.userId?._id === user.id || r.userId === user.id) && (
                                                                        <div className="flex items-center gap-1">
                                                                            <button onClick={() => { setEditingReviewId(r._id); setReviewForm({ rating: r.rating, reviewText: r.reviewText, images: r.images || [], videos: r.videos || [] }); }} className="text-gray-400 hover:text-blue-500"><Edit className="w-3.5 h-3.5" /></button>
                                                                            <button onClick={async () => { if (window.confirm('Delete?')) { try { await api.delete(`/reviews/${r._id}`); setReviews(reviews.filter(rev => rev._id !== r._id)); } catch { alert('Failed'); } } }} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{r.reviewText}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Write Review */}
                                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                                    <h4 className="font-bold text-gray-800 mb-3">{editingReviewId ? 'Edit Review' : 'Write a Review'}</h4>
                                                    <div className="flex items-center gap-1 mb-3">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                                                                <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                                            </button>
                                                        ))}
                                                        <span className="text-sm text-gray-500 ml-2">{['Terrible', 'Poor', 'Average', 'Good', 'Excellent!'][reviewForm.rating - 1]}</span>
                                                    </div>
                                                    <textarea
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary mb-3"
                                                        placeholder="Share your experience..."
                                                        rows={3}
                                                        value={reviewForm.reviewText}
                                                        onChange={e => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-2">
                                                            <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                                                                <Camera className="w-3.5 h-3.5" /> Photo
                                                                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setReviewForm((prev: any) => ({ ...prev, images: [...prev.images, ev.target?.result] })); r.readAsDataURL(f); } }} />
                                                            </label>
                                                            <label className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                                                                <Video className="w-3.5 h-3.5" /> Video
                                                                <input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setReviewForm((prev: any) => ({ ...prev, videos: [...prev.videos, ev.target?.result] })); r.readAsDataURL(f); } }} />
                                                            </label>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {editingReviewId && <button onClick={() => { setEditingReviewId(null); setReviewForm({ rating: 5, reviewText: '', images: [], videos: [] }); }} className="text-sm text-gray-500 px-3 py-1.5 rounded-lg bg-gray-100">Cancel</button>}
                                                            <button
                                                                disabled={isSubmitting}
                                                                onClick={async () => {
                                                                    if (!reviewForm.reviewText?.trim() || !product?._id) return;
                                                                    setIsSubmitting(true);
                                                                    try {
                                                                        if (!user) { navigate('/login'); return; }
                                                                        const payload = { productId: product._id, userId: user.id, rating: reviewForm.rating, reviewText: reviewForm.reviewText, images: reviewForm.images, videos: reviewForm.videos };
                                                                        if (editingReviewId) {
                                                                            const res = await api.put(`/reviews/${editingReviewId}`, payload);
                                                                            setReviews(reviews.map(r => r._id === editingReviewId ? { ...r, ...res.data, userId: r.userId } : r));
                                                                        } else {
                                                                            const res = await api.post('/reviews', payload);
                                                                            setReviews([{ ...res.data, userId: { _id: user.id, firstName: user.firstName, lastName: user.lastName } }, ...reviews]);
                                                                        }
                                                                        setReviewForm({ rating: 5, reviewText: '', images: [], videos: [] });
                                                                        setEditingReviewId(null);
                                                                    } catch { alert('Failed to submit'); } finally { setIsSubmitting(false); }
                                                                }}
                                                                className="text-sm font-bold text-white bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-lg disabled:opacity-50"
                                                            >
                                                                {isSubmitting ? 'Submitting…' : editingReviewId ? 'Update' : 'Submit'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Manufacturer Info Tab */}
                                    {activeTab === 'manufacturer' && (
                                        <div className="space-y-6">
                                            <div className="bg-[#1a2e3b] rounded-xl p-6 text-white">
                                                <h3 className="text-lg font-extrabold mb-1 text-orange-300 uppercase tracking-wide">
                                                    Backed by Research,<br />Made for Real Relief
                                                </h3>
                                                <div className="mt-4 space-y-3">
                                                    {[
                                                        { title: 'Technology Developed by IIT Bombay Researchers', desc: 'Developed by researchers at IIT Bombay, Drepto MenstroHerb Sheet is designed to provide targeted, lasting relief.' },
                                                        { title: 'Patent Application Filed', desc: 'Patent Application No. 20-2024-5198768 filed for the underlying patch technology.' },
                                                        { title: 'Manufactured in India', desc: 'Manufactured in India under a licensed and certified facility (Mfg. Lic. No. AUS-940).' },
                                                        { title: 'Single-Use & Hygienic', desc: 'Each patch is individually sealed — Conforms of its own set pack.' },
                                                    ].map(({ title, desc }) => (
                                                        <div key={title} className="flex items-start gap-3">
                                                            <div className="mt-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                                                <span className="text-white text-[10px] font-bold">✓</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{title}</p>
                                                                <p className="text-xs text-gray-300 mt-0.5">{desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-5 border-t border-white/20 pt-4">
                                                    Drepto Biodevices Pvt. Ltd. · Near IIT Bombay, Goregaon, Mumbai
                                                </p>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                                                <h4 className="font-bold text-amber-800 mb-2 text-sm">Legal Disclaimer</h4>
                                                <p className="text-xs text-amber-700 leading-relaxed">
                                                    Drepto Biodevices endeavors to ensure that sellers provide accurate product information. It is pertinent to note that actual product packaging may contain additional or different information, including special instructions for use, warnings, and directions. We strongly recommend that consumers always read labels carefully before using or consuming any product and contact the manufacturer directly for additional information. Any claims or prevention of any disease or medical condition are made solely by the seller or manufacturer, and Drepto disclaims all responsibility for the accuracy, professional medical advice, diagnosis, or treatment.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                    {cartCount > 0 ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border-2 border-yellow-400 rounded-full overflow-hidden h-12 shadow-sm">
                                <button
                                    onClick={handleDecrement}
                                    className="px-5 h-full flex items-center justify-center hover:bg-gray-100 border-r border-gray-200 text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    {cartCount === 1 ? <Trash2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                                </button>
                                <span className="px-4 font-bold text-gray-900 text-sm whitespace-nowrap">
                                    {free > 0 ? `${paid} paying + ${free} FREE 🎁` : `${cartCount} in cart`}
                                </span>
                                <button
                                    onClick={e => { e.stopPropagation(); confirmAddToCart('Warehouse'); }}
                                    className="px-5 h-full flex items-center justify-center hover:bg-gray-100 border-l border-gray-200 text-gray-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); navigate('/cart'); }}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {free > 0 ? `Buy ${paid} → Get ${free} FREE 🎁` : `Buy ${cartCount} → Add 1 for FREE!`}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={e => { e.stopPropagation(); confirmAddToCart('Warehouse'); }}
                                className="flex-1 border-2 border-gray-900 text-gray-900 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all font-bold text-base flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); confirmAddToCart('Warehouse'); navigate('/cart'); }}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Buy at ₹{product.price} 🎁
                            </button>
                        </div>
                    )}
                    {cartCount > 0 && free === 0 && (
                        <p className="text-center text-xs text-green-600 font-semibold mt-1">
                            Add 1 more to unlock a FREE unit! 🎁
                        </p>
                    )}
                    {free > 0 && (
                        <p className="text-center text-xs text-green-600 font-semibold mt-1">
                            🎉 You're getting {free} unit{free > 1 ? 's' : ''} FREE!
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
