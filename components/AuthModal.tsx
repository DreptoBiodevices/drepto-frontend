import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';
import Register from './Register';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal: React.FC = () => {
  const { authModalView, setAuthModalView } = useAuth();
  const navigate = useNavigate();

  if (!authModalView) return null;

  const isLoginView = authModalView === 'login';

  const toggleView = () => {
    setAuthModalView(isLoginView ? 'signup' : 'login');
  };

  const close = () => {
    setAuthModalView(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl flex flex-col hide-scrollbar">
        {/* Header Section */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 border-b border-gray-100 p-4 rounded-t-3xl flex items-center justify-between">
          <img src="/images/logo.png" alt="Drepto Logo" className="h-8 object-contain" />
          <button 
            onClick={close}
            className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="text-center mb-6">
            <p className="text-gray-500 font-medium">Quality Healthcare, Anytime, Anywhere.</p>
          </div>

          <div className="transition-all duration-500">
            {isLoginView ? (
              <Login onToggleView={toggleView} hideBackButton={true} />
            ) : (
              <Register onToggleView={toggleView} hideBackButton={true} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
