

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
