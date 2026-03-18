
import React, { useState } from 'react';

interface Service {
    id: number;
    title: string;
    category: string;
    price: string;
    duration: string;
    icon: React.ReactNode;
}

interface Appointment {
    id: number;
    service: string;
    date: string;
    time: string;
    status: 'Scheduled' | 'In Progress' | 'Completed';
    nurse?: string;
    image?: string;
}

const NurseAppointment: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'book' | 'track'>('book');
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [preferredGender, setPreferredGender] = useState('Any');

    // Data initialized as empty
    const services: Service[] = [];
    const appointments: Appointment[] = [];
    const categories = ['All', 'Home Care', 'Specialty', 'Follow-up'];

    const filteredServices = categoryFilter === 'All' ? services : services.filter(s => s.category === categoryFilter);

    const handleBookSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsBookingSuccess(true);
    };

    const handleReset = () => {
        setIsBookingSuccess(false);
        setActiveTab('track');
        setSelectedService(null);
        setDate('');
        setTime('');
        setAddress('');
        setNotes('');
    };

    const getServiceDetails = (id: number | null) => services.find(s => s.id === id);

    return (
        <div className="min-h-screen animate-fade-in-up pb-10">
             <div className="flex items-center mb-8">
                <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900">Nurse Services</h2>
            </div>

             <div className="flex justify-center mb-8">
                <div className="bg-gray-100/80 p-1.5 rounded-2xl flex">
                    <button 
                        onClick={() => setActiveTab('book')}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'book' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Book a Nurse
                    </button>
                    <button 
                        onClick={() => setActiveTab('track')}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'track' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Appointments
                    </button>
                </div>
            </div>

            {activeTab === 'book' ? (
                isBookingSuccess ? (
                    <div className="max-w-lg mx-auto animate-fade-in-up">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                            <div className="bg-emerald-50 p-8 text-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-900">Confirmed!</h3>
                                <p className="text-emerald-600/80 mt-1 font-medium">Booking ID: #NUR-{Math.floor(Math.random() * 10000)}</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between border-b border-gray-100 pb-4">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-bold text-gray-800">{getServiceDetails(selectedService)?.title}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-4">
                                    <span className="text-gray-500">Date & Time</span>
                                    <span className="font-bold text-gray-800 text-right">{date}<br/><span className="text-sm font-normal">{time}</span></span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-bold text-emerald-600 text-xl">{getServiceDetails(selectedService)?.price}</span>
                                </div>
                                <button onClick={handleReset} className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">Track Status</button>
                            </div>
                        </div>
                    </div>
                ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-lg font-bold text-gray-800">Select Service</h3>
                             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                 {categories.map(cat => (
                                     <button 
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                                     >
                                         {cat}
                                     </button>
                                 ))}
                             </div>
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredServices.length > 0 ? filteredServices.map(service => (
                                <div 
                                    key={service.id}
                                    onClick={() => setSelectedService(service.id)}
                                    className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group ${selectedService === service.id ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100' : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-lg'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedService === service.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'}`}>
                                        {service.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{service.title}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{service.category}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="font-bold text-emerald-600 text-sm">{service.price}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="text-xs text-gray-400">{service.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No services available right now.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Details</h3>
                            <form onSubmit={handleBookSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Date</label>
                                        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Time</label>
                                        <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Gender Preference</label>
                                    <div className="flex gap-2">
                                        {['Any', 'Female', 'Male'].map(g => (
                                            <button type="button" key={g} onClick={() => setPreferredGender(g)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${preferredGender === g ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{g}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Address</label>
                                    <textarea required rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-sm resize-none" placeholder="Full address..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Notes</label>
                                    <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-sm resize-none" placeholder="Optional..."></textarea>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-500 font-medium text-sm">Total Estimate</span>
                                        <span className="text-2xl font-bold text-emerald-600">{selectedService ? services.find(s => s.id === selectedService)?.price : '₹0'}</span>
                                    </div>
                                    <button type="submit" disabled={!selectedService} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-600 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">Confirm Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                )
            ) : (
                <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
                    {appointments.length > 0 ? appointments.map(appt => (
                        <div key={appt.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${appt.status === 'In Progress' ? 'bg-blue-500' : appt.status === 'Scheduled' ? 'bg-yellow-400' : 'bg-emerald-500'}`}></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                {appt.image ? <img src={appt.image} alt="" className="w-full h-full rounded-2xl object-cover" /> : <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                    <h4 className="font-bold text-lg text-gray-900">{appt.service}</h4>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${appt.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : appt.status === 'Scheduled' ? 'bg-yellow-50 text-yellow-600' : 'bg-emerald-50 text-emerald-600'}`}>{appt.status}</span>
                                </div>
                                <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {appt.date} • {appt.time}</p>
                            </div>
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                {appt.status === 'In Progress' && <button className="w-full px-5 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">Call Nurse</button>}
                                {appt.status === 'Scheduled' && <button className="w-full px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all">Reschedule</button>}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No Appointments</h3>
                            <p className="text-gray-400 mt-1">You haven't booked any nurse visits yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NurseAppointment;
