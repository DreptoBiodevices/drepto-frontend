import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginProps {
  onToggleView: () => void;
}

const inputCls = 'w-full px-4 py-3 bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors duration-200';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{label}</label>
    {children}
  </div>
);

const Login: React.FC<LoginProps> = ({ onToggleView }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">Welcome back</p>
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">Sign in.</h2>
        <p className="text-sm text-gray-400 mt-1">Enter your credentials to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email or phone">
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="jane@example.com"
            style={{ borderRadius: '0.25rem' }}
            className={inputCls}
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ borderRadius: '0.25rem' }}
            className={inputCls}
          />
        </Field>

        {error && (
          <p className="text-xs text-red-500 border-l-2 border-red-400 pl-3">{error}</p>
        )}

        <button
          type="submit"
          style={{ borderRadius: '0.25rem' }}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-900 text-white text-sm font-bold hover:bg-primary transition-colors duration-200 mt-2"
        >
          Sign in
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-8">
        Don't have an account?{' '}
        <button
          onClick={onToggleView}
          className="font-semibold text-gray-900 border-b border-gray-900 pb-0.5 hover:text-primary hover:border-primary transition-colors"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;