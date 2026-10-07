

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

import BackButton from './BackButton';

interface LoginProps {
  onToggleView: () => void;
  hideBackButton?: boolean;
}

const Login: React.FC<LoginProps> = ({ onToggleView, hideBackButton }) => {
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
      {!hideBackButton && (
        <div className="mb-4">
          <BackButton />
        </div>
      )}
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

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="button"
            onClick={() => window.location.href = 'https://api.dreptobiodevices.com/auth/google'}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
          
          {/* 
          <button
            type="button"
            onClick={() => window.location.href = 'https://api.dreptobiodevices.com/auth/apple'}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-900 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M16.365 14.384c-.015-3.056 2.502-4.526 2.617-4.598-1.423-2.083-3.629-2.366-4.412-2.399-1.874-.189-3.655 1.103-4.607 1.103-.951 0-2.42-1.076-3.955-1.047-2.015.029-3.873 1.171-4.908 2.97-2.099 3.639-.537 9.023 1.503 11.968 1.002 1.442 2.188 3.064 3.766 3.006 1.48-.059 2.046-.957 3.844-.957 1.783 0 2.305.957 3.86.928 1.602-.029 2.618-1.479 3.593-2.915 1.127-1.642 1.593-3.235 1.614-3.32-.034-.016-3.109-1.192-3.12-4.739m-2.187-6.262c.808-.977 1.353-2.336 1.205-3.69-.17.065-1.579.97-2.425 1.986-.757.904-1.35 2.274-1.173 3.606 1.488.115 2.802-.857 3.593-1.902" />
            </svg>
            Sign in with Apple
          </button>
          */}
        </div>
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
