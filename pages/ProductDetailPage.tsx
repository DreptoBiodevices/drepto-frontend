import React, { useState, useEffect, useRef } from 'react';
import { 
    ShoppingCart, Leaf, BookOpen, Star, Camera, Video, Trash2, Plus, Minus, Edit, X, 
    Check, Sparkles, Clock, AlertTriangle, Layers, Award, Tag, Box, HeartHandshake, ShieldCheck,
    ChevronRight, ArrowRight
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, ProductService } from '../lib/api_controller';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calculateItemOfferPricing, resolveItemOffer, getAutoFreeUnitsToAdd } from '../lib/offerCalculator';

export interface PackageDetail {
    length?: number;   // cm
    breadth?: number;  // cm
    height?: number;   // cm
    weight?: number;   // grams
}

export type OfferType = 'BOGO' | 'PERCENTAGE' | 'FLAT';

export interface ProductOffer {
    title?: string;
    description?: string;
    type?: OfferType;
    buyQuantity?: number;
    getFreeQuantity?: number;
    discountPercentage?: number;
    flatDiscount?: number;
    minQuantity?: number;
    isActive?: boolean;
}

export interface Product {
    _id?: string;
    /* ── Core Info ── */
    name: string;
    description: string;
    detailedDescription?: string;
    /* ── Pricing ── */
    price: number;
    mrp: number;
    offerDescription?: string;      // e.g. "Buy 2 Get 1 Free"
    offer?: ProductOffer;
    /* ── Media ── */
    images: string[];
    /* ── Classification ── */
    category: string;
    quantity?: string;              // e.g. "500ml", "100 tablets"
    form?: string;                  // e.g. "Tablet", "Liquid", "Cream"
    containerType?: string;         // e.g. "Bottle", "Blister Pack", "Tube"
    applicationArea?: string;       // e.g. "Face", "Body", "Scalp"
    packOf?: number;                // e.g. 1, 3, 6
    idealsFor?: string;             // e.g. "Men", "Women", "All Skin Types"
    licenseNumber?: string;         // Drug / FSSAI / manufacturing licence
    itemIncluded?: string[];        // e.g. ["1 Bottle", "1 Dropper"]
    /* ── Product Details ── */
    keyFeatures?: string[];         // Bullet-point feature highlights
    keySpecs?: string[];            // Technical specs, e.g. ["SPF 50", "pH 5.5"]
    composition?: string[];         // Active ingredients / formula breakdown
    ingredients?: string[];         // Full ingredient list
    benefits?: string[];
    sideEffects?: string[];
    developmentStory?: string;
    /* ── Shelf Life ── */
    maximumShelfLife?: string;      // e.g. "24 months from manufacture date"
    /* ── Package Details ── */
    packageDetail?: PackageDetail;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, setAuthModalView } = useAuth();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'safety'>('overview');
    
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '', images: [], videos: [] } as any);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [notification, setNotification] = useState('');
    const [selectedPack, setSelectedPack] = useState<number>(1);

    const reviewsSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            ProductService.getProductById(id)
                .then(res => {
                    setProduct(res.data);
                    if (res.data?.packOf && [1, 2, 3, 4].includes(res.data.packOf)) {
                        setSelectedPack(res.data.packOf);
                    }
                })
                .catch(err => console.error("Failed to fetch product", err))
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

    const discount = product.mrp && product.price && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
        : '5.0';

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');
        const offer = resolveItemOffer(product);
        let countToRemove = 1;
        if (offer && offer.type === 'BOGO') {
            const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
            const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
            const bundle = buyQty + freeQty;
            if (cartCount % bundle === 0) {
                countToRemove = bundle;
            } else {
                countToRemove = cartCount % bundle;
            }
        }

        for (let i = 0; i < countToRemove; i++) {
            const index = currentCart.findLastIndex((item: any) => item.name === product.name);
            if (index !== -1) {
                currentCart.splice(index, 1);
            }
        }
        localStorage.setItem('patient_cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cart:updated'));
    };

    const confirmAddToCart = (source: 'IIT Bombay' | 'Warehouse' = 'Warehouse', count: number = (cartCount === 0 ? selectedPack : 1)) => {
        if (!user) {
            setAuthModalView('login');
            return;
        }
        const productWithSource = { ...product, shippingSource: source, packOf: selectedPack };
        const currentCart = JSON.parse(localStorage.getItem('patient_cart') || '[]');

        const offer = resolveItemOffer(product);
        let itemsToAdd = count;
        if (offer && offer.type === 'BOGO') {
            const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
            const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
            if (cartCount === 0) {
                const bundles = Math.floor(count / buyQty);
                itemsToAdd = count + (bundles * freeQty);
            } else {
                itemsToAdd = buyQty + freeQty;
            }
        }

        const newItems = Array.from({ length: itemsToAdd }, (_, i) => ({
            ...productWithSource,
            isFreeProduct: offer && offer.type === 'BOGO' && i >= (offer.buyQuantity || 1)
        }));
        const updatedCart = [...currentCart, ...newItems];
        localStorage.setItem('patient_cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cart:updated'));
        
        if (itemsToAdd > count) {
            setNotification(`Added to cart + ${itemsToAdd - count} FREE product auto-added! 🎁`);
        } else if (count > 1) {
            setNotification(`Added Pack of ${count} to cart!`);
        } else {
            setNotification('Added to cart!');
        }
        setTimeout(() => setNotification(''), 1500);
    };

    const scrollToReviews = () => {
        reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const offerPricing = calculateItemOfferPricing(product, cartCount || 1);
    const paidUnits = offerPricing.paidUnits;
    const freeUnits = offerPricing.freeUnits;
    const packPricing = calculateItemOfferPricing(product, selectedPack);

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
            <Navbar />
            
            {notification && (
                <div className="fixed top-24 right-4 bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-xl z-50 animate-bounce-in flex items-center gap-2 text-sm font-semibold">
                    <Check className="w-4 h-4" /> {notification}
                </div>
            )}

            <main className="flex-grow pt-20 pb-12 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
                
                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 px-1">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <Link to="/our-products" className="hover:text-primary transition-colors">Our Products</Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-800 font-semibold truncate max-w-xs sm:max-w-md">{product.name}</span>
                </nav>

                {/* ── Main Product Card (Optimized Screen Space) ── */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
                    
                    {/* ── LEFT COLUMN (5 of 12 cols): Image Gallery & Fast Facts Bento ── */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between gap-4">
                        
                        {/* Image Viewer */}
                        <div className="relative rounded-2xl bg-white p-3 border border-gray-100/80 shadow-xs flex flex-col items-center">
                            {/* Badges Overlay */}
                            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center">
                                <span className="bg-primary/10 text-primary border border-primary/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                    {product.category}
                                </span>
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
                                        {discount}% OFF
                                    </span>
                                )}
                            </div>

                            <span className="absolute top-3 right-3 z-10 hidden sm:inline-flex items-center gap-1 bg-white/90 border border-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
                                <Award className="w-3 h-3 text-amber-500" /> IIT Bombay SINE
                            </span>

                            {/* Main Image */}
                            <div className="w-full h-64 sm:h-72 xl:h-80 flex items-center justify-center p-2 overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[activeImageIndex] || product.images[0]}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-300">
                                        <Leaf className="w-16 h-16 opacity-40 mb-2" />
                                        <p className="text-xs">No image uploaded</p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails row */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 overflow-x-auto w-full justify-center">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                                                activeImageIndex === idx ? 'border-primary ring-2 ring-primary/20 shadow-xs' : 'border-gray-200 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt="thumbnail" className="w-full h-full object-cover bg-white" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fast-Facts Bento Grid (Space Optimized: Puts 6 specs right under image) */}
                        <div className="bg-slate-50/80 rounded-2xl p-3 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Product Specifications</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-[10px] text-gray-400 block font-medium">Quantity / Pack</span>
                                    <span className="text-xs font-bold text-gray-800 truncate block">
                                        {product.quantity ? `${product.quantity} · Pack of ${selectedPack}` : `Pack of ${selectedPack}`}
                                    </span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-[10px] text-gray-400 block font-medium">Dosage Form</span>
                                    <span className="text-xs font-bold text-gray-800 truncate block">
                                        {product.form || 'Transdermal'}
                                    </span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-[10px] text-gray-400 block font-medium">Application Area</span>
                                    <span className="text-xs font-bold text-gray-800 truncate block">
                                        {product.applicationArea || 'External / Skin'}
                                    </span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-[10px] text-gray-400 block font-medium">Ideal For</span>
                                    <span className="text-xs font-bold text-gray-800 truncate block">
                                        {product.idealsFor || 'All Adults'}
                                    </span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-[10px] text-gray-400 block font-medium">Shelf Life</span>
                                    <span className="text-xs font-bold text-gray-800 truncate block">
                                        {product.maximumShelfLife || '24 Months'}
                                    </span>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-[10px] text-gray-400 block font-medium">Dimensions & Wt</span>
                                    <span className="text-xs font-bold text-gray-800 truncate block">
                                        {product.packageDetail?.length 
                                            ? `${product.packageDetail.length}×${product.packageDetail.breadth || 0}×${product.packageDetail.height || 0}cm`
                                            : (product.containerType || 'Standard')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Bar */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 px-2 py-1 bg-white rounded-xl border border-gray-100">
                            <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Lab Tested</span>
                            <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-blue-600" /> Fast Dispatch</span>
                            <span className="flex items-center gap-1 font-medium"><HeartHandshake className="w-3.5 h-3.5 text-indigo-600" /> 100% Genuine</span>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN (7 of 12 cols): Pricing, Buy Actions, & Tabbed Details ── */}
                    <div className="lg:col-span-7 p-5 sm:p-7 xl:p-8 flex flex-col justify-between">
                        
                        <div>
                            {/* Product Title & Review Snip */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                        Drepto Clinical Biodevice
                                    </span>
                                    <button 
                                        onClick={scrollToReviews} 
                                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 transition-colors"
                                    >
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        <span>{averageRating}</span>
                                        <span className="text-gray-400 font-normal">({reviews.length} reviews)</span>
                                    </button>
                                </div>

                                <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Pricing & Offer Banner Card */}
                            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-gray-50 to-emerald-50/30 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-baseline gap-2.5">
                                        <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                                            ₹{product.price || 0}
                                        </span>
                                        {product.mrp && product.mrp > (product.price || 0) && (
                                            <span className="text-base text-gray-400 line-through font-semibold">
                                                ₹{product.mrp}
                                            </span>
                                        )}
                                        {discount > 0 && (
                                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                                Save {discount}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Inclusive of all taxes · Free delivery on eligible orders</p>
                                </div>

                                {/* Dynamic Offer Badge (Design 2: Mint pill with Tag icon) */}
                                {(product.offer?.isActive !== false && (product.offer?.title || product.offerDescription)) && (
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs shrink-0">
                                        <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <span>{product.offer?.title || product.offerDescription || 'Buy 2 Get 1 Free'}</span>
                                    </div>
                                )}
                            </div>

                            {/* ── Pack Selection Selector (Selected Pack of: X) ── */}
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-bold text-gray-800">
                                            Selected Pack of: <span className="font-semibold text-gray-900 ml-1">{selectedPack}</span>
                                        </div>
                                        {(() => {
                                            const autoFree = getAutoFreeUnitsToAdd(product, 0, selectedPack);
                                            if (autoFree > 0) {
                                                return (
                                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                                                        🎁 +{autoFree} FREE product auto-added
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                    {selectedPack > 1 && (
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                            ₹{(product.price * selectedPack)} (₹{product.price}/unit)
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {[1, 2, 3, 4].map((pack) => {
                                        const isSelected = selectedPack === pack;
                                        return (
                                            <button
                                                key={pack}
                                                type="button"
                                                onClick={() => setSelectedPack(pack)}
                                                className={`relative w-14 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                                                    isSelected
                                                        ? 'bg-[#1e1e20] text-white font-bold text-base shadow-md ring-1 ring-black/5'
                                                        : 'bg-[#f3f4f6] hover:bg-[#eceef1] text-[#6b7280] font-medium text-sm border border-dashed border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                {!isSelected && (
                                                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[1px] bg-gray-300/70 pointer-events-none" />
                                                )}
                                                <span className="relative z-10 select-none">{pack}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Direct Purchase Action Bar (Right below price & pack selection, zero scrolling needed!) ── */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                    
                                    {/* Quantity Counter or Add button */}
                                    <div className="sm:col-span-5">
                                        {cartCount > 0 ? (
                                            <div className="w-full flex items-center justify-between border-2 border-primary rounded-xl h-[48px] bg-white px-2 shadow-xs">
                                                <button 
                                                    onClick={handleDecrement}
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-700 hover:text-red-600 transition-colors"
                                                    title="Decrease"
                                                >
                                                    {cartCount === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                </button>
                                                <div className="text-center">
                                                    <span className="font-extrabold text-gray-900 text-base">{cartCount} in Cart</span>
                                                    {freeUnits > 0 ? (
                                                        <span className="block text-[10px] font-bold text-emerald-600 leading-none">
                                                            {paidUnits} paid + {freeUnits} FREE
                                                        </span>
                                                    ) : (cartCount > 0 && offerPricing.discount > 0) ? (
                                                        <span className="block text-[10px] font-bold text-emerald-600 leading-none">
                                                            Save ₹{offerPricing.discount}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); confirmAddToCart('Warehouse', 1); }}
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                                                    title="Increase"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); confirmAddToCart('Warehouse', selectedPack); }}
                                                className="w-full h-[48px] bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group active:scale-[0.98]"
                                            >
                                                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                {(() => {
                                                    const autoFree = getAutoFreeUnitsToAdd(product, 0, selectedPack);
                                                    return `Add Pack of ${selectedPack}${autoFree > 0 ? ` (+${autoFree} FREE 🎁)` : ''} to Cart`;
                                                })()}
                                            </button>
                                        )}
                                    </div>

                                    {/* Instant Buy Now Button */}
                                    <div className="sm:col-span-7">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (cartCount === 0) confirmAddToCart('Warehouse', selectedPack);
                                                navigate('/cart');
                                            }}
                                            className="w-full h-[48px] bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                                        >
                                            <span>
                                                {cartCount === 0 
                                                    ? (() => {
                                                        const autoFree = getAutoFreeUnitsToAdd(product, 0, selectedPack);
                                                        return `Buy Now · Pack of ${selectedPack}${autoFree > 0 ? ` (+${autoFree} FREE 🎁)` : ''} (₹${packPricing.finalTotal})`;
                                                      })()
                                                    : `Proceed to Checkout (${cartCount} item${cartCount > 1 ? 's' : ''} · ₹${calculateItemOfferPricing(product, cartCount).finalTotal})`}
                                            </span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Tabbed Product Information (Space-optimized: replaces 10 stacked sections!) ── */}
                            <div className="mt-6">
                                {/* Tab Switcher */}
                                <div className="flex border-b border-gray-200 gap-6">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`pb-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                                            activeTab === 'overview'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Overview & Specs
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('ingredients')}
                                        className={`pb-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                                            activeTab === 'ingredients'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        <Leaf className="w-4 h-4" />
                                        Formula & Ingredients
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('safety')}
                                        className={`pb-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                                            activeTab === 'safety'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        Benefits & Safety
                                    </button>
                                </div>

                                {/* Tab 1: Overview & Specs */}
                                {activeTab === 'overview' && (
                                    <div className="pt-4 space-y-4 animate-fade-in text-sm">
                                        <p className="text-gray-600 leading-relaxed">
                                            {product.description}
                                        </p>

                                        {product.detailedDescription && (
                                            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 italic font-medium leading-relaxed">
                                                "{product.detailedDescription}"
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            {/* Key Features */}
                                            {product.keyFeatures && product.keyFeatures.length > 0 && (
                                                <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
                                                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <Check className="w-3.5 h-3.5 text-primary" /> Key Features
                                                    </h4>
                                                    <ul className="space-y-1.5 text-xs text-gray-600">
                                                        {product.keyFeatures.map((feat, idx) => (
                                                            <li key={idx} className="flex items-start gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                                                <span>{feat}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Key Specs & Items Included */}
                                            <div className="space-y-3">
                                                {product.keySpecs && product.keySpecs.length > 0 && (
                                                    <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100">
                                                        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">
                                                            Technical Specs
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {product.keySpecs.map((spec, idx) => (
                                                                <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                                                    {spec}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {product.itemIncluded && product.itemIncluded.length > 0 && (
                                                    <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100">
                                                        <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                                            <Box className="w-3.5 h-3.5" /> Items Included
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {product.itemIncluded.map((item, idx) => (
                                                                <span key={idx} className="bg-white border border-purple-200 text-purple-800 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab 2: Formula & Ingredients */}
                                {activeTab === 'ingredients' && (
                                    <div className="pt-4 space-y-4 animate-fade-in text-sm">
                                        {/* Key Ingredients */}
                                        {product.ingredients && product.ingredients.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Active Ingredients
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {product.ingredients.map((ing, idx) => (
                                                        <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-3 py-1 rounded-lg text-xs font-semibold">
                                                            {ing}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Composition */}
                                        {product.composition && product.composition.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <Layers className="w-3.5 h-3.5 text-teal-600" /> Formulation Composition
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {product.composition.map((comp, idx) => (
                                                        <span key={idx} className="bg-teal-50 text-teal-800 border border-teal-200/60 px-3 py-1 rounded-lg text-xs font-medium">
                                                            {comp}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Development Story */}
                                        {product.developmentStory && (
                                            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5">
                                                <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Research & Development Story
                                                </h4>
                                                <p className="text-gray-700 italic text-xs leading-relaxed">
                                                    {product.developmentStory}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tab 3: Benefits & Safety */}
                                {activeTab === 'safety' && (
                                    <div className="pt-4 space-y-4 animate-fade-in text-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Benefits */}
                                            {product.benefits && product.benefits.length > 0 && (
                                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
                                                    <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Benefits
                                                    </h4>
                                                    <ul className="space-y-1.5 text-xs text-emerald-800">
                                                        {product.benefits.map((b, idx) => (
                                                            <li key={idx} className="flex items-start gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                                                <span>{b}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Side Effects / Precautions */}
                                            {product.sideEffects && product.sideEffects.length > 0 && (
                                                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5">
                                                    <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Safety & Precautions
                                                    </h4>
                                                    <ul className="space-y-1.5 text-xs text-amber-800">
                                                        {product.sideEffects.map((se, idx) => (
                                                            <li key={idx} className="flex items-start gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                                                                <span>{se}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {product.licenseNumber && (
                                            <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-gray-600">
                                                <span className="font-medium">Regulatory / Manufacturing License:</span>
                                                <span className="font-mono font-bold text-gray-800">{product.licenseNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guarantee Footer */}
                        <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                            <span>Product SKU: {product._id ? product._id.slice(-8).toUpperCase() : 'DB-PROD'}</span>
                            <span className="text-emerald-600 font-semibold">✓ In Stock &amp; Ready for Delivery</span>
                        </div>

                    </div>
                </div>

                {/* ── Reviews & Community Rating Section (Full-Width Below Showcase) ── */}
                <div ref={reviewsSectionRef} className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b border-gray-100 gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                Customer Reviews &amp; Experiences
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Real verified feedback from patients and healthcare professionals
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className="text-2xl font-black text-gray-900">{averageRating}</span>
                                <span className="text-xs text-gray-400"> / 5.0</span>
                                <p className="text-[11px] text-gray-500 font-medium">{reviews.length} total reviews</p>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Write / Edit Review Form (4 cols) */}
                        <div className="lg:col-span-4 bg-slate-50/70 p-5 rounded-2xl border border-gray-200/80 h-fit">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">
                                {editingReviewId !== null ? "Edit Your Review" : "Write a Customer Review"}
                            </h3>

                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star} 
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        type="button"
                                    >
                                        <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    </button>
                                ))}
                                <span className="text-xs font-semibold text-gray-600 ml-2">
                                    {['Terrible', 'Poor', 'Average', 'Good', 'Excellent!'][reviewForm.rating - 1]}
                                </span>
                            </div>

                            <textarea 
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-3"
                                placeholder="Describe your experience with this product, relief time, and results..."
                                rows={3}
                                value={reviewForm.reviewText}
                                onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                            />
                            
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-1.5">
                                    <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs">
                                        <Camera className="w-3.5 h-3.5" /> Photo
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if(file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => setReviewForm({...reviewForm, images: [...reviewForm.images, e.target?.result as string]});
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </label>
                                    <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs">
                                        <Video className="w-3.5 h-3.5" /> Video
                                        <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if(file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => setReviewForm({...reviewForm, videos: [...reviewForm.videos, e.target?.result as string]});
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </label>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {editingReviewId && (
                                        <button 
                                            onClick={() => {
                                                setEditingReviewId(null);
                                                setReviewForm({rating: 5, reviewText: '', images: [], videos: []});
                                            }}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors"
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button 
                                        disabled={isSubmitting}
                                        type="button"
                                        className="bg-primary hover:bg-primary/90 text-white font-bold py-1.5 px-4 rounded-lg text-xs transition-colors disabled:opacity-50 shadow-xs"
                                        onClick={async () => {
                                            if(!reviewForm.reviewText?.trim() || !product?._id) return;
                                            setIsSubmitting(true);
                                            try {
                                                if (!user) {
                                                    setAuthModalView('login');
                                                    return;
                                                }
                                                const payload = {
                                                    productId: product._id,
                                                    userId: user.id,
                                                    rating: reviewForm.rating,
                                                    reviewText: reviewForm.reviewText,
                                                    images: reviewForm.images,
                                                    videos: reviewForm.videos
                                                };
                                                
                                                if (editingReviewId) {
                                                    const res = await api.put(`/reviews/${editingReviewId}`, payload);
                                                    setReviews(reviews.map(r => r._id === editingReviewId ? { ...r, ...res.data, userId: r.userId } : r));
                                                } else {
                                                    const res = await api.post('/reviews', payload);
                                                    const newReview = {
                                                        ...res.data,
                                                        userId: {
                                                            _id: user.id,
                                                            firstName: user.firstName,
                                                            lastName: user.lastName
                                                        }
                                                    };
                                                    setReviews([newReview, ...reviews]);
                                                }
                                                
                                                setReviewForm({rating: 5, reviewText: '', images: [], videos: []});
                                                setEditingReviewId(null);
                                            } catch (err) {
                                                console.error("Failed to submit review", err);
                                                alert("Failed to submit review");
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }}
                                    >
                                        {isSubmitting ? "Submitting..." : (editingReviewId ? "Update" : "Post")}
                                    </button>
                                </div>
                            </div>

                            {/* Attachments preview */}
                            {(reviewForm.images.length > 0 || reviewForm.videos.length > 0) && (
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    {reviewForm.images.map((img: string, idx: number) => (
                                        <div key={idx} className="relative inline-block">
                                            <div 
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-0.5 cursor-pointer z-10" 
                                                onClick={() => setReviewForm({...reviewForm, images: reviewForm.images.filter((_: any, i: number) => i !== idx)})}
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                            <img src={img} className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                                        </div>
                                    ))}
                                    {reviewForm.videos.map((vid: string, idx: number) => (
                                        <div key={idx} className="relative inline-block">
                                            <div 
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-0.5 cursor-pointer z-10" 
                                                onClick={() => setReviewForm({...reviewForm, videos: reviewForm.videos.filter((_: any, i: number) => i !== idx)})}
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                            <video src={vid} className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reviews Grid (8 cols) */}
                        <div className="lg:col-span-8">
                            {reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reviews.map((r) => (
                                        <div key={r._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:border-gray-200 transition-colors">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900 text-sm">
                                                        {r.userId?.firstName ? `${r.userId.firstName} ${r.userId.lastName || ''}`.trim() : "Verified Patient"}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, idx) => (
                                                                <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                        {user && (r.userId?._id === user.id || r.userId === user.id) && (
                                                            <div className="flex items-center gap-1 ml-1">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingReviewId(r._id);
                                                                        setReviewForm({ rating: r.rating, reviewText: r.reviewText, images: r.images || [], videos: r.videos || [] });
                                                                    }} 
                                                                    className="p-1 text-gray-400 hover:text-blue-500 rounded"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                </button>
                                                                <button 
                                                                    onClick={async () => {
                                                                        if (window.confirm('Delete this review?')) {
                                                                            try {
                                                                                await api.delete(`/reviews/${r._id}`);
                                                                                setReviews(reviews.filter(rev => rev._id !== r._id));
                                                                            } catch(e) { alert('Failed to delete review'); }
                                                                        }
                                                                    }} 
                                                                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{r.reviewText}</p>
                                            </div>

                                            {/* Media attachments */}
                                            {((r.images && r.images.length > 0) || (r.videos && r.videos.length > 0)) && (
                                                <div className="mt-3 pt-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
                                                    {r.images?.map((img: string, idx: number) => (
                                                        <img key={idx} src={img} alt="review media" className="h-16 w-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                                                    ))}
                                                    {r.videos?.map((vid: string, idx: number) => (
                                                        <video key={idx} src={vid} controls className="h-16 w-20 rounded-lg object-cover border border-gray-100 shrink-0" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
                                    <Star className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-700">No reviews yet for this product</p>
                                    <p className="text-xs text-gray-400 mt-1">Be the first verified customer to share your healing experience!</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailPage;
