

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

import BackButton from './BackButton';

interface LoginProps {
  onToggleView: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleView }) => {
  const [role, setRole] = useState<UserRole | string>('Patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    try {
      await login(identifier, password, role as string);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>
      <h2 className="text-2xl font-bold text-center text-dark-blue mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </p>}
        <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-dark-blue transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5">
          Sign In
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <button onClick={onToggleView} className="font-semibold text-primary hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
