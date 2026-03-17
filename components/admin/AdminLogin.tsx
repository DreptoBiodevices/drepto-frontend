// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS, ADMIN_AUTH_KEY } from './adminData';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Attempting admin login with:', { email, password });
    console.log('Expected:', ADMIN_CREDENTIALS);

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      console.log('Credentials match! Setting localStorage and navigating...');
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('admin-auth-change'));
      navigate('/admin/dashboard');
    } else {
      console.log('Credentials mismatch');
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">Admin Login</h1>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
            Login
          </button>
          <button type="button" onClick={() => navigate('/login')} className="w-full text-primary mt-2 hover:underline">
            Back to user login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
