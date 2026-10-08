
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { UserService, NurseService, AuthorizedService, DoctorService } from '../lib/api_controller';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password?: string, role?: string) => Promise<void>;
  logout: () => void;
  register: (details: any) => Promise<void>;
  updateUser: (details: Partial<User>) => void;
  isLoading: boolean;
  checkPasswordStrength: (password: string) => { strong: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser); // Set immediate generic data

          // Fetch fresh data to ensure valid token and up-to-date info
          try {
            let response;
            // Determine service based on role
            if (parsedUser.role === UserRole.NURSE) {
              response = await NurseService.getNurseById(parsedUser.id);
            } else if (parsedUser.role === UserRole.DOCTOR || parsedUser.role === UserRole.ADMIN) {
              response = await AuthorizedService.getAuthorizedById(parsedUser.id);
            } else {
              // Default Patient
              response = await UserService.getUserById(parsedUser.id);
            }

            if (response && response.data) {
              const freshUser = { ...parsedUser, ...response.data };
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            }
          } catch (apiError: any) {
            console.error("Failed to refresh user data:", apiError);
            if (apiError.response && apiError.response.status === 401) {
              // Token expired or invalid
              logout();
            }
          }

        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password?: string, role?: string) => {
    setIsLoading(true);
    try {
      if (!password) throw new Error("Password is required");

      let response;
      // If identifier looks like an email, it MUST be a User/Patient or Admin email login (if supported)
      // But endpoint docs say 'mobileNumber' for Nurse/Authorized. User supports 'email' OR 'mobileNumber'
      const isEmail = identifier.includes('@');

      const loginPayload = {
        mobileNumber: isEmail ? undefined : Number(identifier),
        password,
      };



      if (role === 'Nurse') {
        if (isEmail) throw new Error("Nurses must login with a mobile number.");
        response = await NurseService.login(loginPayload);
      } else if (role === 'Doctor' || role === 'Admin') {
        if (isEmail) throw new Error("Doctors and Admins must login with a mobile number.");
        response = await AuthorizedService.login(loginPayload);
      } else {
        // Default to User (Patient)
        const userPayload = isEmail
          ? { email: identifier, password }
          : { mobileNumber: Number(identifier.replace(/\D/g, '')), password }; // Sanitize mobile number
        response = await UserService.login(userPayload);
      }

      const { token, ...userData } = response.data; // Adjust based on actual API response structure
      // If the response structure is different (e.g. data.token, data.user), we might need to adjust.
      // Assuming response.data contains the token and user fields directly or nested.

      // Let's assume standard JWT response: { accessToken: "...", user: { ... } } or similar.
      // Since I don't have the response example, I'll log it and try to adapt.


      const authToken = response.data.accessToken || response.data.token;
      const userObj = response.data.user || response.data.data || userData;

      if (authToken) {
        localStorage.setItem('token', authToken);
      }

      // Map API user to App User type if necessary
      const appUser: User = {
        id: userObj._id || userObj.id,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        role: role as UserRole || UserRole.PATIENT, // Fallback
        mobileNumber: userObj.mobileNumber,
        gender: userObj.gender,
        age: userObj.age,
        // Add other fields as needed
        ...userObj
      };

      localStorage.setItem('user', JSON.stringify(appUser));
      setUser(appUser);

    } catch (error: any) {
      console.error("Login failed full error:", error); // Enhanced Logging
      console.error("Login response data:", error.response?.data); // Log response data
      throw new Error(error.response?.data?.message || error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const checkPasswordStrength = (password: string): { strong: boolean; message: string } => {
    if (!password) return { strong: false, message: "Password is required" };
    if (password.length < 8) return { strong: false, message: "Password must be at least 8 characters long" };
    if (!/[A-Z]/.test(password)) return { strong: false, message: "Password must contain at least one uppercase letter" };
    if (!/[a-z]/.test(password)) return { strong: false, message: "Password must contain at least one lowercase letter" };
    if (!/\d/.test(password)) return { strong: false, message: "Password must contain at least one number" };
    if (!/[\W_]/.test(password)) return { strong: false, message: "Password must contain at least one special character" };

    return { strong: true, message: "Strong password" };
  };

  const register = async (details: any) => {
    setIsLoading(true);
    try {
      // Password validation
      const password = details.password;
      const strength = checkPasswordStrength(password);

      if (!strength.strong) {
        throw new Error(strength.message);
      }

      let response;
      const { role, ...rest } = details;



      if (role === UserRole.NURSE) {
        response = await NurseService.register(rest);
      } else if (role === UserRole.DOCTOR || role === UserRole.ADMIN) {
        // Map to Authorized Register
        // Authorized register needs 'roleTitle' maybe?
        const authorizedPayload = {
          ...rest,
          role: role, // Pass the role string
          roleTitle: role, // Maybe required?
        };
        response = await AuthorizedService.register(authorizedPayload);
      } else {
        // Default Patient
        const userPayload = {
          ...rest,
          role: 'Patient'
        };
        response = await UserService.register(userPayload);
      }



      // Auto-login after register if token is returned, otherwise ask to login
      const authToken = response.data.accessToken || response.data.token;
      if (authToken) {
        localStorage.setItem('token', authToken);
        const userObj = response.data.user || response.data.data || rest;
        const appUser: User = {
          id: userObj._id || userObj.id || 'new_id',
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email,
          role: role,
          mobileNumber: userObj.mobileNumber,
          ...userObj
        };
        localStorage.setItem('user', JSON.stringify(appUser));
        setUser(appUser);
      }

    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error.response?.data?.message || error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (details: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Keep sync
      
      try {
        if (updatedUser.role === UserRole.NURSE) {
          await NurseService.updateNurse(updatedUser.id, details);
        } else if (updatedUser.role === UserRole.DOCTOR || updatedUser.role === UserRole.ADMIN) {
          await AuthorizedService.updateAuthorized(updatedUser.id, details);
        } else {
          await UserService.updateUser(updatedUser.id, details);
        }
      } catch (error) {
        console.error("Failed to update user on server:", error);
      }
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout, register, updateUser, isLoading, checkPasswordStrength } },
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
