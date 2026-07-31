import axios from 'axios';

let base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL && !base.endsWith('/api')) {
  base = base.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
  baseURL: base,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
