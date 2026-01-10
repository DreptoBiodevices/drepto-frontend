import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetailModal, { Product } from '../components/ProductDetailModal';

// Shared product data (mock for now, ideally this comes from a shared constant or API)
const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Drepto MenstroHerb Sheet",
        description: "For relief from cramps during those difficult days. 12 Hours, Ultimate Comfort.",
        detailedDescription: "The Drepto MenstroHerb Sheet is a powerful herbal pain-relieving patch designed specifically for menstrual cramps. Infused with natural essential oils, it provides discreet, long-lasting relief without the need for pills.",
        price: 45,
        mrp: 100,
        images: ["https://images.unsplash.com/photo-1544367563-12123d832d34?auto=format&fit=crop&q=80&w=500"], // Placeholder image
        category: "Pain Relief",
        ingredients: ["Menthol", "Eucalyptus Oil", "Camphor", "Wintergreen Oil", "Capsicum Extract"],
        benefits: [
            "12 hours of continuous relief",
            "100% Herbal & Natural",
            "No side effects like oral painkillers",
            "Discreet and easy to apply",
            "Instant heating sensation"
        ],
        sideEffects: [
            "Mild skin redness (rare)",
            "Warm sensation is normal",
            "Do not use on open wounds"
        ],
        developmentStory: "Developed after extensive research into traditional herbal remedies, MenstroHerb combines ancient wisdom with modern transdermal delivery technology."
    },
    {
        id: 2,
        name: "Vitamin C Radiance Serum",
        description: "Brightens skin and reduces dark spots. 20% Vitamin C + Hyaluronic Acid.",
        detailedDescription: "Our Vitamin C Radiance Serum is a highly concentrated formula that targets hyperpigmentation and dullness. It boosts collagen production and protects against sun damage for a youthful glow.",
        price: 35,
        mrp: 60,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=500"],
        category: "Skin Care",
        ingredients: ["L-Ascorbic Acid (Vitamin C)", "Hyaluronic Acid", "Ferulic Acid", "Vitamin E", "Aloe Vera"],
        benefits: [
            "Brightens complexion",
            "Fades dark spots",
            "Hydrates and plumps skin",
            "Reduces fine lines",
            "Anti-oxidant protection"
        ],
        sideEffects: [
            "Mild tingling on first use",
            "Always wear sunscreen during the day"
        ],
        developmentStory: "Formulated by top dermatologists to provide a stable, potent Vitamin C solution that doesn't oxidize quickly."
    },
    {
        id: 3,
        name: "Herbal Immunity Capsules",
        description: "Boost your daily defense naturally. Ashwagandha, Giloy & Tulsi.",
        detailedDescription: "A synergistic blend of ayurvedic herbs known for their immune-boosting properties. These capsules help adapt to stress and build resistance against common infections.",
        price: 25,
        mrp: 40,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=500"],
        category: "Supplements",
        ingredients: ["Ashwagandha Root Extract", "Giloy Stem Extract", "Tulsi Leaf Extract", "Black Pepper", "Turmeric"],
        benefits: [
            "Strengthens immune system",
            "Reduces stress and anxiety",
            "Improves energy levels",
            "Supports respiratory health",
            "Natural detoxifier"
        ],
        sideEffects: [
            "None reported when taken as directed",
            "Consult physician if pregnant"
        ],
        developmentStory: "Inspired by the Rasayana branch of Ayurveda, focused on rejuvenation and longevity."
    },
    {
        id: 4,
        name: "Digital Infrared Thermometer",
        description: "Non-contact, instant readings. FDA Approved accuracy.",
        detailedDescription: "Medical-grade non-contact thermometer for safe and hygienic temperature monitoring. Features a color-coded fever alarm and memory function for tracking trends.",
        price: 55,
        mrp: 85,
        images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=500"],
        category: "First Aid",
        ingredients: ["N/A - Medical Device"],
        benefits: [
            "1-second fast reading",
            "No skin contact needed",
            "Large backlit display",
            "Fever alarm alert",
            "Memory for last 30 readings"
        ],
        sideEffects: [
            "None"
        ],
        developmentStory: "Engineered for precision during critical health monitoring needs."
    },
    {
        id: 5,
        name: "Pure Plant Protein",
        description: "Pea & Brown Rice Isolate. Chocolate Flavor. 25g Protein.",
        detailedDescription: "A complete amino acid profile from plant sources. Easy to digest and free from soy, gluten, and dairy. Perfect for muscle recovery and daily nutrition.",
        price: 49,
        mrp: 75,
        images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=500"],
        category: "Nutrition",
        ingredients: ["Pea Protein Isolate", "Brown Rice Protein", "Cocoa Powder", "Stevia Extract", "Digestive Enzymes"],
        benefits: [
            "25g Protein per serving",
            "Zero bloating",
            "Sugar-free",
            "Vegan friendly",
            "Delicious taste"
        ],
        sideEffects: [
            "May cause fullness if consumed in excess"
        ],
        developmentStory: "Created for athletes who wanted a clean, plant-based alternative without compromising on performance or taste."
    },
    {
        id: 6,
        name: "Zen Yoga Mat",
        description: "Extra thick 6mm TPE mat with alignment lines. Eco-friendly.",
        detailedDescription: "Crafted from eco-friendly TPE material, this mat offers superior grip and cushioning. The laser-etched alignment lines help you perfect your posture.",
        price: 32,
        mrp: 50,
        images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=500"],
        category: "Fitness",
        ingredients: ["N/A - Fitness Gear"],
        benefits: [
            "Non-slip surface",
            "Joint protection cushioning",
            "Biodegradable material",
            "Lightweight & portable",
            "Alignment system"
        ],
        sideEffects: [
            "None"
        ],
        developmentStory: "Designed by yoga instructors to solve the common problems of slipping and poor alignment."
    }
];

const OurProductsPage: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [notification, setNotification] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('patient_cart');
            if (stored) setCart(JSON.parse(stored));
        } catch { }
    }, []);

    const addToCart = (product: Product) => {
        const newCart = [...cart, { ...product, id: Date.now() }]; // Unique ID for cart item
        setCart(newCart);
        localStorage.setItem('patient_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart:updated'));

        setNotification(`Added ${product.name} to cart`);
        setTimeout(() => setNotification(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our curated selection of top-quality wellness and healthcare essentials.
                    </p>
                </div>

                {notification && (
                    <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce-in">
                        {notification}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PRODUCTS.map(product => (
                        <div key={product.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 flex flex-col">
                            <div
                                className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                    {product.category}
                                </span>

                                {/* Overlay with view details button */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3
                                    className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-orange-500">${product.price}</span>
                                        <span className="text-xs text-gray-400 line-through">MRP ${product.mrp}</span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-orange-500 transition-colors shadow-md group-active:scale-95 flex items-center gap-2 font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-white border-t py-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Drepto. All rights reserved.</p>
                </div>
            </footer>

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
            />
        </div>
    );
};

export default OurProductsPage;
