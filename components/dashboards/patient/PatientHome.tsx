import React from 'react';
import { User } from '../../../types';
import {
  Stethoscope,
  UserPlus,
  Pill,
  TestTube2,
  ShoppingBag,
  Ambulance,
  UserCog,
  CalendarClock,
  Activity,
  Wallet,
  ClipboardList
} from 'lucide-react';

interface PatientHomeProps {
  user: User;
  onNavigate: (page: string) => void;
}

const PatientHome: React.FC<PatientHomeProps> = ({ user, onNavigate }) => {
  const modules = [
    { id: "doctor", title: "Doctor Appointment", description: "Browse specialists, book slots & manage consultations.", icon: Stethoscope, color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-600" },
    { id: "nurse", title: "Nurse Appointment", description: "Home care, elderly support & professional nursing.", icon: UserPlus, color: "bg-emerald-500", lightColor: "bg-emerald-50 text-emerald-600" },
    { id: "pharmacy", title: "Pharmacy", description: "Order medicines & upload prescriptions.", icon: Pill, color: "bg-purple-500", lightColor: "bg-purple-50 text-purple-600" },
    { id: "lab", title: "Lab Tests", description: "Book diagnostics & view reports online.", icon: TestTube2, color: "bg-indigo-500", lightColor: "bg-indigo-50 text-indigo-600" },
    { id: "products", title: "Drepto Store", description: "Healthcare devices & wellness products.", icon: ShoppingBag, color: "bg-orange-500", lightColor: "bg-orange-50 text-orange-600" },
    { id: "ambulance", title: "Ambulance", description: "Emergency 24/7 road & air ambulance.", icon: Ambulance, color: "bg-red-500", lightColor: "bg-red-50 text-red-600" },
    { id: "profile", title: "My Profile", description: "Medical records, history & settings.", icon: UserCog, color: "bg-slate-700", lightColor: "bg-slate-100 text-slate-700" },
  ];

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-blue-200 text-white overflow-hidden flex flex-col md:flex-row items-start md:items-end justify-between gap-6 isolation-auto">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-[0.07] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-300 opacity-[0.1] rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            {getTimeBasedGreeting()}, <br className="md:hidden" />{user.firstName}!
          </h2>
          <p className="text-blue-100/90 text-lg leading-relaxed font-light">
            Your health journey starts here. What would you like to do today?
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Upcoming', value: '0', sub: 'Appointments', icon: CalendarClock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Pending', value: '0', sub: 'Lab Results', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          { label: 'Active', value: '0', sub: 'Orders', icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
          { label: 'Balance', value: '₹0.00', sub: 'Wallet', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-5 rounded-2xl shadow-sm border ${stat.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full group`}>
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-2xl md:text-3xl font-bold text-slate-800`}>{stat.value}</span>
              <span className="text-sm text-slate-400 block mt-1 font-medium">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
          <h3 className="text-2xl font-bold text-slate-800">Health Services</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="group bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer border border-slate-100 relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${m.lightColor} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm`}>
                <m.icon size={28} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{m.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{m.description}</p>

              <div className="flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Access Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
