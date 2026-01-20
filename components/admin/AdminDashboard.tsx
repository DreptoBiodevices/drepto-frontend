
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import MedicineCRUD from './MedicineCRUD';
import LabTestCRUD from './LabTestCRUD';
import DashboardStats from './DashboardStats';
import ActivityFeed from './ActivityFeed';
import ProjectManager from './ProjectManager';
import TransactionHistory from './TransactionHistory';

const AdminDashboard = () => {
  const [tab, setTab] = useState('dashboard');

  const getTitle = () => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'medicines': return 'Medicine Management';
      case 'labtests': return 'Lab Test Management';
      case 'projects': return 'Project Management';
      case 'transactions': return 'Transaction History';
      default: return 'Admin Dashboard';
    }
  };

  return (
    <AdminLayout activeTab={tab} setActiveTab={setTab} title={getTitle()}>
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <DashboardStats />
          <div className="grid md:grid-cols-2 gap-6">
            <ActivityFeed />
            {/* We can add another widget here later, e.g., Quick Actions or a Chart */}
            <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col justify-center items-center text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-full text-4xl">🚀</div>
              <div>
                <h3 className="font-bold text-lg">Quick Actions</h3>
                <p className="text-gray-500 text-sm">Common tasks you can perform</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center w-full">
                <button onClick={() => setTab('medicines')} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">Add Medicine</button>
                <button onClick={() => setTab('labtests')} className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100">Add Lab Test</button>
                <button onClick={() => setTab('projects')} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100">New Project</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'medicines' && <MedicineCRUD />}

      {tab === 'labtests' && <LabTestCRUD />}

      {tab === 'projects' && <ProjectManager />}

      {tab === 'transactions' && <TransactionHistory />}
    </AdminLayout>
  );
};

export default AdminDashboard;
