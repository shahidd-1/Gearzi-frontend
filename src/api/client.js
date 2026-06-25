import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auto-attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('gearzi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gearzi_token');
      localStorage.removeItem('gearzi_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default client;