import React, { useState } from 'react';
import { User } from '../../types';
import DashboardLayout from './DashboardLayout';

// Sub-components
import PatientHome from './patient/PatientHome';
import DoctorAppointment from './patient/DoctorAppointment';
import NurseAppointment from './patient/NurseAppointment';
import Pharmacy from './patient/Pharmacy';
import LabTests from './patient/LabTests';
import DreptoProducts from './patient/DreptoProducts';
import Ambulance from './patient/Ambulance';
import Profile from './patient/Profile';
import NotificationsPage from './patient/NotificationsPage';

// Icons
import {
  LayoutDashboard,
  Stethoscope,
  TestTube2,
  Pill,
  UserPlus,
  ShoppingBag,
  Ambulance as AmbulanceIcon,
  UserCog
} from 'lucide-react';

interface PatientDashboardProps {
  user: User;
}

// Nav Items Configuration
const NAV_ITEMS = [
  { id: 'home', label: 'Overview', icon: LayoutDashboard },
  { id: 'doctor', label: 'Find Doctors', icon: Stethoscope },
  { id: 'lab', label: 'Lab Tests', icon: TestTube2 },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'nurse', label: 'Nurse Visit', icon: UserPlus },
  { id: 'products', label: 'Drepto Pharmacy', icon: ShoppingBag },
  { id: 'ambulance', label: 'Ambulance', icon: AmbulanceIcon },
  { id: 'profile', label: 'Settings', icon: UserCog },
];

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<string>('home');

  const renderView = () => {
    switch (currentView) {
      case 'doctor':
        return <DoctorAppointment onBack={() => setCurrentView('home')} />;
      case 'nurse':
        return <NurseAppointment onBack={() => setCurrentView('home')} />;
      case 'pharmacy':
        return <Pharmacy onBack={() => setCurrentView('home')} />;
      case 'lab':
        return <LabTests onBack={() => setCurrentView('home')} />;
      case 'products':
        return <DreptoProducts onBack={() => setCurrentView('home')} />;
      case 'ambulance':
        return <Ambulance onBack={() => setCurrentView('home')} />;
      case 'notifications':
        return <NotificationsPage onBack={() => setCurrentView('home')} />;
      case 'profile':
        return <Profile user={user} onBack={() => setCurrentView('home')} />;
      default:
        return <PatientHome user={user} onNavigate={setCurrentView} />;
    }
  };

  // Helper to get title based on view
  const getTitle = () => {
    const item = NAV_ITEMS.find(i => i.id === currentView);
    return item ? item.label : 'Overview';
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

export default PatientDashboard;
