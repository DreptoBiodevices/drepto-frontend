
import React, { useState } from 'react';

const Ambulance: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [step, setStep] = useState<'input' | 'searching' | 'tracking'>('input');
    const [type, setType] = useState<'Road' | 'Air'>('Road');
    const [vehicleType, setVehicleType] = useState<string>('basic');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    const assignedDriver = { name: "", vehicle: "", plate: "", rating: 0, phone: "", eta: "" };

    const handleBook = () => {
        setStep('searching');
        setTimeout(() => setStep('tracking'), 3000);
    };

    const handleCancel = () => {
        setStep('input');
        setPickup('');
        setDropoff('');
    };

    return (
        <div className="animate-fade-in-up h-[calc(100vh-120px)] flex flex-col relative overflow-hidden rounded-3xl border border-gray-200 shadow-2xl bg-gray-100">
            {/* --- MAP BACKGROUND --- */}
            <div className="absolute inset-0">
                <div className="w-full h-full opacity-40" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px), radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '30px 30px', backgroundPosition: '0 0, 15px 15px' }}></div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20"><path d="M-10 100 Q 150 120 300 50 T 600 150 T 900 100" stroke="#64748b" strokeWidth="20" fill="none" /><path d="M200 -10 Q 220 300 400 400 T 500 800" stroke="#64748b" strokeWidth="20" fill="none" /></svg>
                {step === 'tracking' && (
                    <>
                        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce"><div className="bg-red-600 text-white p-3 rounded-full shadow-xl shadow-red-500/40 border-4 border-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div></div>
                        <div className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 z-0"><div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-200 animate-pulse"></div></div>
                    </>
                )}
            </div>

            {/* --- TOP BAR --- */}
            <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
                <button onClick={onBack} className="pointer-events-auto bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-sm hover:bg-white transition-colors text-gray-700 border border-white/50"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                <div className="pointer-events-auto bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/40 animate-pulse flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full"></span>SOS EMERGENCY</div>
            </div>

            {/* --- BOTTOM SHEET --- */}
            <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-center w-full">
                {step === 'input' && (
                    <div className="bg-white w-full max-w-2xl rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] p-6 md:p-8 animate-slide-in-up">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-6">
                            <button onClick={() => setType('Road')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${type === 'Road' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>Road Ambulance</button>
                            <button onClick={() => setType('Air')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${type === 'Air' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Air Lift</button>
                        </div>

                        <div className="space-y-4 mb-6 relative">
                            <div className="absolute left-[1.15rem] top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>
                            <div className="relative z-10">
                                <div className="absolute left-3 top-3.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                                <input type="text" placeholder="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-transparent focus:border-red-500 focus:bg-white focus:ring-0 outline-none font-medium text-gray-800" />
                            </div>
                            <div className="relative z-10">
                                <div className="absolute left-3 top-3.5 w-3 h-3 bg-red-500 rounded-sm border-2 border-white shadow-sm"></div>
                                <input type="text" placeholder="Drop-off (Optional)" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-transparent focus:border-red-500 focus:bg-white focus:ring-0 outline-none font-medium text-gray-800" />
                            </div>
                        </div>

                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">Vehicle Type</h3>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {type === 'Road' ? (
                                <>
                                    {[{id: 'basic', l: 'Basic', p: '₹50'}, {id: 'oxygen', l: 'Oxygen', p: '₹80'}, {id: 'icu', l: 'ICU', p: '₹150'}].map(v => (
                                        <div key={v.id} onClick={() => setVehicleType(v.id)} className={`p-3 rounded-2xl border cursor-pointer transition-all text-center ${vehicleType === v.id ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 hover:border-gray-300'}`}>
                                            <p className="font-bold text-sm">{v.l}</p>
                                            <p className="font-bold text-xs mt-1">{v.p}</p>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="col-span-3 p-4 rounded-2xl border border-blue-500 bg-blue-50 flex justify-between items-center">
                                    <div><p className="font-bold text-blue-900">Air Ambulance</p><p className="text-xs text-blue-600">Helicopter</p></div>
                                    <p className="font-bold text-blue-700">₹2500</p>
                                </div>
                            )}
                        </div>
                        <button onClick={handleBook} disabled={!pickup} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-500/30 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Request Now</button>
                    </div>
                )}

                {step === 'searching' && (
                    <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] shadow-2xl p-10 text-center animate-fade-in-up pb-20">
                         <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                            <div className="absolute inset-4 bg-red-500 rounded-full opacity-40 animate-ping delay-150"></div>
                            <div className="relative z-10 bg-white w-full h-full rounded-full flex items-center justify-center border-4 border-red-50 shadow-inner">
                                <svg className="w-10 h-10 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Connecting...</h3>
                        <p className="text-gray-500">Locating nearest emergency response unit.</p>
                    </div>
                )}

                {step === 'tracking' && (
                    <div className="bg-white w-full max-w-2xl rounded-t-[2.5rem] shadow-2xl p-6 animate-slide-in-up">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        <div className="flex items-center justify-between mb-6">
                            <div><p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Arrival In</p><h2 className="text-3xl font-bold text-gray-900">-- min</h2></div>
                            <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide animate-pulse">En Route</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 mb-6">
                            <div className="w-14 h-14 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>
                            <div className="flex-1"><h4 className="font-bold text-gray-900">Driver Assigned</h4><p className="text-xs text-gray-500">Emergency Response Team</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200">Call Driver</button>
                            <button onClick={handleCancel} className="bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ambulance;
