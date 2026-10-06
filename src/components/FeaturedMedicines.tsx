
import React, { useEffect, useState } from 'react';
import { loadMedicines } from './admin/MedicineData';
import { useNavigate } from 'react-router-dom';

const FeaturedMedicines: React.FC = () => {
    const [medicines, setMedicines] = useState<any[]>([]);
    const navigate = useNavigate();

    // useEffect removed as per user request to disable API calling
    // useEffect(() => {
    //     const all = loadMedicines();
    //     // Take first 4 or random 4
    //     setMedicines(all.slice(0, 4));
    // }, []);

    if (medicines.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-dark-blue">Featured Medicines</h2>
                        <p className="text-gray-500 mt-2">Top health products for you</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden md:flex items-center text-primary font-semibold hover:gap-2 transition-all"
                    >
                        View All <span className="ml-1">→</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 overflow-x-auto">
                    {medicines.map((med, idx) => (
                        <div
                            key={med.id}
                            className="relative h-80 rounded overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300 animate-fade-in-up flex-shrink-0"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                            onClick={() => navigate('/login')}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                {med.imageUrl ? (
                                    <img 
                                        src={med.imageUrl} 
                                        alt={med.name} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div 
                                        className="h-full w-full bg-cover bg-center"
                                        style={{ 
                                            backgroundImage: `url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=600&fit=crop&crop=center)` 
                                        }}
                                    />
                                )}
                            </div>
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
                            
                            {/* Content */}
                            <div className="relative h-full p-4 flex flex-col justify-end text-white">
                                {/* Brand - shows on hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded font-medium">
                                        {med.brand}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-1 group-hover:mb-3 transition-all duration-300">
                                    {med.name}
                                </h3>
                                
                                {/* Price */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-bold">₹{med.price}</span>
                                    {med.mrp > med.price && (
                                        <span className="text-sm line-through opacity-75">₹{med.mrp}</span>
                                    )}
                                </div>
                                
                                {/* Description - shows on hover */}
                                <p className="text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 leading-relaxed line-clamp-2">
                                    {med.description || 'Premium quality medicine for your health needs'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-primary font-semibold hover:underline"
                    >
                        View All Medicines
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedMedicines;
