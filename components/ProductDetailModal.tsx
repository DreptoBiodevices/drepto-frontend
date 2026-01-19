import React from 'react';
import { X, ShoppingCart, Leaf, AlertCircle, BookOpen, Check } from 'lucide-react';

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

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row my-8">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md hover:bg-white rounded-full text-gray-800 z-20 transition-colors shadow-sm"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-50 relative overflow-y-auto md:h-auto h-72">
                    {product.images?.[0] && (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* If we had multiple images we could show a gallery here */}
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-white">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {product.category}
                        </span>
                        {discount > 0 && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {discount}% OFF
                        </span>}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>

                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-4xl font-bold text-gray-900">
                            {/* ${product.price} */}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                            {/* ${product.mrp} */}
                        </span>
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8 space-y-6">
                        <div>
                            <h3 className="text-gray-900 font-semibold mb-2 text-lg">Overview</h3>
                            <p>{product.description}</p>
                        </div>

                        {product.detailedDescription && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-blue-900 italic">"{product.detailedDescription}"</p>
                            </div>
                        )}

                        {product.benefits && product.benefits.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" /> Benefits
                                </h3>
                                <ul className="grid grid-cols-1 gap-2">
                                    {product.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.ingredients && product.ingredients.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-emerald-600" /> Key Ingredients
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.ingredients.map((ing, idx) => (
                                        <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-medium border border-emerald-100">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sideEffects && product.sideEffects.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" /> Side Effects & Precautions
                                </h3>
                                <ul className="space-y-1 text-gray-500">
                                    {product.sideEffects.map((effect, idx) => (
                                        <li key={idx}>• {effect}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.developmentStory && (
                            <div className="border-t pt-4">
                                <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> The Story
                                </h3>
                                <p className="text-gray-500 italic text-sm">{product.developmentStory}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
                        <p className="text-gray-600 text-sm mt-2 text-center font-bold">*Only Shipping Charges Applies</p>
                        <button
                            onClick={() => {
                                onAddToCart(product);
                                onClose();
                            }}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-orange-500 transition-all shadow-lg flex items-center justify-center gap-2 font-bold text-lg group active:scale-[0.98]"
                        >

                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Get Free Samples
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
