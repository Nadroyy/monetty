import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('monetty_token');
    const savedUser = localStorage.getItem('monetty_user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userData, token } = response.data.data;

    localStorage.setItem('monetty_token', token);
    localStorage.setItem('monetty_user', JSON.stringify(userData));
    setUser(userData);

    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user: userData, token } = response.data.data;

    localStorage.setItem('monetty_token', token);
    localStorage.setItem('monetty_user', JSON.stringify(userData));
    setUser(userData);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('monetty_token');
    localStorage.removeItem('monetty_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
