
import React, { useState } from 'react';

interface Visit {
    id: string;
    patientName: string;
    address: string;
    time: string;
    type: string;
    priority: 'High' | 'Normal';
    status: 'Scheduled' | 'Completed' | 'In Progress';
    distance: string;
}

const NurseAppointments: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Initialized as empty for API integration
    const visits: Visit[] = [];

    const filteredVisits = visits.filter(visit => {
        const matchesTab = activeTab === 'upcoming' 
            ? visit.status !== 'Completed' 
            : visit.status === 'Completed';
        const matchesSearch = visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              visit.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
    const displayedVisits = filteredVisits.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const renderVisitItem = (visit: Visit) => (
        <div key={visit.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${visit.priority === 'High' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            
            {/* Time & Distance */}
            <div className="flex lg:flex-col items-center lg:items-start gap-3 lg:gap-1 min-w-[100px] text-gray-500 text-sm">
                <div className="font-bold text-gray-900 text-lg">{visit.time}</div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md lg:bg-transparent lg:px-0 lg:py-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>{visit.distance}</span>
                </div>
            </div>

            {/* Patient Info */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-xl text-gray-900">{visit.patientName}</h3>
                    {visit.priority === 'High' && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide rounded-full">High Priority</span>}
                </div>
                <p className="text-emerald-600 font-medium text-sm mb-1">{visit.type}</p>
                <p className="text-gray-500 text-sm flex items-start gap-1">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {visit.address}
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-none border-gray-100">
                {visit.status !== 'Completed' ? (
                    <>
                        <button className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all">Start Visit</button>
                        <div className="flex gap-2">
                            <button className="flex-1 lg:flex-none px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                Call
                            </button>
                             <button className="flex-1 lg:flex-none px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                Map
                            </button>
                        </div>
                    </>
                ) : (
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider text-center">Completed</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in-up pb-12">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Home Visits</h2>
                </div>
                
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search patient or address..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm font-medium transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100/80 p-1.5 rounded-2xl flex shadow-inner relative overflow-hidden">
                    <button 
                        onClick={() => { setActiveTab('upcoming'); setCurrentPage(1); }}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative z-10 ${activeTab === 'upcoming' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Upcoming
                    </button>
                    <button 
                        onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative z-10 ${activeTab === 'history' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                {displayedVisits.length > 0 ? (
                     <>
                        <div className="space-y-4">
                            {displayedVisits.map(renderVisitItem)}
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
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Visits Found</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">You have no {activeTab} visits scheduled matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NurseAppointments;
