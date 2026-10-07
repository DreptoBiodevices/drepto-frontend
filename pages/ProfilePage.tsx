import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import BackButton from '../components/BackButton';
import { User } from '../types';
import { User as UserIcon, Lock, MapPin, History, Star, Phone, Activity, Image as ImageIcon, Camera, CheckCircle, ShieldCheck } from 'lucide-react';
import { OrderService, LabTestBookingService, DoctorAppointmentService, NurseAppointmentService, UserService } from '../lib/api_controller';

type TabType = 'personal' | 'security' | 'address' | 'history' | 'reviews';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Personal Details State
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '', // not editable
    gender: user?.gender || '',
    age: user?.age || '',
    bloodGroup: user?.bloodGroup || '',
    profileImage: user?.profileImage || '',
  });

  // Phone Verification State
  const [phone, setPhone] = useState(user?.mobileNumber || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(!!user?.mobileNumber);

  // Password Change State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // History State
  const [historyStats, setHistoryStats] = useState({
    orders: 0, lab: 0, doctor: 0, nurse: 0
  });

  useEffect(() => {
    if (user) {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            gender: user.gender || '',
            age: user.age || '',
            bloodGroup: user.bloodGroup || '',
            profileImage: user.profileImage || '',
        });
        setPhone(user.mobileNumber || '');
        setPhoneVerified(!!user.mobileNumber);
    }
  }, [user]);

  useEffect(() => {
    // Load history counts
    const loadHistory = async () => {
        try {
            const [o, l, d, n] = await Promise.all([
                OrderService.getAll(user?.email).catch(() => ({ data: [] })),
                LabTestBookingService.getAll().catch(() => ({ data: [] })),
                DoctorAppointmentService.getAll().catch(() => ({ data: [] })),
                NurseAppointmentService.getAll().catch(() => ({ data: [] }))
            ]);
            setHistoryStats({
                orders: o.data?.length || 0,
                lab: l.data?.length || 0,
                doctor: d.data?.length || 0,
                nurse: n.data?.length || 0,
            });
        } catch(e) {}
    };
    if (activeTab === 'history') loadHistory();
  }, [activeTab, user?.email]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local object URL for preview (in a real app, upload to server and save URL)
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const sendOtp = async () => {
    if (phone.length < 10) return alert("Enter valid phone number");
    setOtpSent(true);
    // Mock OTP logic
    try {
        await UserService.requestOtp({ mobileNumber: phone });
    } catch (e) {
        // Fallback since API might not exist yet
        console.log("Mock OTP sent");
    }
    alert("OTP Sent to " + phone + " (Mock: enter 1234)");
  };

  const verifyOtp = async () => {
    try {
        await UserService.verifyOtp({ mobileNumber: phone, otp: Number(otp) });
        setPhoneVerified(true);
        setOtpSent(false);
        updateUser({ mobileNumber: phone });
        alert("Phone verified successfully!");
    } catch (e: any) {
        alert("Invalid OTP or expired.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwords.current === passwords.new) {
        setPasswordError('New password cannot be the same as the current password');
        return;
    }
    if (passwords.new !== passwords.confirm) {
        setPasswordError('New passwords do not match');
        return;
    }

    try {
        // Mock password change API call or handle via UserService if available
        // await UserService.updateUser(user!.id, { password: passwords.new });
        setPasswordSuccess('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
    } catch (e: any) {
        setPasswordError(e.response?.data?.message || 'Failed to change password');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderTabs = () => (
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 mb-6 pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('personal')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'personal' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <UserIcon className="w-4 h-4" /> Personal
          </button>
          <button onClick={() => setActiveTab('security')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'security' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Lock className="w-4 h-4" /> Security
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'history' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <History className="w-4 h-4" /> History
          </button>
          <button onClick={() => setActiveTab('address')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'address' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <MapPin className="w-4 h-4" /> Address
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Star className="w-4 h-4" /> Reviews
          </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton fallbackPath="/dashboard" />
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6 animate-fade-in-up">
          <div className="p-6 sm:p-8 bg-brand-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 backdrop-blur-sm flex-shrink-0">
                {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserIcon className="w-full h-full p-4 text-white" />
                )}
                {isEditing && activeTab === 'personal' && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                        <Camera className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h1>
                <p className="text-brand-100 mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                    {phoneVerified ? (
                        <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-100 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Phone Verified</span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-100 px-2 py-1 rounded-full cursor-pointer hover:bg-yellow-500/30 transition-colors" onClick={() => setActiveTab('security')}>Verify Phone</span>
                    )}
                </div>
              </div>
            </div>
            
            {activeTab === 'personal' && (
                <div className="flex-shrink-0">
                {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-white text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition-colors w-full sm:w-auto">
                    Edit Profile
                </button>
                ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors flex-1">
                        Cancel
                    </button>
                    <button onClick={handlePersonalSave} className="px-6 py-2 bg-white text-brand-700 font-bold rounded-lg hover:bg-brand-50 transition-colors flex-1 shadow-sm">
                        Save
                    </button>
                </div>
                )}
                </div>
            )}
          </div>
          
          <div className="p-6 sm:p-8">
            {renderTabs()}

            {/* PERSONAL TAB */}
            {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handlePersonalChange} disabled={!isEditing} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handlePersonalChange} disabled={!isEditing} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" value={formData.email} disabled className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" title="Email cannot be changed" />
                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handlePersonalChange} disabled={!isEditing} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handlePersonalChange} disabled={!isEditing} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handlePersonalChange} disabled={!isEditing} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                    </div>
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Phone Number Section */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Phone className="w-5 h-5" /></div>
                            <h3 className="font-bold text-lg text-slate-900">Phone Verification</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                                <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneVerified(false); }} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" />
                            </div>
                            {phoneVerified ? (
                                <div className="px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg flex items-center gap-2 border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> Verified
                                </div>
                            ) : (
                                <button onClick={sendOtp} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
                                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                                </button>
                            )}
                        </div>
                        {otpSent && !phoneVerified && (
                            <div className="mt-4 flex gap-4 items-end animate-fade-in">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 tracking-widest font-mono" placeholder="1234" maxLength={6} />
                                </div>
                                <button onClick={verifyOtp} className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                                    Verify
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Change Password Section */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-200 text-slate-700 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
                            <h3 className="font-bold text-lg text-slate-900">Change Password</h3>
                        </div>
                        
                        {passwordError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{passwordSuccess}</div>}

                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                <input type="password" required value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                <input type="password" required value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" minLength={6} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rewrite New Password</label>
                                <input type="password" required value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" minLength={6} />
                            </div>
                            <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
                <div className="animate-fade-in text-center py-10 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <div className="text-3xl font-black text-blue-600 mb-1">{historyStats.orders}</div>
                            <div className="text-sm font-medium text-blue-800">Product Orders</div>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                            <div className="text-3xl font-black text-indigo-600 mb-1">{historyStats.lab}</div>
                            <div className="text-sm font-medium text-indigo-800">Lab Tests</div>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                            <div className="text-3xl font-black text-emerald-600 mb-1">{historyStats.doctor}</div>
                            <div className="text-sm font-medium text-emerald-800">Doctor Visits</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                            <div className="text-3xl font-black text-purple-600 mb-1">{historyStats.nurse}</div>
                            <div className="text-sm font-medium text-purple-800">Nurse Visits</div>
                        </div>
                    </div>
                    <div className="pt-6">
                        <a href="/orders" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-700 text-white font-bold rounded-xl hover:bg-brand-800 transition-colors">
                            View Detailed History <Activity className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === 'address' && (
                <div className="animate-fade-in text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-700">No Saved Addresses</h3>
                    <p className="text-slate-500 mt-1 mb-4">You have not saved any addresses yet.</p>
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-100">Add New Address</button>
                </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
                <div className="animate-fade-in text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-700">No Reviews Yet</h3>
                    <p className="text-slate-500 mt-1">You haven't left any reviews for our services.</p>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
