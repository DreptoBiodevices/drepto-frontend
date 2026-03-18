import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface NotificationsPageProps {
    onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
    // Mock Notifications Data
    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'Welcome to Drepto!',
            message: 'Your account has been successfully created. Complete your profile to get the most out of our services.',
            time: 'Just now',
            read: false,
        },
        {
            id: 2,
            type: 'success',
            title: 'Profile Updated',
            message: 'Your general information has been updated successfully.',
            time: '2 hours ago',
            read: true,
        },
        {
            id: 3,
            type: 'warning',
            title: 'Complete your Health Profile',
            message: 'Please add your allergies and past surgeries to your health profile for better recommendations.',
            time: '1 day ago',
            read: true,
        },
        {
            id: 4,
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance is planned for this Sunday at 2:00 AM. Services might be interrupted for 30 minutes.',
            time: '2 days ago',
            read: true,
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'info': return <Info size={20} className="text-blue-500" />;
            case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
            case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
            default: return <Bell size={20} className="text-slate-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'info': return 'bg-blue-50 border-blue-100';
            case 'warning': return 'bg-amber-50 border-amber-100';
            case 'success': return 'bg-emerald-50 border-emerald-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors bg-white shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-slate-500 text-sm">Stay updated with your latest alerts and messages.</p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-semibold text-slate-900 ${!notification.read ? 'text-blue-700' : ''}`}>
                                            {notification.title}
                                            {!notification.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle"></span>}
                                        </h4>
                                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Notifications</h3>
                        <p className="text-slate-500">You're all caught up! Check back later for updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
