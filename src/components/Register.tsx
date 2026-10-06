import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface RegisterProps {
  onToggleView: () => void;
}

const inputCls = 'w-full px-4 py-3 bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors duration-200';
const selectCls = 'w-full px-4 py-3 bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-primary transition-colors duration-200 appearance-none cursor-pointer';

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
      {label}{required && <span className="text-primary ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const ChevronDown = () => (
  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const Register: React.FC<RegisterProps> = ({ onToggleView }) => {
  const [formData, setFormData] = useState({
    role: UserRole.PATIENT,
    firstName: '', lastName: '', email: '',
    mobileNumber: '', gender: '', age: '',
    password: '', confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{ strong: boolean; message: string }>({ strong: false, message: '' });
  const { register, checkPasswordStrength } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword, ...userDetails } = formData;
    if (Object.values(userDetails).some(f => f === '') || !password) { setError('Please fill in all fields.'); return; }
    if (!passwordStrength.strong) { setError(passwordStrength.message); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreedToTerms) { setError('You must agree to the Terms and Conditions.'); return; }
    setError('');
    try {
      await register({
        firstName: userDetails.firstName, lastName: userDetails.lastName,
        email: userDetails.email, role: userDetails.role,
        mobileNumber: Number(userDetails.mobileNumber),
        gender: userDetails.gender, age: Number(userDetails.age), password,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">Get started</p>
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">Create account.</h2>
        <p className="text-sm text-gray-400 mt-1">Fill in your details to register.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* role */}
        <Field label="I am a" required>
          <div className="relative">
            <select name="role" value={formData.role} onChange={handleChange}
              style={{ borderRadius: '0.25rem' }} className={selectCls}>
              <option value={UserRole.PATIENT}>Patient</option>
              <option value={UserRole.DOCTOR}>Doctor</option>
              <option value={UserRole.NURSE}>Nurse</option>
            </select>
            <ChevronDown />
          </div>
        </Field>

        {/* name */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" required>
            <input type="text" name="firstName" placeholder="Jane" value={formData.firstName}
              onChange={handleChange} style={{ borderRadius: '0.25rem' }} className={inputCls} />
          </Field>
          <Field label="Last name" required>
            <input type="text" name="lastName" placeholder="Smith" value={formData.lastName}
              onChange={handleChange} style={{ borderRadius: '0.25rem' }} className={inputCls} />
          </Field>
        </div>

        <Field label="Email" required>
          <input type="email" name="email" placeholder="jane@example.com" value={formData.email}
            onChange={handleChange} style={{ borderRadius: '0.25rem' }} className={inputCls} />
        </Field>

        <Field label="Mobile number" required>
          <input type="tel" name="mobileNumber" placeholder="+91 98765 43210" value={formData.mobileNumber}
            onChange={handleChange} style={{ borderRadius: '0.25rem' }} className={inputCls} />
        </Field>

        {/* gender + age */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gender" required>
            <div className="relative">
              <select name="gender" value={formData.gender} onChange={handleChange}
                style={{ borderRadius: '0.25rem' }}
                className={`${selectCls} ${!formData.gender ? 'text-gray-300' : ''}`}>
                <option value="" disabled>Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown />
            </div>
          </Field>
          <Field label="Age" required>
            <input type="number" name="age" placeholder="28" value={formData.age}
              onChange={handleChange} style={{ borderRadius: '0.25rem' }} className={inputCls} />
          </Field>
        </div>

        {/* password */}
        <Field label="Password" required>
          <input type="password" name="password" placeholder="Min. 8 characters" value={formData.password}
            onChange={handleChange} style={{ borderRadius: '0.25rem' }}
            className={`${inputCls} ${formData.password && !passwordStrength.strong ? 'border-red-300' : ''}`} />
          {formData.password && (
            <p className={`text-[10px] font-semibold mt-0.5 ${passwordStrength.strong ? 'text-green-600' : 'text-red-400'}`}>
              {passwordStrength.message}
            </p>
          )}
        </Field>

        <Field label="Confirm password" required>
          <input type="password" name="confirmPassword" placeholder="Repeat password" value={formData.confirmPassword}
            onChange={handleChange} style={{ borderRadius: '0.25rem' }} className={inputCls} />
        </Field>

        {error && (
          <p className="text-xs text-red-500 border-l-2 border-red-400 pl-3">{error}</p>
        )}

        {/* terms */}
        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <div
            onClick={() => setAgreedToTerms(v => !v)}
            style={{ borderRadius: '0.125rem' }}
            className={`w-4 h-4 mt-0.5 flex-shrink-0 border flex items-center justify-center transition-colors ${
              agreedToTerms ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'
            }`}
          >
            {agreedToTerms && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <input type="checkbox" className="hidden" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
          <span className="text-xs text-gray-400 leading-relaxed select-none">
            I agree to the{' '}
            <Link to="/terms" className="font-semibold text-gray-900 border-b border-gray-900 pb-0.5 hover:text-primary hover:border-primary transition-colors">
              Terms and Conditions
            </Link>
          </span>
        </label>

        <button
          type="submit"
          style={{ borderRadius: '0.25rem' }}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-900 text-white text-sm font-bold hover:bg-primary transition-colors duration-200"
        >
          Create account
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-6">
        Already have an account?{' '}
        <button
          onClick={onToggleView}
          className="font-semibold text-gray-900 border-b border-gray-900 pb-0.5 hover:text-primary hover:border-primary transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Register;