
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (identifier: string) => void;
  logout: () => void;
  register: (details: Omit<User, 'id'>) => void;
  updateUser: (details: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (identifier: string) => {
    // Determine Role Logic (Universal Login)
    let role = UserRole.PATIENT;
    const lowerId = identifier.toLowerCase();

    if (lowerId.includes('admin')) {
      // Admin logic usually handled separate, but for mock purposes:
      // In real app, AdminLogin component handles this separately or we redirect
    } else if (lowerId.includes('dr') || lowerId.includes('doc')) {
      role = UserRole.DOCTOR;
    } else if (lowerId.includes('nurse')) {
      role = UserRole.NURSE;
    }

    console.log(`Logging in using Universal Login for: ${identifier} -> Detected Role: ${role}`);

    // Generate dynamic name
    let firstName = 'User';
    let lastName = 'Test';

    if (identifier.includes('@')) {
      const namePart = identifier.split('@')[0];
      if (namePart.includes('.')) {
        firstName = namePart.split('.')[0];
        lastName = namePart.split('.')[1] || 'User';
      } else {
        firstName = namePart;
      }
    } else {
      firstName = identifier;
    }

    // Capitalize
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    const storageKey = `drepto_has_logged_in_${identifier}`;
    const hasLoggedInBefore = localStorage.getItem(storageKey);
    const isFirstLogin = !hasLoggedInBefore;

    if (isFirstLogin) {
      localStorage.setItem(storageKey, 'true');
    }

    const mockUser: User = {
      id: '123',
      firstName,
      lastName,
      email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
      role,
      isFirstLogin,
      mobileNumber: '',
      gender: '',
      age: '',
      bloodGroup: '',
      weight: ''
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const register = (details: Omit<User, 'id'>) => {
    // Mock registration logic - Default to Patient
    console.log('Registering user:', details);
    const newUser: User = {
      id: Date.now().toString(),
      ...details,
      // Default empty/placeholder values for new profile fields if not provided
      mobileNumber: '',
      gender: '',
      age: '',
      bloodGroup: '',
      weight: ''
    };
    setUser(newUser);
  };

  const updateUser = (details: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      console.log('User profile updated:', updatedUser);
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout, register, updateUser } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
