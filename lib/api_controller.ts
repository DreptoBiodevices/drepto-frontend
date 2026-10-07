
import axios, { AxiosResponse } from 'axios';

// Use environment variable for API URL or default to production
// In local development, VITE_API_URL should be set to http://localhost:6001
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.dreptobiodevices.com';

// Create Axios Instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle errors globally and hide exact server errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'An unexpected error occurred. Please try again later.';

    if (error.response) {
      const status = error.response.status;
      const originalMessage = error.response.data?.message;
      
      if (status >= 500) {
        customMessage = 'Our servers are currently experiencing issues. Please try again later.';
      } else if (status === 401) {
        customMessage = 'Invalid credentials or session expired. Please log in again.';
      } else if (status === 403) {
        customMessage = 'You do not have permission to access this resource.';
      } else if (status === 404) {
        customMessage = 'The requested information could not be found.';
      } else if (status >= 400 && status < 500) {
        // For client errors (e.g. invalid login, bad data), we show the specific message if provided,
        // otherwise a generic fallback.
        customMessage = originalMessage || 'There was an issue with your request. Please verify your details.';
        
        // Handle NestJS validation error arrays
        if (Array.isArray(customMessage)) {
          customMessage = customMessage.join(', ');
        } else if (typeof customMessage !== 'string') {
          customMessage = 'There was an issue with your request. Please verify your details.';
        }
      }

      // Overwrite the error properties to prevent leaking raw internal errors to UI
      error.message = customMessage;
      if (!error.response.data) {
        error.response.data = {};
      }
      error.response.data.message = customMessage;
      
    } else if (error.request) {
      // Request was made but no response was received (e.g., network error)
      customMessage = 'Unable to connect to the server. Please check your internet connection.';
      error.message = customMessage;
    } else {
      error.message = customMessage;
    }

    return Promise.reject(error);
  }
);

// --- API Methods ---

// App Controller
export const AppService = {
  mongoTest: () => api.get('/mongo-test'),
  getAllNurses: () => api.get('/Allnurse-mongo'),
  getAllUsers: () => api.get('/Allusers'),
  bookAppointment: (data: any) => api.post('/appointments', data),
  getUserAppointments: (userId: string) => api.get(`/appointments/${userId}`),
  getMetrics: () => api.get('/metrics'),
};

// Product Controller
export const ProductService = {
  createProduct: (data: any) => api.post('/products', data),
  getAllProducts: () => api.get('/products'),
  getProductById: (id: string) => api.get(`/products/${id}`),
  updateProduct: (id: string, data: any) => api.patch(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

// Nurse Controller
export const NurseService = {
  register: (data: any) => api.post('/nurse/register', data),
  login: (data: any) => api.post('/nurse/login', data),
  getAllNurses: () => api.get('/nurse'),
  getNurseById: (id: string) => api.get(`/nurse/${id}`),
  updateNurse: (id: string, data: any) => api.patch(`/nurse/${id}`, data),
  deleteNurse: (id: string) => api.delete(`/nurse/${id}`),
};

// Authorized Controller
export const AuthorizedService = {
  register: (data: any) => api.post('/authorized/register', data),
  login: (data: any) => api.post('/authorized/login', data),
  getAllAuthorized: () => api.get('/authorized'),
  getAuthorizedById: (id: string) => api.get(`/authorized/${id}`),
  updateAuthorized: (id: string, data: any) => api.patch(`/authorized/${id}`, data),
  deleteAuthorized: (id: string) => api.delete(`/authorized/${id}`),
};

// Doctor Appointment Controller
export const DoctorAppointmentService = {
  create: (data: any) => api.post('/doctor-appointment', data),
  getAll: () => api.get('/doctor-appointment'),
  getById: (id: string) => api.get(`/doctor-appointment/${id}`),
  update: (id: string, data: any) => api.patch(`/doctor-appointment/${id}`, data),
  delete: (id: string) => api.delete(`/doctor-appointment/${id}`),
};

// Doctor Time Slot Controller
export const DoctorTimeSlotService = {
  create: (data: any) => api.post('/doctor-timeslot', data),
  getAll: () => api.get('/doctor-timeslot'),
  getById: (id: string) => api.get(`/doctor-timeslot/${id}`),
  update: (id: string, data: any) => api.patch(`/doctor-timeslot/${id}`, data),
  delete: (id: string) => api.delete(`/doctor-timeslot/${id}`),
};

// Doctor Controller
export const DoctorService = {
  create: (data: any) => api.post('/doctor', data),
  getAll: () => api.get('/doctor'),
  getById: (id: string) => api.get(`/doctor/${id}`),
  update: (id: string, data: any) => api.patch(`/doctor/${id}`, data),
  delete: (id: string) => api.delete(`/doctor/${id}`),
};

// Lab Center Controller
export const LabCenterService = {
  create: (data: any) => api.post('/lab-center', data),
  getAll: () => api.get('/lab-center'),
  getById: (id: string) => api.get(`/lab-center/${id}`),
  update: (id: string, data: any) => api.patch(`/lab-center/${id}`, data),
  delete: (id: string) => api.delete(`/lab-center/${id}`),
};

// Lab Slot Controller
export const LabSlotService = {
  create: (data: any) => api.post('/lab-slot', data),
  getAll: () => api.get('/lab-slot'),
  getById: (id: string) => api.get(`/lab-slot/${id}`),
  update: (id: string, data: any) => api.patch(`/lab-slot/${id}`, data),
  delete: (id: string) => api.delete(`/lab-slot/${id}`),
};

// Lab Test Booking Controller
export const LabTestBookingService = {
  create: (data: any) => api.post('/lab-test-booking', data),
  getAll: () => api.get('/lab-test-booking'),
  getById: (id: string) => api.get(`/lab-test-booking/${id}`),
  update: (id: string, data: any) => api.patch(`/lab-test-booking/${id}`, data),
  delete: (id: string) => api.delete(`/lab-test-booking/${id}`),
};

// Nurse Appointment Controller
export const NurseAppointmentService = {
  create: (data: any) => api.post('/nurse-appointment', data),
  getAll: () => api.get('/nurse-appointment'),
  getById: (id: string) => api.get(`/nurse-appointment/${id}`),
  update: (id: string, data: any) => api.patch(`/nurse-appointment/${id}`, data),
  delete: (id: string) => api.delete(`/nurse-appointment/${id}`),
};

// Nurse Time Slot Controller
export const NurseTimeSlotService = {
  create: (data: any) => api.post('/nurse-timeslot', data),
  getAll: () => api.get('/nurse-timeslot'),
  getById: (id: string) => api.get(`/nurse-timeslot/${id}`),
  update: (id: string, data: any) => api.patch(`/nurse-timeslot/${id}`, data),
  delete: (id: string) => api.delete(`/nurse-timeslot/${id}`),
};

// User Controller
export const UserService = {
  register: (data: any) => api.post('/user/register', data),
  login: (data: any) => api.post('/user/login', data),
  getAllUsers: () => api.get('/user'),
  getUserById: (id: string) => api.get(`/user/${id}`),
  updateUser: (id: string, data: any) => api.patch(`/user/${id}`, data),
  deleteUser: (id: string) => api.delete(`/user/${id}`),
  requestOtp: (data: any) => api.post('/user/request-otp', data),
  verifyOtp: (data: any) => api.post('/user/verify-otp', data),
};

// Contact Controller
export const ContactService = {
  create: (data: any) => api.post('/contact', data),
};

// Payment Controller
export const PaymentService = {
  recordTransaction: (data: any) => api.post('/payment/record-transaction', data),
  updateStatus: (data: any) => api.post('/payment/update-status', data),
  createOrder: (data: any) => api.post('/payment/create-order', data),
  getAllTransactions: () => api.get('/payment/all-orders'),
};

export const ShippingAddressService = {
  create: (data: any) => api.post('/shipping-address', data),
  getById: (id: string) => api.get(`/shipping-address/${id}`),
};

// Feedback Controller
export const FeedbackService = {
  create: (data: any) => api.post('/feedback', data),
  getAllApproved: () => api.get('/feedback'),
};

// Order Controller
export const OrderService = {
  create: (data: any) => api.post('/order', data),
  getAll: (userEmail?: string) => api.get(`/order${userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : ''}`),
  getById: (id: string) => api.get(`/order/${id}`),
  update: (id: string, data: any) => api.patch(`/order/${id}`, data),
  delete: (id: string) => api.delete(`/order/${id}`),
};
