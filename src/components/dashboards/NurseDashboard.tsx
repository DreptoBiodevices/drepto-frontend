import React, { useState } from 'react';
import { User } from '../../types';
import DashboardLayout from './DashboardLayout';

// Sub-components
import NurseHome from './nurse/NurseHome';
import NurseAppointments from './nurse/NurseAppointments';
import NurseTasks from './nurse/NurseTasks';
import NurseProfile from './nurse/NurseProfile';

// Icons
import {
  LayoutDashboard,
  Stethoscope,
  CheckSquare,
  UserCog
} from 'lucide-react';

interface NurseDashboardProps {
  user: User;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Home Visits', icon: Stethoscope },
  { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
  { id: 'profile', label: 'Profile', icon: UserCog },
];

const NurseDashboard: React.FC<NurseDashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<string>('home');

  const renderView = () => {
    switch (currentView) {
      case 'appointments':
        return <NurseAppointments onBack={() => setCurrentView('home')} />;
      case 'tasks':
        return <NurseTasks onBack={() => setCurrentView('home')} />;
      case 'profile':
        return <NurseProfile user={user} onBack={() => setCurrentView('home')} />;
      default:
        return <NurseHome user={user} onNavigate={setCurrentView} />;
    }
  };

  const getTitle = () => {
    const item = NAV_ITEMS.find(i => i.id === currentView);
    return item ? item.label : 'Nurse Portal';
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

export default NurseDashboard;
