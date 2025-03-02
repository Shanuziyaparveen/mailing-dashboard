import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Mail API
export const mailApi = {
  getAllMails: async () => {
    const response = await api.get('/mails');
    return response.data;
  },
  
  getMail: async (id: string) => {
    const response = await api.get(`/mails/${id}`);
    return response.data;
  },
  
  markAsRead: async (id: string) => {
    const response = await api.patch(`/mails/${id}/read`);
    return response.data;
  },
  
  moveMail: async (id: string, folder: string) => {
    const response = await api.patch(`/mails/${id}/move`, { folder });
    return response.data;
  },
  
  deleteMail: async (id: string) => {
    const response = await api.delete(`/mails/${id}`);
    return response.data;
  },
};

export default api;