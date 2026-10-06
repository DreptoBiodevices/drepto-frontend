import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../ui/Navigation';
import { Button } from '../ui/Button';

// Import views with lazy loading
const PatientHome = React.lazy(() => import('./patient/PatientHome'));
const DoctorAppointment = React.lazy(() => import('./patient/DoctorAppointment'));
const NurseAppointment = React.lazy(() => import('./patient/NurseAppointment'));
const Pharmacy = React.lazy(() => import('./patient/Pharmacy'));
const LabTests = React.lazy(() => import('./patient/LabTests'));
const DreptoProducts = React.lazy(() => import('./patient/DreptoProducts'));
const Ambulance = React.lazy(() => import('./patient/Ambulance'));
const Profile = React.lazy(() => import('./patient/Profile'));

// Icons
const HomeIcon = ({ active, className }: { active?: boolean; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('w-5 h-5', className, active ? 'text-white' : 'text-current')}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const DoctorIcon = ({ active, className }: { active?: boolean; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('w-5 h-5', className, active ? 'text-white' : 'text-current')}>
    <path d="M4.8 2.3A.3.3 0 0 0 5 2.5h14a.2.2 0 0 0 .2-.2V2a.2.2 0 0 0-.2-.2H5a.2.2 0 0 0-.2.2v.3zM6 15h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"/>
    <path d="M11 2v3.38a1.5 1.5 0 0 0 1.5 1.5h1.72"/>
    <path d="M5.5 14.5A2.5 2.5 0 0 1 8 12h8a2.5 2.5 0 0 1 2.5 2.5v2.5a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-2.5z"/>
    <path d="M12 12v4"/>
    <path d="M12 8v1"/>
    <circle cx="12" cy="6" r="2"/>
  </svg>
);

// ... (other icon components with similar updates)

interface EnhancedPatientDashboardProps {
  user: User;
}

const EnhancedPatientDashboard: React.FC<EnhancedPatientDashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: HomeIcon,
      onClick: () => {
        setCurrentView('home');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      id: 'doctor', 
      label: 'Doctors', 
      icon: DoctorIcon,
      onClick: () => {
        setCurrentView('doctor');
        setIsMobileMenuOpen(false);
      }
    },
    // ... other nav items
  ];

  const renderView = () => {
    const views: Record<string, React.ReactNode> = {
      'home': <PatientHome user={user} onNavigate={setCurrentView} />,
      'doctor': <DoctorAppointment onBack={() => setCurrentView('home')} />,
      // ... other views
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }>
            {views[currentView] || <div>View not found</div>}
          </React.Suspense>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className={cn(
        "md:hidden sticky top-0 z-30 bg-white transition-shadow duration-200",
        isScrolled ? "shadow-sm" : ""
      )}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              {currentView === 'home' ? 'Dashboard' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView('profile')}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu</h2>
            <Navigation 
              items={navItems} 
              currentPath={currentView}
              activeItemClassName="bg-primary text-white"
            />
          </div>
          
          <div className="mt-auto p-6 border-t border-gray-100">
            <div 
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setCurrentView('profile')}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <Navigation 
                  items={navItems} 
                  currentPath={currentView}
                  activeItemClassName="bg-primary text-white"
                  orientation="vertical"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <Icon active={isActive} className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default EnhancedPatientDashboard;
