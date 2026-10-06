import React from 'react';
import { User } from '../../../types';
import {
  Stethoscope, UserPlus, Pill, TestTube2,
  ShoppingBag, Ambulance, UserCog,
  CalendarClock, Activity, Wallet, ClipboardList,
  ArrowRight, TrendingUp,
} from 'lucide-react';

interface PatientHomeProps {
  user: User;
  onNavigate: (page: string) => void;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const StatCard: React.FC<{
  label: string; value: string; sub: string;
  Icon: React.ElementType; accent: string;
}> = ({ label, value, sub, Icon, accent }) => (
  <div className="bg-white border border-gray-100 p-5 flex flex-col justify-between" style={{ borderRadius: '0.25rem' }}>
    <div className="flex items-center justify-between mb-4">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{label}</p>
      <div className={`w-7 h-7 flex items-center justify-center ${accent}`} style={{ borderRadius: '0.25rem' }}>
        <Icon size={14} />
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  </div>
);

const ServiceCard: React.FC<{
  id: string; title: string; description: string;
  Icon: React.ElementType; tag?: string;
  onNavigate: (id: string) => void;
}> = ({ id, title, description, Icon, tag, onNavigate }) => (
  <button
    onClick={() => onNavigate(id)}
    className="group text-left bg-white border border-gray-100 p-5 flex flex-col gap-3 hover:border-primary hover:shadow-sm transition-all duration-200"
    style={{ borderRadius: '0.25rem' }}
  >
    <div className="flex items-start justify-between">
      <div className="w-9 h-9 bg-gray-50 group-hover:bg-primary/8 flex items-center justify-center transition-colors duration-200" style={{ borderRadius: '0.25rem' }}>
        <Icon size={16} className="text-gray-400 group-hover:text-primary transition-colors duration-200" />
      </div>
      {tag && (
        <span className="text-[9px] font-bold tracking-widest uppercase text-primary bg-primary/8 px-2 py-0.5" style={{ borderRadius: '0.125rem' }}>
          {tag}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200">
        {title}
      </p>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-gray-300 group-hover:text-primary transition-colors duration-200 mt-auto">
      Open <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" />
    </div>
  </button>
);

const PatientHome: React.FC<PatientHomeProps> = ({ user, onNavigate }) => {
  const stats = [
    { label: 'Upcoming',  value: '0',   sub: 'Appointments', Icon: CalendarClock, accent: 'bg-blue-50 text-blue-500'    },
    { label: 'Pending',   value: '0',   sub: 'Lab results',   Icon: Activity,      accent: 'bg-purple-50 text-purple-500' },
    { label: 'Active',    value: '0',   sub: 'Orders',        Icon: ClipboardList, accent: 'bg-orange-50 text-orange-500' },
    { label: 'Wallet',    value: '₹0',  sub: 'Balance',       Icon: Wallet,        accent: 'bg-green-50 text-green-500'   },
  ];

  const modules = [
    { id: 'doctor',    title: 'Doctor Appointment', description: 'Browse specialists, book slots & manage consultations.', Icon: Stethoscope, tag: 'Popular' },
    { id: 'nurse',     title: 'Nurse Appointment',  description: 'Home care, elderly support & professional nursing.',     Icon: UserPlus    },
    { id: 'pharmacy',  title: 'Pharmacy',            description: 'Order medicines & upload prescriptions easily.',         Icon: Pill        },
    { id: 'lab',       title: 'Lab Tests',           description: 'Book diagnostics & view reports online.',                Icon: TestTube2   },
    { id: 'products',  title: 'Drepto Store',        description: 'Healthcare devices & wellness products.',                Icon: ShoppingBag },
    { id: 'ambulance', title: 'Ambulance',           description: 'Emergency 24/7 road & air ambulance.',                  Icon: Ambulance,  tag: '24/7' },
    { id: 'profile',   title: 'My Profile',          description: 'Medical records, history & settings.',                  Icon: UserCog     },
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* greeting + health tip */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-stretch">
        <div className="bg-primary p-7 flex flex-col justify-between min-h-[140px]" style={{ borderRadius: '0.25rem' }}>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/50 mb-3">
            {greeting()}
          </p>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {user.firstName} {user.lastName}.
            </h2>
            <p className="text-white/60 text-sm mt-2">
              {user.isFirstLogin ? 'Welcome to Drepto — your health dashboard.' : 'What would you like to do today?'}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 flex flex-col justify-between min-w-[220px]" style={{ borderRadius: '0.25rem' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-primary" />
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Health tip</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            Drink at least 8 glasses of water daily to support kidney function and energy levels.
          </p>
          <p className="text-[10px] text-gray-300 mt-4 font-semibold tracking-widest uppercase">Daily reminder</p>
        </div>
      </div>

      {/* stats */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Health Services</p>
          <p className="text-[10px] text-gray-300 font-semibold tracking-widest uppercase">{modules.length} available</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {modules.map(m => <ServiceCard key={m.id} {...m} onNavigate={onNavigate} />)}
        </div>
      </div>

    </div>
  );
};

export default PatientHome;