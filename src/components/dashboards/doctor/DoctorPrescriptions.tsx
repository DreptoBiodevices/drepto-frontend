
import React, { useState } from 'react';

interface Prescription {
    id: string;
    patientName: string;
    medications: string;
    date: string;
    status: 'Active' | 'Completed';
}

const DoctorPrescriptions: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
    const [patientName, setPatientName] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Dynamic State for Prescriptions
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault();
        if (patientName && medications) {
            setShowPreview(true);
        }
    };

    const handleConfirm = () => {
        const newRx: Prescription = {
            id: Date.now().toString(),
            patientName,
            medications: medications.split('\n')[0], // Take first line as summary
            date: new Date().toLocaleDateString(),
            status: 'Active'
        };
        setPrescriptions([newRx, ...prescriptions]);
        setShowPreview(false);
        setActiveTab('history');
        
        // Reset form
        setPatientName('');
        setDiagnosis('');
        setMedications('');
    };

    return (
        <div className="animate-fade-in-up pb-12 relative">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-gray-100/80 p-1.5 rounded-2xl flex shadow-inner">
                    <button 
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'create' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Write Rx
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Rx History
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                {activeTab === 'create' ? (
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-50 border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">New Prescription</h3>
                                <p className="text-sm text-gray-500">Issue a digital prescription instantly.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handlePreview} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Patient Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    placeholder="Enter patient full name" 
                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all text-gray-700 font-medium placeholder-gray-400" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Diagnosis</label>
                                <textarea 
                                    required
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="Clinical diagnosis notes..." 
                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all text-gray-700 font-medium placeholder-gray-400 resize-none" 
                                    rows={2}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Medications & Dosage</label>
                                <textarea 
                                    required
                                    value={medications}
                                    onChange={(e) => setMedications(e.target.value)}
                                    placeholder="List medications, dosage, and frequency..." 
                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all text-gray-700 font-medium placeholder-gray-400 resize-none" 
                                    rows={4}
                                ></textarea>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95">Review & Issue</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in-up">
                        {prescriptions.length > 0 ? (
                            prescriptions.map((rx) => (
                                <div key={rx.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-lg">Rx</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{rx.patientName}</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">{rx.date}</p>
                                            <p className="text-xs text-gray-400 font-medium mt-1 max-w-[200px] truncate">{rx.medications}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${rx.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{rx.status}</span>
                                        <button className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors" title="Print">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Prescriptions Issued</h3>
                                <p className="text-gray-500 text-sm mb-6">You haven't issued any digital prescriptions yet.</p>
                                <button onClick={() => setActiveTab('create')} className="text-purple-600 font-bold hover:underline">Create your first Rx</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Prescription Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative">
                        <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg">Rx Preview</h3>
                            <button onClick={() => setShowPreview(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <div className="p-8 bg-[#fcfcfc] text-gray-800 font-serif leading-relaxed">
                            <div className="flex justify-between border-b-2 border-gray-800 pb-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">Dr. Generic Name</h2>
                                    <p className="text-xs">Cardiology • Lic: 123456</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-3xl font-bold text-gray-900 font-sans">Rx</h2>
                                </div>
                            </div>
                            <div className="mb-6">
                                <p><span className="font-bold">Patient:</span> {patientName}</p>
                                <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                                <p><span className="font-bold">Diagnosis:</span> {diagnosis}</p>
                            </div>
                            <div className="min-h-[150px] whitespace-pre-wrap">
                                {medications}
                            </div>
                            <div className="border-t border-gray-300 pt-8 mt-8 flex justify-between items-end">
                                <div className="text-xs text-gray-500">Digitally Signed via Drepto</div>
                                <div className="h-10 border-b border-black w-40"></div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                            <button onClick={() => setShowPreview(false)} className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Edit</button>
                            <button onClick={handleConfirm} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg">Confirm & Issue</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPrescriptions;
