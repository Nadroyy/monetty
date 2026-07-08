import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('monetty_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login si es un 401 Y no es una petición de transacciones vacía
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      // Si falla en login/register, no hacer redirect (mostrar error en form)
      if (!isAuthEndpoint) {
        localStorage.removeItem('monetty_token');
        localStorage.removeItem('monetty_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
