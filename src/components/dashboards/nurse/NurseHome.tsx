import React from 'react';
import { User } from '../../../types';
import {
  Stethoscope,
  CheckSquare,
  UserCog,
  MapPin,
  Clock,
  ClipboardCheck,
  CalendarCheck
} from 'lucide-react';

interface NurseHomeProps {
  user: User;
  onNavigate: (page: string) => void;
}

const NurseHome: React.FC<NurseHomeProps> = ({ user, onNavigate }) => {
  const modules = [
    {
      id: "appointments",
      title: "Home Visits",
      description: "Manage assigned patient visits, view routes, and update status.",
      icon: Stethoscope,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-600"
    },
    {
      id: "tasks",
      title: "Daily Tasks",
      description: "Track nursing procedures, vitals checks, and medication Admin.",
      icon: CheckSquare,
      color: "bg-orange-500",
      lightColor: "bg-orange-50 text-orange-600"
    },
    {
      id: "profile",
      title: "Nurse Profile",
      description: "Update your service area, shift availability, and credentials.",
      icon: UserCog,
      color: "bg-teal-600",
      lightColor: "bg-teal-50 text-teal-600"
    },
  ];

  const stats = [
    { label: 'Scheduled', value: '0', sub: 'Visits Today', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: '0', sub: 'Tasks', icon: ClipboardCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Area', value: 'North', sub: 'Assigned Zone', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shift', value: '8h', sub: 'Remaining', icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-800 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-emerald-900/10 text-white overflow-hidden flex flex-col md:flex-row items-end justify-between gap-6 isolation-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-[0.05] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 opacity-[0.08] rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-emerald-100 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            Shift Status: Active
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-100">
            Nurse {user.lastName}
          </h2>
          <p className="text-emerald-50 text-lg opacity-90 max-w-xl font-light leading-relaxed">
            Your care makes a difference. You have 0 scheduled visits and 0 pending tasks for today.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl min-w-[160px] text-center shadow-lg">
          <div className="flex justify-center mb-2 text-emerald-200"><CalendarCheck size={24} /></div>
          <p className="text-xs text-emerald-200 uppercase tracking-widest font-bold mb-1">Today</p>
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
          <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
          <h3 className="text-2xl font-bold text-slate-800">Care Management</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="group bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer border border-slate-100 relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${m.lightColor} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm`}>
                <m.icon size={28} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">{m.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{m.description}</p>

              <div className="flex items-center text-sm font-bold text-teal-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Open Module</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseHome;
