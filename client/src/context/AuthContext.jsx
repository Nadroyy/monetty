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

  // Verificar sesión al cargar la app
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('monetty_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validar token contra el servidor
        const response = await api.get('/auth/me');
        const userData = response.data.data.user;

        localStorage.setItem('monetty_user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        // Token inválido o expirado — limpiar sesión
        console.warn('Sesión expirada o inválida');
        localStorage.removeItem('monetty_token');
        localStorage.removeItem('monetty_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
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

  const updateMonthlyIncome = async (amount) => {
    const response = await api.put('/auth/monthly-income', {
      monthly_income: amount
    });
    const updatedUser = { ...user, monthly_income: response.data.data.monthly_income };
    localStorage.setItem('monetty_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
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
    updateMonthlyIncome,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
