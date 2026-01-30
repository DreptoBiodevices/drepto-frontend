import React from 'react';

const ActivityFeed = () => {
    const activities = [

    ];

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="divide-y">
                {activities.map((item) => (
                    <div key={item.id} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {item.user[0]}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">{item.user}</span> {item.action} <span className="font-medium text-primary">{item.target}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 text-center border-t">
                <button className="text-sm text-primary font-medium hover:underline">View All History</button>
            </div>
        </div>
    );
};

export default ActivityFeed;
