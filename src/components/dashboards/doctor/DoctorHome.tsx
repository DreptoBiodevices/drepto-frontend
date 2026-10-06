import React from 'react';
import { User } from '../../../types';
import {
  CalendarCheck,
  Users,
  FileText,
  UserCog,
  Clock,
  UserCheck,
  Star,
  DollarSign,
  CalendarDays
} from 'lucide-react';

interface DoctorHomeProps {
  user: User;
  onNavigate: (page: string) => void;
}

const DoctorHome: React.FC<DoctorHomeProps> = ({ user, onNavigate }) => {
  const modules = [
    {
      id: "appointments",
      title: "Appointments",
      description: "Manage schedule, view upcoming visits & request changes.",
      icon: CalendarCheck,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600"
    },
    {
      id: "patients",
      title: "Patient Records",
      description: "Access medical history, notes, and contact info.",
      icon: Users,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-600"
    },
    {
      id: "prescriptions",
      title: "E-Prescriptions",
      description: "Issue digital Rx and manage medication history.",
      icon: FileText,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 text-purple-600"
    },
    {
      id: "profile",
      title: "Doctor Profile",
      description: "Update availability, specialty details & settings.",
      icon: UserCog,
      color: "bg-slate-700",
      lightColor: "bg-slate-100 text-slate-700"
    },
  ];

  const stats = [
    { label: 'Today', value: '0', sub: 'Appointments', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total', value: '0', sub: 'Patients', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: '0', sub: 'Reviews', icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Earnings', value: '$0', sub: 'This Month', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 via-indigo-600 to-indigo-800 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-indigo-900/10 text-white overflow-hidden flex flex-col md:flex-row items-end justify-between gap-6 isolation-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-[0.05] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 opacity-[0.08] rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-100 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            Practice Status: Online
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            Hello, Dr. {user.lastName}
          </h2>
          <p className="text-blue-100 text-lg opacity-90 max-w-xl font-light leading-relaxed">
            You have a clear schedule right now. Use the dashboard to manage your practice efficiently.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl min-w-[160px] text-center shadow-lg">
          <div className="flex justify-center mb-2 text-blue-200"><CalendarDays size={24} /></div>
          <p className="text-xs text-blue-200 uppercase tracking-widest font-bold mb-1">Today</p>
          <p className="text-2xl font-bold tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} />
              </div>
            </div>
            <span className={`text-3xl font-bold text-slate-800 block mb-1`}>{stat.value}</span>
            <span className="text-xs text-slate-400 font-medium">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
          <h3 className="text-2xl font-bold text-slate-800">Practice Management</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="group bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300 cursor-pointer border border-slate-100 relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${m.lightColor} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm`}>
                <m.icon size={28} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">{m.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{m.description}</p>

              <div className="flex items-center text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Access Module</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
