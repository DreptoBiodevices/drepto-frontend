

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BackButton from './BackButton';
import { UserRole } from '../types';

interface RegisterProps {
  onToggleView: () => void;
  hideBackButton?: boolean;
}

const Register: React.FC<RegisterProps> = ({ onToggleView, hideBackButton }) => {
  const [formData, setFormData] = useState({
    role: UserRole.PATIENT,
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    age: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{ strong: boolean; message: string }>({ strong: false, message: '' });
  const { register, checkPasswordStrength } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword, ...userDetails } = formData;

    // Check for empty fields including password
    if (Object.values(userDetails).some(field => field === '') || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!passwordStrength.strong) {
      setError(passwordStrength.message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    setError('');

    try {
      await register({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        role: userDetails.role,
        mobileNumber: Number(userDetails.mobileNumber),
        gender: userDetails.gender,
        age: Number(userDetails.age),
        password: password
      });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div>
      {!hideBackButton && (
        <div className="mb-4">
          <BackButton />
        </div>
      )}
      <h2 className="text-2xl font-bold text-center text-dark-blue mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Role Selection */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-500 ml-1 mb-1 block">I am a</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-700 font-medium"
          >
            <option value={UserRole.PATIENT}>Patient</option>
            <option value={UserRole.DOCTOR}>Doctor</option>
            <option value={UserRole.NURSE}>Nurse</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
        />
        <input
          type="tel"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary text-gray-500"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-1">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-primary focus:border-primary ${formData.password && !passwordStrength.strong ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {formData.password && (
            <p className={`text-xs ${passwordStrength.strong ? 'text-green-600' : 'text-red-500'}`}>
              {passwordStrength.message}
            </p>
          )}
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-2 my-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
            I agree to the <Link to="/terms" className="text-primary font-semibold hover:underline">Terms and Conditions</Link>
          </label>
        </div>

        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Sign Up
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or sign up with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>
          
          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:3000/auth/apple'}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-900 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M16.365 14.384c-.015-3.056 2.502-4.526 2.617-4.598-1.423-2.083-3.629-2.366-4.412-2.399-1.874-.189-3.655 1.103-4.607 1.103-.951 0-2.42-1.076-3.955-1.047-2.015.029-3.873 1.171-4.908 2.97-2.099 3.639-.537 9.023 1.503 11.968 1.002 1.442 2.188 3.064 3.766 3.006 1.48-.059 2.046-.957 3.844-.957 1.783 0 2.305.957 3.86.928 1.602-.029 2.618-1.479 3.593-2.915 1.127-1.642 1.593-3.235 1.614-3.32-.034-.016-3.109-1.192-3.12-4.739m-2.187-6.262c.808-.977 1.353-2.336 1.205-3.69-.17.065-1.579.97-2.425 1.986-.757.904-1.35 2.274-1.173 3.606 1.488.115 2.802-.857 3.593-1.902" />
            </svg>
            Sign up with Apple
          </button>
        </div>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <button onClick={onToggleView} className="font-semibold text-primary hover:underline">
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register;
