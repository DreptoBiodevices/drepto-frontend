
import React, { useState, useEffect } from 'react';

// Types
interface Doctor {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    image: string;
    available: string;
}

interface Appointment {
    id: number;
    doctorId: number;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    image: string;
}

// Data initialized as empty for API integration
const MOCK_DOCTORS: Doctor[] = [];
const MOCK_APPOINTMENTS: Appointment[] = [];

const DoctorAppointment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'find' | 'appointments'>('find');
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
    const [ratingFilter, setRatingFilter] = useState<string>('All');
    const [view, setView] = useState<'list' | 'slots' | 'success'>('list');
    const [showFilters, setShowFilters] = useState(false); // For mobile collapsible filters
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Selection State
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    
    // Calendar State
    const [calDate, setCalDate] = useState(new Date());

    // Reschedule State
    const [rescheduleId, setRescheduleId] = useState<number | null>(null);

    // Reminder State
    const [showNotification, setShowNotification] = useState(false);
    const [reminderBanner, setReminderBanner] = useState(true);

    useEffect(() => {
        // Simulate a system check for reminders
        const timer = setTimeout(() => {
            setShowNotification(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Booking Logic
    const handleBookClick = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setRescheduleId(null);
        setAddress('');
        setView('slots');
        setSelectedDate('');
        setSelectedTime('');
        setCalDate(new Date());
    };

    const handleRescheduleClick = (appointment: Appointment) => {
        const doctor = MOCK_DOCTORS.find(d => d.id === appointment.doctorId);
        if (doctor) {
             setSelectedDoctor(doctor);
             setRescheduleId(appointment.id);
             setAddress(''); 
             setView('slots');
             setCalDate(new Date());
        }
    };

    const confirmBooking = () => {
        setView('success');
    };

    const handleFinish = () => {
        onBack();
    };

    // Filter Logic
    const filteredDoctors = MOCK_DOCTORS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              d.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesAvailability = availabilityFilter === 'All' || d.available === availabilityFilter;
        const matchesRating = ratingFilter === 'All' || d.rating >= parseFloat(ratingFilter);

        return matchesSearch && matchesAvailability && matchesRating;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const displayedDoctors = filteredDoctors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // --- CALENDAR HELPERS ---
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const changeMonth = (offset: number) => {
        const newDate = new Date(calDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCalDate(newDate);
    };
    const isDateUnavailable = (day: number) => {
        const dateToCheck = new Date(calDate.getFullYear(), calDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateToCheck < today) return true;
        const dayOfWeek = dateToCheck.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const handleDateSelect = (day: number) => {
        if (isDateUnavailable(day)) return;
        const year = calDate.getFullYear();
        const month = String(calDate.getMonth() + 1).padStart(2, '0');
        const datePart = String(day).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${datePart}`);
        setSelectedTime('');
    };

    const currentSlots = (() => {
        if (!selectedDate) return [];
        const day = parseInt(selectedDate.split('-')[2]);
        const allSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM"];
        return day % 2 === 0 ? allSlots.filter((_, i) => i % 2 === 0) : allSlots.filter((_, i) => i % 2 !== 0);
    })();

    // --- RENDER METHODS ---
    const renderTabs = () => (
        <div className="flex justify-center mb-8">
            <div className="bg-gray-100/80 p-1.5 rounded-2xl flex relative">
                <button 
                    onClick={() => { setActiveTab('find'); setView('list'); }}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'find' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Find a Doctor
                </button>
                <button 
                    onClick={() => { setActiveTab('appointments'); setView('list'); }}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'appointments' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Appointments
                </button>
            </div>
        </div>
    );

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(calDate);
        const firstDay = getFirstDayOfMonth(calDate);
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-10"></div>);
        for (let day = 1; day <= daysInMonth; day++) {
            const year = calDate.getFullYear();
            const month = String(calDate.getMonth() + 1).padStart(2, '0');
            const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
            
            const dateToCheck = new Date(calDate.getFullYear(), calDate.getMonth(), day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isToday = dateToCheck.getTime() === today.getTime();

            const isUnavailable = isDateUnavailable(day);
            const isSelected = selectedDate === dateStr;

            days.push(
                <button
                    key={day}
                    disabled={isUnavailable}
                    onClick={() => handleDateSelect(day)}
                    className={`h-10 w-10 rounded-full flex flex-col items-center justify-center text-sm font-bold transition-all mx-auto relative border
                        ${isSelected 
                            ? 'bg-primary text-white border-primary shadow-lg transform scale-110 z-10' 
                            : isUnavailable 
                                ? 'text-gray-300 cursor-not-allowed bg-transparent border-transparent' 
                                : isToday
                                    ? 'text-primary bg-blue-50 border-blue-200'
                                    : 'text-gray-700 bg-white border-gray-100 hover:border-blue-300 hover:bg-blue-50 hover:text-primary'
                        }
                    `}
                >
                    <span>{day}</span>
                    {!isUnavailable && !isSelected && <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isToday ? 'bg-primary' : 'bg-blue-300'}`}></span>}
                </button>
            );
        }

        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h4 className="font-bold text-gray-800 text-lg">{calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">{days}</div>
            </div>
        );
    };

    const renderSlotSelection = () => (
        <div className="animate-fade-in-up max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                    <img src={selectedDoctor?.image} alt={selectedDoctor?.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{rescheduleId ? 'Reschedule Appointment' : 'Book Appointment'}</h3>
                        <p className="text-gray-500 text-sm">with {selectedDoctor?.name}</p>
                    </div>
                </div>
                
                <div className="p-6 md:p-8">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs">1</span>
                        Select Date
                    </h4>
                    {renderCalendar()}

                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs">2</span>
                        Select Time
                    </h4>
                    {!selectedDate ? (
                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 mb-8 text-sm">
                            Please select a date first.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8 animate-fade-in-up">
                            {currentSlots.length > 0 ? currentSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all duration-200 ${selectedTime === time ? 'bg-primary text-white border-primary shadow-md scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}
                                >
                                    {time}
                                </button>
                            )) : <div className="col-span-full text-center text-gray-500 py-4">No slots available.</div>}
                        </div>
                    )}

                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs">3</span>
                        Patient Details
                    </h4>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter full patient address..."
                        className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all mb-8 resize-none text-sm"
                        rows={3}
                    />

                    <div className="flex gap-4">
                        <button onClick={() => setView('list')} className="flex-1 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                        <button 
                            onClick={confirmBooking} 
                            disabled={!selectedDate || !selectedTime || !address.trim()}
                            className="flex-1 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center animate-fade-in-up max-w-lg mx-auto pb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 animate-bounce">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-500 mb-8 text-center">Your appointment has been booked successfully.</p>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-4">
                    <img src={selectedDoctor?.image} alt={selectedDoctor?.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm" />
                    <div>
                        <h4 className="font-bold text-gray-900 text-xl">{selectedDoctor?.name}</h4>
                        <p className="text-primary font-medium">{selectedDoctor?.specialty}</p>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                        <div>
                             <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">When</p>
                             <p className="text-gray-800 font-semibold">{selectedDate} at {selectedTime}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
                        <div>
                             <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Where</p>
                             <p className="text-gray-800 font-medium text-sm">{address}</p>
                        </div>
                    </div>
                </div>
                 <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <button onClick={handleFinish} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200">Return to Dashboard</button>
                </div>
            </div>
        </div>
    );

    const renderDoctorList = () => (
        <div className="animate-fade-in-up">
             <div className="mb-8 max-w-4xl mx-auto">
                <div className="relative mb-4">
                    <input 
                        type="text" 
                        placeholder="Search for doctors or specialties..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-4 pl-12 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <button onClick={() => setShowFilters(!showFilters)} className="absolute right-3 top-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 md:hidden">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </button>
                </div>
                
                <div className={`flex flex-col md:flex-row gap-3 justify-center transition-all overflow-hidden ${showFilters ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0 md:max-h-full md:opacity-100 md:mb-0'}`}>
                    <select 
                        value={availabilityFilter}
                        onChange={(e) => { setAvailabilityFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-white py-3 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="All">📅 Any Availability</option>
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                    </select>
                    <select 
                        value={ratingFilter}
                        onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-white py-3 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="All">⭐ All Ratings</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.8">4.8+ Stars</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedDoctors.length > 0 ? displayedDoctors.map(doc => (
                    <div key={doc.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <div className="p-6 flex items-start gap-4 relative">
                            <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                            <div className="absolute top-6 right-6 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">⭐ {doc.rating}</div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">{doc.name}</h3>
                                <p className="text-primary text-sm font-medium mb-2">{doc.specialty}</p>
                                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">Next: {doc.available}</p>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <button 
                                onClick={() => handleBookClick(doc)}
                                className="w-full bg-gray-50 text-gray-800 border border-gray-200 py-3 rounded-xl font-bold hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                            >
                                Book Visit
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-20">
                        <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                             <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No doctors found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                        <button onClick={() => {setSearchTerm(''); setAvailabilityFilter('All'); setRatingFilter('All'); setCurrentPage(1);}} className="text-primary font-bold hover:underline">Reset Filters</button>
                    </div>
                )}
            </div>
            
            {/* Pagination */}
            {filteredDoctors.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-xl border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                    <span className="text-sm font-bold text-gray-600">Page {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 rounded-xl border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
            )}
        </div>
    );

    const renderAppointmentsList = () => (
        <div className="animate-fade-in-up max-w-3xl mx-auto space-y-4">
            {/* Inline Reminder Banner */}
            {reminderBanner && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg mb-6 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <p className="font-bold text-sm opacity-90 uppercase tracking-wider">Up Next</p>
                            <h4 className="font-bold text-lg">Dr. Sarah Smith • Tomorrow, 10:00 AM</h4>
                        </div>
                    </div>
                    <button onClick={() => setReminderBanner(false)} className="text-white/80 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
            )}

            {MOCK_APPOINTMENTS.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No Upcoming Appointments</h3>
                    <p className="text-gray-400 mt-1 text-sm">Book a doctor to get started.</p>
                    <button onClick={() => setActiveTab('find')} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-600 transition-colors">Find a Doctor</button>
                </div>
            ) : (
                MOCK_APPOINTMENTS.map(appt => (
                    <div key={appt.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                        <img src={appt.image} alt={appt.doctorName} className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-50" />
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-bold text-lg text-gray-900">{appt.doctorName}</h3>
                            <p className="text-primary text-sm font-medium">{appt.specialty}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {appt.date}</span>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {appt.time}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${appt.status === 'Upcoming' ? 'bg-green-100 text-green-600' : appt.status === 'Completed' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-500'}`}>
                                {appt.status}
                            </span>
                            {appt.status === 'Upcoming' && (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors">Cancel</button>
                                    <button onClick={() => handleRescheduleClick(appt)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-blue-600 transition-colors shadow-sm">Reschedule</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="pb-10 relative">
            {/* Reminder Notification Toast */}
            {showNotification && (
                <div className="fixed top-24 right-4 md:right-8 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 border-l-4 border-primary animate-fade-in-up flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-full text-primary">
                         <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Upcoming Appointment</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">You have a consultation with <span className="font-bold text-gray-700">Dr. Sarah Smith</span> scheduled for tomorrow at 10:00 AM.</p>
                        <div className="mt-3 flex gap-3">
                            <button onClick={() => { setActiveTab('appointments'); setShowNotification(false); }} className="text-xs font-bold text-primary hover:underline">View Details</button>
                            <button onClick={() => setShowNotification(false)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Dismiss</button>
                        </div>
                    </div>
                    <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
            )}

            <div className="flex items-center mb-8">
                <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Doctor Appointments</h2>
            </div>

            {view === 'success' ? renderSuccess() : view === 'slots' ? renderSlotSelection() : (
                <>
                    {renderTabs()}
                    {activeTab === 'find' ? renderDoctorList() : renderAppointmentsList()}
                </>
            )}
        </div>
    );
};

export default DoctorAppointment;
