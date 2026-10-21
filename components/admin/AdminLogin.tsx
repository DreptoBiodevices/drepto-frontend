// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS, ADMIN_AUTH_KEY } from './adminData';
import { UserService } from '../../lib/api_controller';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const targetEmail = (ADMIN_CREDENTIALS.email || 'Dreptoadmin@gmail.com').trim().toLowerCase();
    const inputPass = password.trim();
    const targetPass = (ADMIN_CREDENTIALS.password || 'Drepto2025').trim();

    if (inputEmail === targetEmail && inputPass === targetPass) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');

      let authToken = 'admin_session_token';
      try {
        const apiLoginRes = await UserService.login({ email: targetEmail, password: targetPass });
        if (apiLoginRes?.data?.token) {
          authToken = apiLoginRes.data.token;
        }
      } catch (err) {
        console.warn('Backend admin login fallback', err);
      }

      const adminUser = {
        id: 'admin_master',
        firstName: 'Drepto',
        lastName: 'Admin',
        email: ADMIN_CREDENTIALS.email,
        role: 'Admin',
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('token', authToken);
      window.dispatchEvent(new Event('admin-auth-change'));
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white mb-3 shadow-md shadow-teal-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in with authorized Drepto administrator credentials</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                placeholder="Dreptoadmin@gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-teal-700 active:scale-[0.99] transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Enter Admin Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to store
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
