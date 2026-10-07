

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { CITIES, LAB_TESTS_DATA, LAB_PACKAGES_DATA, LAB_REVIEWS } from '../constants';
import { LabTestDetail, LabPackageDetail } from '../types';
import { loadLabTests } from '../components/admin/LabTestData';


// --- Sub-Components to maintain cleaner code within the file ---

const HeaderIcon = ({ d }: { d: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

// 1. City Selector Overlay
const CitySelector: React.FC<{ current: string; onSelect: (id: string) => void; onClose: () => void }> = ({ current, onSelect, onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Choose your city</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Select to see labs & tests near you</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <HeaderIcon d="M18 6 6 18M6 6l12 12" />
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CITIES.map(city => (
                    <button
                        key={city.id}
                        onClick={() => { onSelect(city.id); onClose(); }}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all ${current === city.id ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-gray-100 text-gray-600 hover:border-teal-300 hover:bg-teal-50/50'}`}
                    >
                        {city.name}
                    </button>
                ))}
            </div>
        </div>
    </div>
);


// 2. Sidebar Component
const Sidebar: React.FC<{ active: string; onSelect: (view: string) => void }> = ({ active, onSelect }) => (
    <div className="hidden lg:block w-64 bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-fit sticky top-24 mt-20">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Browse Labs</h3>
        <div className="space-y-2">
            {[{ id: 'tests', label: 'Individual Tests' }, { id: 'packages', label: 'Health Packages' }, { id: 'cities', label: 'Top Cities' }].map(item => (
                <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${active === item.id ? 'bg-[#E7EEF8] text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    </div>
);

// 3. Detail View Component
const DetailView: React.FC<{ item: LabTestDetail | LabPackageDetail; type: 'test' | 'package'; onBack: () => void }> = ({ item, type, onBack }) => {
    const isTest = type === 'test';
    return (
        <div className="animate-fade-in-up">
            <button onClick={onBack} className="mb-4 text-sm text-teal-600 font-bold hover:underline flex items-center gap-1">
                <HeaderIcon d="m15 18-6-6 6-6" /> Back to {isTest ? 'Tests' : 'Packages'}
            </button>

            {/* Hero */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 mt-10">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                {item.rating} <span className="text-[10px]">★</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                            <span className="text-sm text-gray-400 line-through">₹{item.mrp}</span>
                            <span className="text-sm font-bold text-green-600">{item.discount} OFF</span>
                        </div>
                        <p className="text-xs text-gray-400">Inclusive of all taxes</p>
                    </div>
                    <div className="flex flex-col justify-end min-w-[200px]">
                        <button className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 mb-2">Book Now</button>
                        {!isTest && <p className="text-xs text-center text-gray-500">Ideal for: {(item as LabPackageDetail).idealFor}</p>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Facts */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Facts</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><HeaderIcon d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold">Report In</p><p className="text-sm font-semibold">{item.reportTime}</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><HeaderIcon d="M22 12h-4l-3 9L9 3l-3 9H2" /></div>
                                <div><p className="text-xs text-gray-500 uppercase font-bold">Fasting</p><p className="text-sm font-semibold">{item.fasting}</p></div>
                            </div>
                            {isTest && (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><HeaderIcon d="m19.07 10.93-1.41 1.41M2 6c.6.5 1.2 1 2.5 1s2.5-.5 2.5-1 .6-1 2.5-1 2.5.5 2.5 1 .6 1 2.5 1 2.5-.5 2.5-1 .6-1 2.5-1 2.5.5 2.5 1" /></div>
                                        <div><p className="text-xs text-gray-500 uppercase font-bold">Sample</p><p className="text-sm font-semibold">{(item as LabTestDetail).sampleType}</p></div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><HeaderIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" /></div>
                                        <div><p className="text-xs text-gray-500 uppercase font-bold">Tube</p><p className="text-sm font-semibold">{(item as LabTestDetail).tubeType}</p></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Included Tests */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">
                            {isTest ? `Test Parameters (${(item as LabTestDetail).parameters.length})` : `Tests Included (${(item as LabPackageDetail).testsIncluded.length})`}
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(isTest ? (item as LabTestDetail).parameters : (item as LabPackageDetail).testsIncluded).map((p, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Why it matters */}
                    {isTest && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-2">Why this test matters</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{(item as LabTestDetail).whyItMatters}</p>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Patient Reviews</h3>
                        <div className="space-y-4">
                            {LAB_REVIEWS.slice(0, 2).map(rev => (
                                <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-gray-800">{rev.userName}</span>
                                        <span className="text-xs text-gray-400">{rev.date}</span>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs mb-2">{'★'.repeat(rev.rating)}</div>
                                    <p className="text-sm text-gray-600 italic">"{rev.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* How it works sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm flex-shrink-0">1</div>
                                <div><h4 className="font-bold text-sm text-gray-800">Book Test</h4><p className="text-xs text-gray-500">Select your test and schedule a slot.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm flex-shrink-0">2</div>
                                <div><h4 className="font-bold text-sm text-gray-800">Sample Collection</h4><p className="text-xs text-gray-500">Phlebotomist visits your home for collection.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm flex-shrink-0">3</div>
                                <div><h4 className="font-bold text-sm text-gray-800">Get Report</h4><p className="text-xs text-gray-500">Receive digital report within 24 hours.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

const LabTestsPage: React.FC = () => {
    const [selectedCity, setSelectedCity] = useState<string>(() => {
        const storedLoc = localStorage.getItem('drepto_location');
        if (storedLoc) {
            const lowerLoc = storedLoc.toLowerCase();
            const matchedCity = CITIES.find(c => lowerLoc.includes(c.name.toLowerCase()));
            if (matchedCity) return matchedCity.id;
        }
        return 'mumbai';
    });
    const [showCitySelector, setShowCitySelector] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('drepto_location') && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const API_URL = import.meta.env.VITE_API_URL || 'https://api.dreptobiodevices.com';
                        const response = await fetch(`${API_URL}/location/geocode?lat=${latitude}&lng=${longitude}`);
                        const data = await response.json();
                        if (data && data.status === "OK" && data.results && data.results.length > 0) {
                            let cityStr = "";
                            const addressComponents = data.results[0].address_components;
                            const cityComponent = addressComponents.find((comp: any) => 
                                comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")
                            );
                            if (cityComponent) {
                                cityStr = cityComponent.long_name;
                            }
                            const matchedCity = CITIES.find(c => cityStr.toLowerCase().includes(c.name.toLowerCase()));
                            if (matchedCity) {
                                setSelectedCity(matchedCity.id);
                            }
                        }
                    } catch (error) {
                        console.error("Error auto-fetching city:", error);
                    }
                },
                () => {}, // Silently fail if permission denied
                { timeout: 5000 }
            );
        }
    }, []);
    const [view, setView] = useState<'home' | 'individual' | 'packages' | 'detail'>('home');
    const [selectedItem, setSelectedItem] = useState<LabTestDetail | LabPackageDetail | null>(null);
    const [detailType, setDetailType] = useState<'test' | 'package'>('test');
    const [tests, setTests] = useState<LabTestDetail[]>(LAB_TESTS_DATA as LabTestDetail[]);

    // Dummy Refs for Navbar
    const dummyRefs = { home: { current: null }, product: { current: null }, about: { current: null }, contact: { current: null } };

    const cityName = CITIES.find(c => c.id === selectedCity)?.name || 'Select City';

    const handleViewDetail = (item: LabTestDetail | LabPackageDetail, type: 'test' | 'package') => {
        setSelectedItem(item);
        setDetailType(type);
        setView('detail');
        window.scrollTo(0, 0);
    };

    // Load lab tests from localStorage, fallback to constants
    // useEffect removed as per user request to disable API calling
    // useEffect(() => {
    //     const load = () => {
    //         try {
    //             const items = loadLabTests();
    //             setTests(items && items.length ? items as LabTestDetail[] : LAB_TESTS_DATA as LabTestDetail[]);
    //         } catch {
    //             setTests(LAB_TESTS_DATA as LabTestDetail[]);
    //         }
    //     };
    //     load();
    //     const onUpdate = () => load();
    //     window.addEventListener('labtests:updated', onUpdate);
    //     window.addEventListener('storage', onUpdate as any);
    //     return () => {
    //         window.removeEventListener('labtests:updated', onUpdate);
    //         window.removeEventListener('storage', onUpdate as any);
    //     };
    // }, []);



    return (
        <div className="flex flex-col min-h-screen bg-[#F1F5F9]">
            {showCitySelector && <CitySelector current={selectedCity} onSelect={setSelectedCity} onClose={() => setShowCitySelector(false)} />}



            <Navbar sectionRefs={dummyRefs as any} />

            {/* Sub-Header / Module Nav */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-4">
                        {/* Tabs */}
                        {/* <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                             {['Medicine', 'Lab Tests', 'Health Blogs', 'PLUS', 'Value Store'].map((tab, i) => (
                                 <button key={tab} className={`whitespace-nowrap text-sm font-bold pb-1 border-b-2 transition-colors ${i === 1 ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>
                                     {tab}
                                 </button>
                             ))}
                         </div> */}
                        {/* City Selector Pill */}
                        <button onClick={() => setShowCitySelector(true)} className="flex items-center gap-2 bg-[#E7EEF8] px-4 py-2 rounded-full text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors self-start md:self-auto">
                            <span>Delivering to: {cityName}</span>
                            <HeaderIcon d="m6 9 6 6 6-6" />
                        </button>
                    </div>
                </div>
            </div>


            <main className="flex-grow container mx-auto px-4 lg:px-8 py-6 pb-24 min-h-[70vh]">
                <div className="mb-4">
                    <BackButton />
                </div>
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Navigation - Hidden on Detail View to give more space */}
                    {view !== 'detail' && (
                        <Sidebar
                            active={view === 'home' ? 'tests' : view === 'individual' ? 'tests' : view === 'packages' ? 'packages' : 'cities'}
                            onSelect={(v) => {
                                if (v === 'tests') setView('individual');
                                else if (v === 'packages') setView('packages');
                                else setView('home');
                            }}
                        />
                    )}

                    {/* Main Content Area */}
                    <div className="flex-1">

                        {/* HOME / INDIVIDUAL TESTS LISTING */}
                        {(view === 'home' || view === 'individual') && (
                            <div className="animate-fade-in-up">
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-12 mt-20">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Lab Tests in {cityName}</h1>
                                    <p className="text-gray-500 text-sm">Get accurate results from trusted labs near you.</p>
                                </div>

                                {/* Category Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                                    {tests.map(test => (
                                        <div key={test.id + '_cat'} onClick={() => handleViewDetail(test, 'test')} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md cursor-pointer transition-all text-center group">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <HeaderIcon d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </div>
                                            <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-600">{test.category}</h4>
                                        </div>
                                    ))
                                    }
                                </div >

                                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Tests</h2>
                                <div className="space-y-4">
                                    {tests.map(test => (
                                        <div key={test.id} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1 cursor-pointer" onClick={() => handleViewDetail(test, 'test')}>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-teal-600">{test.name}</h3>
                                                <p className="text-xs text-gray-500 mb-2">{test.alias}</p>
                                                <div className="flex gap-3 text-xs text-gray-600 font-medium">
                                                    <span className="bg-gray-100 px-2 py-1 rounded">{test.reportTime} Report</span>
                                                    <span className="bg-gray-100 px-2 py-1 rounded">{test.fasting}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 min-w-[120px]">
                                                <div className="text-right">
                                                    <span className="block text-lg font-bold text-gray-900">₹{test.price}</span>
                                                    <span className="text-xs text-gray-400 line-through mr-2">₹{test.mrp}</span>
                                                    <span className="text-xs font-bold text-green-600">{test.discount}</span>
                                                </div>
                                                <button className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg text-sm hover:bg-teal-700 transition-colors">Book</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div >
                        )}

                        {/* PACKAGES LISTING */}
                        {
                            view === 'packages' && (
                                <div className="animate-fade-in-up">
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg mt-20">
                                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Full Body Checkups in {cityName}</h1>
                                        <p className="opacity-90">Save up to 70% on health packages with free home collection.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {LAB_PACKAGES_DATA.map(pkg => (
                                            <div key={pkg.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all flex flex-col overflow-hidden group">
                                                <div className="p-5 flex-1 cursor-pointer" onClick={() => handleViewDetail(pkg, 'package')}>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-teal-600 line-clamp-2 min-h-[3.5rem]">{pkg.name}</h3>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">{pkg.testCount} Tests</span>
                                                        <span className="text-xs font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded">Includes {pkg.testsIncluded[0]}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-2">Ideal for: {pkg.idealFor}</p>
                                                    <p className="text-xs text-gray-500">Fasting: {pkg.fasting}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-lg font-bold text-gray-900">₹{pkg.price}</p>
                                                        <p className="text-xs text-green-600 font-bold">{pkg.discount} OFF</p>
                                                    </div>
                                                    <button className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700">Book</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {/* DETAIL VIEW */}
                        {
                            view === 'detail' && selectedItem && (
                                <DetailView item={selectedItem} type={detailType} onBack={() => setView(detailType === 'test' ? 'individual' : 'packages')} />
                            )
                        }

                    </div >
                </div >
            </main >
            <Footer />
        </div >
    );
};

export default LabTestsPage;
