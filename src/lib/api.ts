import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aldiianacare.online/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aldiana_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aldiana_token');
      localStorage.removeItem('aldiana_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/connexion') && !window.location.pathname.startsWith('/inscription')) {
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
