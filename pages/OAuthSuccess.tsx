import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserService } from '../lib/api_controller';

const OAuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // or directly manage state if needed

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');

      if (token && userId) {
        localStorage.setItem('token', token);
        
        try {
          const response = await UserService.getUserById(userId);
          if (response && response.data) {
            const userData = response.data;
            const appUser = {
              id: userData._id || userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              role: userData.role || 'Patient',
              mobileNumber: userData.mobileNumber,
              gender: userData.gender,
              age: userData.age,
              ...userData
            };
            
            localStorage.setItem('user', JSON.stringify(appUser));
            
            // Reload the page to root to re-initialize auth context properly
            window.location.href = '/dashboard';
          } else {
            navigate('/?error=user_not_found');
          }
        } catch (error) {
          console.error('Failed to fetch user data after OAuth:', error);
          navigate('/?error=oauth_failed');
        }
      } else {
        navigate('/');
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Authentication Successful!</h2>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
        <div className="mt-4 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;
