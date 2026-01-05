import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface DashboardLayoutProps {
    user: User;
    navItems: NavItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    children: React.ReactNode;
    title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, navItems, activeTab, onTabChange, children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();



    // Close sidebar on route change or tab change on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 flex-col md:flex-row">


            {/* --- Mobile Sidebar Overlay --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- Sidebar --- */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Logo Area */}
                <div className="p-5 flex items-center">
                    <img src="/images/logo.png" alt="Drepto Logo" className="w-30 h-30 bg-white object-contain p-1" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 mt-2">Menu</p>
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                            >
                                <div className={`
                                    w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                                    ${isActive ? 'bg-white shadow-sm text-blue-600' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-slate-600'}
                                `}>
                                    <item.icon size={18} />
                                </div>
                                {item.label}
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            </button>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-50 mx-4 mb-4">
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 relative group hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 border border-slate-100/50 hover:border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-red-500 rounded-lg flex items-center justify-center shadow-sm opacity-50 hover:opacity-100 transition-all hover:bg-red-50"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-[calc(100vh-80px)] md:h-screen bg-[#F8FAFC]">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-6 md:px-10 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100/50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{title || 'Overview'}</h2>
                            <p className="text-sm text-slate-500 hidden sm:block">
                                {user.isFirstLogin || user.isFirstLogin === undefined ? 'Welcome' : 'Welcome back'}, {user.firstName}!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Date Pill (Desktop) */}
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span className="text-sm font-semibold text-slate-600">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>

                        {/* Notifications */}
                        <button
                            onClick={() => onTabChange('notifications')}
                            className="relative w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:shadow-sm transition-all text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
