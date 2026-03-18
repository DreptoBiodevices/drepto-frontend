
import React, { useState } from 'react';

interface Patient {
    id: string;
    name: string;
    age: string;
    gender: string;
    lastVisit: string;
    condition: string;
    image?: string;
}

const DoctorPatients: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 6;

    // Dynamic State for Patients (replacing empty static array)
    const [patients, setPatients] = useState<Patient[]>([]);
    
    // New Patient Form State
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', condition: '' });

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        const patient: Patient = {
            id: Date.now().toString(),
            name: newPatient.name,
            age: newPatient.age,
            gender: newPatient.gender,
            condition: newPatient.condition,
            lastVisit: 'Today',
        };
        setPatients([patient, ...patients]);
        setIsAddModalOpen(false);
        setNewPatient({ name: '', age: '', gender: 'Male', condition: '' });
    };

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const displayedPatients = filteredPatients.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="animate-fade-in-up pb-12 relative">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm font-medium transition-all shadow-sm"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Patient
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {filteredPatients.length > 0 ? (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="grid grid-cols-1 md:hidden gap-4">
                            {displayedPatients.map(patient => (
                                <div key={patient.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shadow-sm text-lg">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{patient.name}</h3>
                                            <p className="text-xs text-gray-500">{patient.age} yrs • {patient.gender}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Condition</span><span className="font-medium text-gray-800">{patient.condition}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Last Visit</span><span className="font-medium text-gray-800">{patient.lastVisit}</span></div>
                                    </div>
                                    <button className="w-full mt-4 py-2.5 bg-gray-50 text-gray-600 font-bold text-xs rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors">View History</button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                             <table className="w-full text-left border-collapse">
                                 <thead className="bg-gray-50/50 border-b border-gray-100">
                                     <tr>
                                         <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Name</th>
                                         <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Age / Gender</th>
                                         <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Condition</th>
                                         <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Visit</th>
                                         <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-50">
                                     {displayedPatients.map(patient => (
                                         <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                             <td className="p-5">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                                                         {patient.name.charAt(0)}
                                                     </div>
                                                     <span className="font-bold text-gray-800">{patient.name}</span>
                                                 </div>
                                             </td>
                                             <td className="p-5 text-sm text-gray-600 font-medium">{patient.age} yrs <span className="text-gray-300 mx-2">|</span> {patient.gender}</td>
                                             <td className="p-5"><span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{patient.condition}</span></td>
                                             <td className="p-5 text-sm text-gray-500">{patient.lastVisit}</td>
                                             <td className="p-5 text-right">
                                                 <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">View Profile</button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                                <span className="text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 animate-fade-in-up">
                         <div className="w-20 h-20 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Patients Found</h3>
                        <p className="text-gray-500 text-sm mb-6">Your patient list is currently empty.</p>
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-all">Register First Patient</button>
                    </div>
                )}
            </div>

            {/* Add Patient Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Register New Patient</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <input required type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all" placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                                    <input required type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all" placeholder="e.g. 34" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                                    <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Condition</label>
                                <input required type="text" value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all" placeholder="e.g. Hypertension" />
                            </div>
                            <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all mt-2">Register Patient</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
