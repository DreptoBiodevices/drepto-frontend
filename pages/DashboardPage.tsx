import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';
import PatientDashboard from '../components/dashboards/PatientDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import NurseDashboard from '../components/dashboards/NurseDashboard';
import BackButton from '../components/BackButton';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdminAuthed = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';

  if (!user) {
    // If no user in context, send to auth login
    return <Navigate to="/auth" />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.PATIENT:
        return <PatientDashboard user={user} />;
      case UserRole.DOCTOR:
        return <DoctorDashboard user={user} />;
      case UserRole.NURSE:
        return <NurseDashboard user={user} />;
      default:
        // Unknown role: if admin session exists, send to admin, else home
        return isAdminAuthed ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />;
    }
  };

  // DashboardLayout within each sub-dashboard handles the header and structure now.
  // We just need to route to the correct component based on role.

  return (
    <>
      {renderDashboard()}
    </>
  );
};

export default DashboardPage;