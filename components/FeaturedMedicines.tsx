
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
                        onClick={() => navigate('/auth')}
                        className="hidden md:flex items-center text-primary font-semibold hover:gap-2 transition-all"
                    >
                        View All <span className="ml-1">→</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {medicines.map((med, idx) => (
                        <div
                            key={med.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="h-40 bg-white rounded-lg flex items-center justify-center mb-4 overflow-hidden relative group">
                                {med.imageUrl ? (
                                    <img src={med.imageUrl} alt={med.name} className="h-full w-full object-contain p-2" />
                                ) : (
                                    <span className="text-4xl">💊</span>
                                )}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex-1">
                                <p className="text-xs text-primary font-medium mb-1">{med.brand}</p>
                                <h3 className="font-bold text-gray-800 line-clamp-1">{med.name}</h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{med.description || 'No description available'}</p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-bold text-dark-blue">₹{med.price}</span>
                                    {med.mrp > med.price && (
                                        <span className="text-xs text-gray-400 line-through ml-2">₹{med.mrp}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button
                        onClick={() => navigate('/auth')}
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
