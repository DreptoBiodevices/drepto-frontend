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
  // Health services removed

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
    </div>
  );
};

export default PatientHome;
