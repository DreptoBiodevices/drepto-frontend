// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS, ADMIN_AUTH_KEY } from './adminData';

const inputCls = 'w-full px-0 py-2.5 bg-transparent border-0 border-b border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors duration-200';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{label}</label>
    {children}
  </div>
);

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      window.dispatchEvent(new Event('admin-auth-change'));
      navigate('/drepto-admin/dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* header */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">Restricted access</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Admin sign in.</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className={inputCls}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className={inputCls}
            />
          </Field>

          {error && (
            <p className="text-xs text-red-500 border-l-2 border-red-400 pl-3">{error}</p>
          )}

          <button
            type="submit"
            style={{ borderRadius: '0.25rem' }}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors duration-200"
          >
            Sign in
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity"
          >
            ← Back to user login
          </button>
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;