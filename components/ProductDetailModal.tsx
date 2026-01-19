import React, { useState } from 'react';
import { X, ShoppingCart, Leaf, AlertCircle, BookOpen, Check, Truck, Building2 } from 'lucide-react';

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

    const [showShippingOptions, setShowShippingOptions] = useState(false);
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

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

                    {product.images?.[0] ? (
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                            />
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

                        {/* Price Block - Subtly present but can be highlighted if needed */}
                        {/* <div className="flex items-baseline gap-3 mt-4">
                            <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                            {product.mrp > product.price && (
                                <span className="text-xl text-gray-400 line-through">₹{product.mrp}</span>
                            )}
                        </div> */}
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

                        {/* Key Ingredients */}
                        {product.ingredients && product.ingredients.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-emerald-600" />
                                    Key Ingredients
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.ingredients.map((ing, idx) => (
                                        <span key={idx} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-default">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits Grid */}
                        {product.benefits && product.benefits.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    Benefits
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {product.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3.5 h-3.5 text-green-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Side Effects */}
                        {product.sideEffects && product.sideEffects.length > 0 && (
                            <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
                                <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Side Effects & Precautions
                                </h3>
                                <ul className="space-y-3">
                                    {product.sideEffects.map((effect, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                            <span>{effect}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Story */}
                        {product.developmentStory && (
                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-gray-900 font-bold text-lg mb-3">The Story</h3>
                                <p className="text-gray-500 italic text-sm leading-relaxed">{product.developmentStory}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
                        {/* <button
                            onClick={() => {
                                onAddToCart(product);
                                onClose();
                            }}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-orange-500 transition-all shadow-lg flex items-center justify-center gap-2 font-bold text-lg group active:scale-[0.98]"
                        >
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add to Cart - ${product.price}
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
