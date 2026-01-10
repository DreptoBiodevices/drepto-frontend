
import React, { useEffect, useState } from 'react';
import { loadLabTests } from './admin/LabTestData';
import { useNavigate } from 'react-router-dom';

const PopularLabTests: React.FC = () => {
    const [tests, setTests] = useState<any[]>([]);
    const navigate = useNavigate();

    // useEffect removed as per user request to disable API calling
    // useEffect(() => {
    //     const all = loadLabTests();
    //     setTests(all.slice(0, 3)); // Top 3
    // }, []);

    if (tests.length === 0) return null;

    return (
        <section className="py-16 bg-blue-50/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-dark-blue">Popular Diagnostic Tests</h2>
                    <p className="text-gray-500 mt-2">Accurate results from certified laboratories</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tests.map((test, idx) => (
                        <div
                            key={test.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {test.category || 'Health Check'}
                                </div>
                                <span className="text-sm text-gray-400">{test.reportTime}</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">{test.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{test.description || 'Comprehensive health screening and report.'}</p>

                            {test.parameters && test.parameters.length > 0 && (
                                <ul className="mb-6 space-y-2">
                                    {test.parameters.slice(0, 3).map((p: string, i: number) => (
                                        <li key={i} className="flex items-center text-sm text-gray-600">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                            {p}
                                        </li>
                                    ))}
                                    {test.parameters.length > 3 && (
                                        <li className="text-xs text-gray-400 pl-4">+{test.parameters.length - 3} more parameters</li>
                                    )}
                                </ul>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                    <span className="text-2xl font-bold text-dark-blue">₹{test.price}</span>
                                    {test.mrp > test.price && (
                                        <span className="text-sm text-gray-400 line-through ml-2">₹{test.mrp}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularLabTests;
