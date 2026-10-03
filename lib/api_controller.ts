
import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'http://34.14.180.50:6001';

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
