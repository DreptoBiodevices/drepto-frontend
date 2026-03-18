import React, { useState } from 'react';
import { User } from '../../types';
import DashboardLayout from './DashboardLayout';

// Sub-components
import DoctorHome from './doctor/DoctorHome';
import DoctorAppointments from './doctor/DoctorAppointments';
import DoctorPatients from './doctor/DoctorPatients';
import DoctorPrescriptions from './doctor/DoctorPrescriptions';
import DoctorProfile from './doctor/DoctorProfile';

// Icons
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  FileText,
  UserCog
} from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'patients', label: 'My Patients', icon: Users },
  { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
  { id: 'profile', label: 'Settings', icon: UserCog },
];

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<string>('home');

  const renderView = () => {
    switch (currentView) {
      case 'appointments':
        return <DoctorAppointments onBack={() => setCurrentView('home')} />;
      case 'patients':
        return <DoctorPatients onBack={() => setCurrentView('home')} />;
      case 'prescriptions':
        return <DoctorPrescriptions onBack={() => setCurrentView('home')} />;
      case 'profile':
        return <DoctorProfile user={user} onBack={() => setCurrentView('home')} />;
      default:
        return <DoctorHome user={user} onNavigate={setCurrentView} />;
    }
  };

  const getTitle = () => {
    const item = NAV_ITEMS.find(i => i.id === currentView);
    return item ? item.label : 'Doctor Portal';
  };

  return (
    <DashboardLayout
      user={user}
      navItems={NAV_ITEMS}
      activeTab={currentView}
      onTabChange={setCurrentView}
      title={getTitle()}
    >
      {renderView()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
