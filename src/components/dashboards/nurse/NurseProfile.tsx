
import React, { useState } from 'react';
import { User } from '../../../types';

const NurseProfile: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
    const [isOnDuty, setIsOnDuty] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [shift, setShift] = useState('');
    const [area, setArea] = useState('');

    return (
        <div className="animate-fade-in-up pb-12">
            <button onClick={onBack} className="mb-8 flex items-center text-gray-600 hover:text-primary transition-colors font-medium group">
                <div className="p-2 bg-white border border-gray-200 rounded-xl mr-3 group-hover:border-primary transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </div>
                Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-lg shadow-emerald-50 border border-gray-100 p-8 max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

                <div className="relative flex flex-col items-center -mt-4 mb-8">
                     <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-xl mb-4">
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center text-5xl font-bold text-emerald-600">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                     </div>
                    <h2 className="text-3xl font-bold text-gray-900">Nurse {user.firstName} {user.lastName}</h2>
                    <p className="text-emerald-600 font-bold text-lg mt-1">Registered Nurse (RN)</p>
                    <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                    
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`absolute top-0 right-0 mt-4 ${isEditing ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'} px-4 py-2 rounded-xl font-bold text-xs transition-all hover:bg-gray-100`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Status Toggle */}
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-200">
                        <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOnDuty ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             </div>
                             <div>
                                 <span className="font-bold text-gray-800 block text-lg">{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
                                 <span className="text-xs text-gray-500 font-medium">{isOnDuty ? 'Receiving new assignments' : 'Not available for visits'}</span>
                             </div>
                        </div>
                        <button 
                            onClick={() => setIsOnDuty(!isOnDuty)}
                            className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none ${isOnDuty ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOnDuty ? 'translate-x-7' : 'translate-x-0'}`}></span>
                        </button>
                    </div>

                    {/* Service Details */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Service Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Assigned Area</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Downtown"
                                    className={`w-full p-3.5 bg-gray-50 rounded-2xl border ${isEditing ? 'border-emerald-200 focus:ring-2 focus:ring-emerald-500 bg-white' : 'border-transparent'} text-gray-800 font-medium transition-all outline-none`} 
                                    disabled={!isEditing} 
                                    value={area} 
                                    onChange={(e) => setArea(e.target.value)}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Standard Shift</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 08:00 AM - 04:00 PM"
                                    className={`w-full p-3.5 bg-gray-50 rounded-2xl border ${isEditing ? 'border-emerald-200 focus:ring-2 focus:ring-emerald-500 bg-white' : 'border-transparent'} text-gray-800 font-medium transition-all outline-none`} 
                                    disabled={!isEditing} 
                                    value={shift} 
                                    onChange={(e) => setShift(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Credentials */}
                    <div>
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Skills & Certifications</h3>
                         <div className="flex flex-wrap gap-2">
                             {['Critical Care', 'Pediatrics', 'Wound Care', 'CPR Certified', 'IV Therapy'].map(skill => (
                                 <span key={skill} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold border border-teal-100">
                                     {skill}
                                 </span>
                             ))}
                             {isEditing && <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 rounded-lg text-xs font-bold hover:text-emerald-500 hover:border-emerald-300 transition-colors">+ Add</button>}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NurseProfile;
