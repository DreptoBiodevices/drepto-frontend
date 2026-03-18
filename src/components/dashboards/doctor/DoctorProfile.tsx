
import React, { useState } from 'react';
import { User } from '../../../types';

const DoctorProfile: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAcceptingPatients, setIsAcceptingPatients] = useState(true);
    const [status, setStatus] = useState<'Available' | 'Busy' | 'Offline'>('Available');
    const [specialty, setSpecialty] = useState('');
    const [experience, setExperience] = useState('');
    const [license, setLicense] = useState('');

    return (
        <div className="animate-fade-in-up pb-12">
            <button onClick={onBack} className="mb-8 flex items-center text-gray-600 hover:text-primary transition-colors font-medium group">
                <div className="p-2 bg-white border border-gray-200 rounded-xl mr-3 group-hover:border-primary transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </div>
                Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 p-8 max-w-3xl mx-auto relative overflow-hidden">
                 {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                
                <div className="relative flex flex-col items-center -mt-4 mb-8">
                     <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-xl mb-4">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-5xl font-bold text-blue-600">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        {/* Status Indicator Badge on Avatar */}
                        <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${status === 'Available' ? 'bg-green-500' : status === 'Busy' ? 'bg-orange-500' : 'bg-gray-400'}`}>
                            {status === 'Available' && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            {status === 'Busy' && <div className="w-3 h-1 bg-white rounded-full"></div>}
                            {status === 'Offline' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                     </div>
                    <h2 className="text-3xl font-bold text-gray-900">Dr. {user.firstName} {user.lastName}</h2>
                    <p className="text-blue-600 font-bold text-lg mt-1">{specialty || 'Specialty Not Set'}</p>
                    <p className="text-gray-500 text-sm mt-1">{user.email}</p>

                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`absolute top-0 right-0 mt-4 ${isEditing ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'} px-4 py-2 rounded-xl font-bold text-xs transition-all hover:bg-gray-100`}
                    >
                        {isEditing ? 'Done Editing' : 'Edit Profile'}
                    </button>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Specialty</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cardiologist"
                                    className={`w-full p-3.5 bg-gray-50 rounded-2xl border ${isEditing ? 'border-blue-200 focus:ring-2 focus:ring-blue-500 bg-white' : 'border-transparent'} text-gray-800 font-medium transition-all outline-none`} 
                                    disabled={!isEditing} 
                                    value={specialty} 
                                    onChange={(e) => setSpecialty(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">License Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. MD-12345-X"
                                    className={`w-full p-3.5 bg-gray-50 rounded-2xl border ${isEditing ? 'border-blue-200 focus:ring-2 focus:ring-blue-500 bg-white' : 'border-transparent'} text-gray-800 font-medium transition-all outline-none`} 
                                    disabled={!isEditing} 
                                    value={license} 
                                    onChange={(e) => setLicense(e.target.value)}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Experience</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 12 Years"
                                    className={`w-full p-3.5 bg-gray-50 rounded-2xl border ${isEditing ? 'border-blue-200 focus:ring-2 focus:ring-blue-500 bg-white' : 'border-transparent'} text-gray-800 font-medium transition-all outline-none`} 
                                    disabled={!isEditing} 
                                    value={experience} 
                                    onChange={(e) => setExperience(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Availability & Status</h3>
                        
                        {/* Live Status Toggle */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 mb-3 ml-1">Current Status</label>
                            <div className="flex p-1 bg-gray-100 rounded-2xl">
                                {['Available', 'Busy', 'Offline'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s as any)}
                                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                            status === s 
                                            ? 'bg-white shadow-md transform scale-100' 
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${
                                            s === 'Available' ? 'bg-green-500' : s === 'Busy' ? 'bg-orange-500' : 'bg-gray-400'
                                        }`}></span>
                                        <span className={`${status === s ? (s === 'Available' ? 'text-green-600' : s === 'Busy' ? 'text-orange-600' : 'text-gray-600') : ''}`}>{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accepting Patients Toggle */}
                        <div 
                            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-all shadow-sm group"
                            onClick={() => setIsAcceptingPatients(!isAcceptingPatients)}
                        >
                             <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAcceptingPatients ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                 </div>
                                 <div>
                                     <span className="font-bold text-gray-800 block">Accepting New Patients</span>
                                     <span className="text-xs text-gray-500">{isAcceptingPatients ? 'Visible in search results' : 'Currently hidden from search'}</span>
                                 </div>
                             </div>
                             <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isAcceptingPatients ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAcceptingPatients ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
