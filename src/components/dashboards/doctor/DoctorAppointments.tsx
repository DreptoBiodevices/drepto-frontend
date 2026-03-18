
import React, { useState } from 'react';

interface Appointment {
    id: string;
    patientName: string;
    reason: string;
    date: string; // Format: YYYY-MM-DD
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    imageUrl?: string;
}

const DoctorAppointments: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calendar State
    const [calDate, setCalDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const itemsPerPage = 5;

    // Data initialized as empty
    const appointments: Appointment[] = [];

    // Helper to check for appointments on a specific day
    const hasAppointmentOnDate = (dateStr: string) => {
        return appointments.some(appt => appt.date === dateStr && appt.status === 'Upcoming');
    };

    // Filter logic
    const filteredAppointments = appointments.filter(appt => {
        const matchesTab = activeTab === 'upcoming' 
            ? appt.status === 'Upcoming' 
            : (appt.status === 'Completed' || appt.status === 'Cancelled');
        const matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? appt.date === selectedDate : true;
        
        return matchesTab && matchesSearch && matchesDate;
    });

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const displayedAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // --- Calendar Logic ---
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    const changeMonth = (offset: number) => {
        const newDate = new Date(calDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCalDate(newDate);
    };

    const handleDateClick = (day: number) => {
        const year = calDate.getFullYear();
        const month = String(calDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;

        if (selectedDate === dateStr) {
            setSelectedDate(null); // Deselect if clicked again
        } else {
            setSelectedDate(dateStr);
        }
        setCurrentPage(1);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(calDate);
        const firstDay = getFirstDayOfMonth(calDate);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const year = calDate.getFullYear();
            const month = String(calDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayStr}`;
            
            const isSelected = selectedDate === dateStr;
            const hasAppt = hasAppointmentOnDate(dateStr);
            const isToday = new Date().toDateString() === new Date(year, calDate.getMonth(), day).toDateString();

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-9 w-9 rounded-full flex flex-col items-center justify-center text-sm font-medium transition-all mx-auto relative
                        ${isSelected 
                            ? 'bg-primary text-white shadow-md' 
                            : isToday
                                ? 'bg-blue-50 text-primary font-bold'
                                : 'text-gray-700 hover:bg-gray-100'
                        }
                    `}
                >
                    {day}
                    {hasAppt && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>
                    )}
                </button>
            );
        }

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h4 className="font-bold text-gray-800">{calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-xs font-bold text-gray-400">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                    {days}
                </div>
                {selectedDate && (
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500 mb-2">Filtering by</p>
                        <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg text-primary text-sm font-bold">
                            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            <button onClick={() => setSelectedDate(null)} className="hover:text-blue-700">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderAppointmentItem = (appt: Appointment) => (
        <div key={appt.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${appt.status === 'Upcoming' ? 'bg-blue-500' : appt.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            
            {/* Patient Details */}
            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500 overflow-hidden shadow-inner">
                    {appt.imageUrl ? <img src={appt.imageUrl} alt="" className="w-full h-full object-cover" /> : appt.patientName.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{appt.patientName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{appt.reason}</p>
                </div>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-start md:justify-center bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-xl border border-gray-100 md:border-none">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="font-semibold">{appt.date}</span>
                </div>
                <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-semibold">{appt.time}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-gray-100">
                {appt.status === 'Upcoming' && (
                    <>
                        <button className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">Cancel</button>
                        <button className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-blue-600 shadow-md shadow-blue-200 transition-all">Reschedule</button>
                    </>
                )}
                {appt.status !== 'Upcoming' && (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${appt.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {appt.status}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in-up pb-12">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
                </div>
                
                <div className="relative w-full md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search patient..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm font-medium transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100/80 p-1.5 rounded-2xl flex shadow-inner relative overflow-hidden">
                    <button 
                        onClick={() => { setActiveTab('upcoming'); setCurrentPage(1); }}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative z-10 ${activeTab === 'upcoming' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Upcoming
                    </button>
                    <button 
                        onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative z-10 ${activeTab === 'history' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Sidebar / Calendar */}
                <div className="lg:col-span-1 space-y-6">
                    {renderCalendar()}
                    
                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                         <h3 className="font-bold text-lg mb-4">Summary</h3>
                         <div className="flex justify-between items-center mb-3">
                             <span className="text-blue-100 text-sm">Total Appointments</span>
                             <span className="font-bold text-2xl">{filteredAppointments.length}</span>
                         </div>
                         <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                             <div className="h-full bg-white/80 w-2/3"></div>
                         </div>
                         <p className="text-xs text-blue-100 opacity-80">
                             {selectedDate 
                                ? `Showing appointments for ${new Date(selectedDate).toLocaleDateString()}` 
                                : "Showing all scheduled appointments"}
                         </p>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-4">
                    {displayedAppointments.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {displayedAppointments.map(renderAppointmentItem)}
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
                            <div className="w-20 h-20 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments Found</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                {selectedDate 
                                    ? `No appointments scheduled for ${new Date(selectedDate).toLocaleDateString()}.` 
                                    : "There are no appointments matching your criteria at the moment."}
                            </p>
                            {selectedDate && (
                                <button onClick={() => setSelectedDate(null)} className="mt-4 text-primary font-bold text-sm hover:underline">Clear Date Filter</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
