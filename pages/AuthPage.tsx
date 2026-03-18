import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLoginView(params.get('mode') !== 'signup');
  }, [location.search]);

  const toggleView = () => setIsLoginView(v => !v);

  return (
    <div className="flex h-screen bg-white">

      {/* ── Left: dark image panel ──────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
        style={{
          backgroundImage: `url('/images/auth-bg.webp'), linear-gradient(135deg, #0c1a2e 0%, #1a3a5c 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/">
            <img src="/images/logo.png" alt="Drepto" className="h-7 brightness-0 invert" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            Back to website
          </Link>
        </div>

        {/* tagline */}
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Redefining how<br />patients receive<br />treatment.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Non-invasive, research-backed drug delivery from the labs of IIT Bombay.
          </p>
          <div className="mt-8 w-10 h-px bg-white/25" />
        </div>
      </div>

      {/* ── Right: form panel ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <Link to="/">
            <img src="/images/logo.png" alt="Drepto" className="h-7" />
          </Link>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
            ← Back
          </Link>
        </div>

        {/* form — vertically centred */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            {isLoginView ? (
              <Login onToggleView={toggleView} />
            ) : (
              <Register onToggleView={toggleView} />
            )}

            {/* admin shortcut */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/admin/login')}
                className="text-[10px] font-semibold tracking-widest uppercase text-gray-300 hover:text-primary transition-colors"
              >
                Admin access
              </button>
            </div>
          </div>
        </div>

        {/* footer */}
        <p className="text-center text-[10px] text-gray-300 pb-6">
          © {new Date().getFullYear()} Drepto Biodevices Pvt. Ltd.
        </p>
      </div>

    </div>
  );
};

export default AuthPage;
