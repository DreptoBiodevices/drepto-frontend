
import React, { useState } from 'react';
import { User } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

// ... interface definitions ...
interface Condition { id: string; name: string; date: string; status: 'Active' | 'Managed' | 'Resolved'; }
interface Allergy { id: string; allergen: string; severity: 'Mild' | 'Moderate' | 'Severe'; reaction: string; }
interface Medication { id: string; name: string; dosage: string; frequency: string; instructions?: string; }

type SectionType = 'conditions' | 'allergies' | 'medications' | 'profile'; // Added 'profile'
type FormData = Partial<Condition> & Partial<Allergy> & Partial<Medication> & Partial<User>;

const Profile: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
    const { updateUser, logout } = useAuth(); // Get updateUser and logout
    const [activeSection, setActiveSection] = useState<SectionType>('conditions');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // ... existing mocked state ...
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [medications, setMedications] = useState<Medication[]>([]);

    const [formData, setFormData] = useState<FormData>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleOpenModal = (item?: any, type?: SectionType) => {
        setEditingItem(item);
        setImagePreview(null);
        // If type is profile, prepopulate with user data
        if (type === 'profile') {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.mobileNumber,
                gender: user.gender,
                age: user.age,
                bloodGroup: user.bloodGroup,
                weight: user.weight,
                profileImage: user.profileImage,
                address: user.address
            } as unknown as FormData);
            setActiveSection('profile');
        } else {
            setFormData(item ? { ...item } : {});
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData(prev => ({ ...prev, profileImage: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
        // Reset active section if it was profile, maybe? Or keep it. 
        if (activeSection === 'profile') setActiveSection('conditions');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (activeSection === 'profile') {
            updateUser(formData as Partial<User>);
            handleCloseModal();
            return;
        }

        const newItem = { ...formData, id: editingItem ? editingItem.id : Date.now().toString() };

        if (activeSection === 'conditions') {
            setConditions(prev => editingItem ? prev.map(i => i.id === newItem.id ? newItem as Condition : i) : [...prev, newItem as Condition]);
        } else if (activeSection === 'allergies') {
            setAllergies(prev => editingItem ? prev.map(i => i.id === newItem.id ? newItem as Allergy : i) : [...prev, newItem as Allergy]);
        } else {
            setMedications(prev => editingItem ? prev.map(i => i.id === newItem.id ? newItem as Medication : i) : [...prev, newItem as Medication]);
        }
        handleCloseModal();
    };

    // ... existing handleDelete ...
    const handleDelete = (id: string) => {
        if (activeSection === 'conditions') setConditions(prev => prev.filter(i => i.id !== id));
        else if (activeSection === 'allergies') setAllergies(prev => prev.filter(i => i.id !== id));
        else setMedications(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="animate-fade-in-up pb-10 relative">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center border border-gray-100 sticky top-4">
                        <div className="w-36 h-36 mx-auto mb-6 rounded-full p-1.5 border-2 border-gray-100 bg-white relative group cursor-pointer transition-transform hover:scale-[1.02]">
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-4xl font-bold text-white">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" onClick={() => handleOpenModal(null, 'profile')}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.firstName} {user.lastName}</h2>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <p className="text-gray-500 text-sm font-medium">{user.email}</p>
                            {user.mobileNumber && <span className="w-1 h-1 rounded-full bg-gray-300"></span>}
                            {user.mobileNumber && <p className="text-gray-500 text-sm font-medium">{user.mobileNumber}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-3 hover:bg-blue-50 transition-colors group">
                                <span className="block text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{user.age || '--'}</span>
                                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Age</span>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-3 hover:bg-blue-50 transition-colors group">
                                <span className="block text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{user.bloodGroup || '--'}</span>
                                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Blood</span>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-3 hover:bg-blue-50 transition-colors group">
                                <span className="block text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{user.weight || '--'}</span>
                                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Weight (kg)</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button onClick={() => handleOpenModal(null, 'profile')} className="w-full py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">Edit Profile Details</button>
                            <button onClick={logout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Medical History Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-xl font-bold text-gray-900 self-start md:self-center">Medical History</h3>
                            <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                                {(['conditions', 'allergies', 'medications'] as SectionType[]).map(s => (
                                    <button key={s} onClick={() => setActiveSection(s)} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize whitespace-nowrap ${activeSection === s ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{s}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 min-h-[200px]">
                            {/* ... Content rendering logic same as before ... */}
                            {activeSection === 'conditions' && (conditions.length === 0 ? <EmptyState text="No medical conditions recorded." icon={<svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} /> : conditions.map(i => (
                                <div key={i.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group">
                                    <div><h4 className="font-bold text-gray-800">{i.name}</h4><p className="text-xs text-gray-500 font-medium">Since: {i.date}</p></div>
                                    <div className="flex items-center gap-3"><span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${i.status === 'Active' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{i.status}</span><Actions onEdit={() => handleOpenModal(i)} onDelete={() => handleDelete(i.id)} /></div>
                                </div>
                            )))}

                            {activeSection === 'allergies' && (allergies.length === 0 ? <EmptyState text="No allergies recorded." icon={<svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>} /> : allergies.map(i => (
                                <div key={i.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{i.allergen}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Reaction: <span className="text-gray-700">{i.reaction}</span></p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${i.severity === 'Severe' ? 'bg-red-50 text-red-600 border-red-100' : i.severity === 'Moderate' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                                            {i.severity}
                                        </span>
                                        <Actions onEdit={() => handleOpenModal(i)} onDelete={() => handleDelete(i.id)} />
                                    </div>
                                </div>
                            )))}

                            {activeSection === 'medications' && (medications.length === 0 ? <EmptyState text="No medications added." icon={<svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>} /> : medications.map(i => (
                                <div key={i.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-800">{i.name}</h4>
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{i.dosage}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {i.frequency}
                                            </p>
                                            {i.instructions && <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {i.instructions}
                                            </p>}
                                        </div>
                                    </div>
                                    <div className="self-end sm:self-center">
                                        <Actions onEdit={() => handleOpenModal(i)} onDelete={() => handleDelete(i.id)} />
                                    </div>
                                </div>
                            )))}
                        </div>
                        <button onClick={() => handleOpenModal()} className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl hover:border-primary/50 hover:text-primary hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm">+ Add New Entry</button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full md:max-w-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {activeSection === 'profile' ? 'Edit Profile' : (editingItem ? 'Edit' : 'Add') + ' ' + activeSection.slice(0, -1)}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">Make changes to your {activeSection === 'profile' ? 'personal details' : activeSection}</p>
                            </div>
                            <button onClick={handleCloseModal} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            {activeSection === 'profile' && (
                                <div className="space-y-8">
                                    <div className="flex flex-col items-center">
                                        <div className="w-28 h-28 rounded-full bg-gray-50 overflow-hidden mb-4 ring-4 ring-white shadow-lg relative group cursor-pointer">
                                            {imagePreview || (formData as User).profileImage ? (
                                                <img src={imagePreview || (formData as User).profileImage} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            </div>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-900">Profile Photo</p>
                                            <p className="text-xs text-gray-500">Tap to change</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Personal Information</h4>
                                        <div className="grid grid-cols-2 gap-5">
                                            <Input label="First Name" val={(formData as User).firstName} set={(v) => setFormData({ ...formData, firstName: v })} required />
                                            <Input label="Last Name" val={(formData as User).lastName} set={(v) => setFormData({ ...formData, lastName: v })} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <Input label="Email Address" val={(formData as User).email} set={() => { }} disabled />
                                            <Input label="Phone Number" val={(formData as User).mobileNumber} set={(v) => setFormData({ ...formData, mobileNumber: v })} placeholder="+91 99999 99999" />
                                        </div>
                                        <div>
                                            <Input label="Address" val={(formData as User).address} set={(v) => setFormData({ ...formData, address: v })} placeholder="Enter your full address" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Vitals & Other</h4>
                                        <div className="grid grid-cols-2 gap-5">
                                            <Input label="Age" type="number" val={String((formData as User).age || '')} set={(v) => setFormData({ ...formData, age: v ? parseInt(v) : '' })} />
                                            <Select label="Gender" val={(formData as User).gender} set={(v) => setFormData({ ...formData, gender: v })} opts={['Male', 'Female', 'Other']} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <Select label="Blood Group" val={(formData as User).bloodGroup} set={(v) => setFormData({ ...formData, bloodGroup: v })} opts={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                                            <Input label="Weight (kg)" type="number" val={String((formData as User).weight || '')} set={(v) => setFormData({ ...formData, weight: v ? parseFloat(v) : '' })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'conditions' && (
                                <>
                                    <Input label="Condition Name" val={formData.name} set={(v) => setFormData({ ...formData, name: v })} placeholder="e.g. Hypertension" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Date Diagnosed" type="date" val={formData.date} set={(v) => setFormData({ ...formData, date: v })} required />
                                        <Select label="Status" val={formData.status} set={(v) => setFormData({ ...formData, status: v as Condition['status'] })} opts={['Active', 'Managed', 'Resolved']} />
                                    </div>
                                </>
                            )}
                            {activeSection === 'allergies' && (
                                <>
                                    <Input label="Allergen" val={formData.allergen} set={(v) => setFormData({ ...formData, allergen: v })} placeholder="e.g. Peanuts" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select label="Severity" val={formData.severity} set={(v) => setFormData({ ...formData, severity: v as Allergy['severity'] })} opts={['Mild', 'Moderate', 'Severe']} />
                                        <Input label="Reaction" val={formData.reaction} set={(v) => setFormData({ ...formData, reaction: v })} placeholder="e.g. Skin rash" required />
                                    </div>
                                </>
                            )}
                            {activeSection === 'medications' && (
                                <>
                                    <Input label="Medication Name" val={formData.name} set={(v) => setFormData({ ...formData, name: v })} placeholder="e.g. Amoxicillin" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Dosage" val={formData.dosage} set={(v) => setFormData({ ...formData, dosage: v })} placeholder="e.g. 500mg" required />
                                        <Input label="Frequency" val={formData.frequency} set={(v) => setFormData({ ...formData, frequency: v })} placeholder="e.g. Twice daily" required />
                                    </div>
                                    <Input label="Instructions (Optional)" val={formData.instructions} set={(v) => setFormData({ ...formData, instructions: v })} placeholder="e.g. Take after meals" />
                                </>
                            )}

                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_30px_-10px_rgba(37,99,235,0.5)] transform hover:-translate-y-0.5">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
// ... helper components same ...
interface EmptyStateProps { text: string; icon?: React.ReactNode; }
const EmptyState: React.FC<EmptyStateProps> = ({ text, icon }) => (
    <div className="text-center py-12 px-4 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-3">
        {icon}
        <p className="font-medium text-sm">{text}</p>
    </div>
);

interface ActionsProps { onEdit: () => void; onDelete: () => void; }
const Actions: React.FC<ActionsProps> = ({ onEdit, onDelete }) => (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={onEdit} className="p-1.5 text-gray-400 hover:text-primary bg-white hover:bg-blue-50 rounded-lg border border-gray-100 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
        <button type="button" onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg border border-gray-100 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
    </div>
);

interface InputProps { label: string; val?: string; set: (v: string) => void; type?: string; placeholder?: string; required?: boolean; disabled?: boolean; }
const Input: React.FC<InputProps> = ({ label, val, set, type = 'text', placeholder, required, disabled }) => (
    <div className={`group ${disabled ? 'opacity-75' : ''}`}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <div className="relative">
            <input
                type={type}
                value={val || ''}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 bg-white rounded-xl border transition-all font-medium text-gray-900 placeholder-gray-400
                ${disabled
                        ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300'}`}
                required={required}
                disabled={disabled}
            />
            {disabled && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>}
        </div>
    </div>
);

interface SelectProps { label: string; val?: string; set: (v: string) => void; opts: string[]; }
const Select: React.FC<SelectProps> = ({ label, val, set, opts }) => (
    <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label}</label>
        <div className="relative">
            <select value={val || opts[0]} onChange={e => set(e.target.value)} className="w-full px-4 py-[13.5px] bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-gray-300 transition-all font-medium text-gray-900 appearance-none cursor-pointer">
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);

export default Profile;
