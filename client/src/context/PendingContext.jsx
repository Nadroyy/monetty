import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PendingContext = createContext();

export const usePending = () => {
  const context = useContext(PendingContext);
  if (!context) throw new Error('usePending debe usarse dentro de PendingProvider');
  return context;
};

export const PendingProvider = ({ children }) => {
  const [allPayments, setAllPayments] = useState([]); // Todos los pagos (para cálculos)
  const [payments, setPayments] = useState([]);        // Pagos filtrados (para la lista)
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // Cargar TODOS los pagos (para cálculos globales)
  const fetchAllPayments = useCallback(async () => {
    try {
      const response = await api.get('/pending-payments');
      setAllPayments(response.data.data.payments);
    } catch (error) {
      console.error('Error al cargar todos los pagos:', error);
    }
  }, []);

  // Cargar pagos filtrados (para la vista)
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) params.status = filter;
      const response = await api.get('/pending-payments', { params });
      setPayments(response.data.data.payments);
    } catch (error) {
      console.error('Error al cargar pagos pendientes:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAllPayments();
  }, [fetchAllPayments]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Refrescar ambos cuando se modifica algo
  const refreshAll = async () => {
    await Promise.all([fetchAllPayments(), fetchPayments()]);
  };

  const createPayment = async (data) => {
    const response = await api.post('/pending-payments', data);
    const newPayment = response.data.data.payment;
    setPayments(prev => [newPayment, ...prev]);
    setAllPayments(prev => [newPayment, ...prev]);
    return response.data;
  };

  const payInstallment = async (id) => {
    const response = await api.put(`/pending-payments/${id}/pay`);
    const updated = response.data.data.payment;
    setPayments(prev => prev.map(p => (p.id === id ? updated : p)));
    setAllPayments(prev => prev.map(p => (p.id === id ? updated : p)));
    return response.data;
  };

  const updatePayment = async (id, data) => {
    const response = await api.put(`/pending-payments/${id}`, data);
    const updated = response.data.data.payment;
    setPayments(prev => prev.map(p => (p.id === id ? updated : p)));
    setAllPayments(prev => prev.map(p => (p.id === id ? updated : p)));
    return response.data;
  };

  const deletePayment = async (id) => {
    await api.delete(`/pending-payments/${id}`);
    setPayments(prev => prev.filter(p => p.id !== id));
    setAllPayments(prev => prev.filter(p => p.id !== id));
  };

  // Estado derivado — siempre basado en TODOS los pagos
  const activePayments = allPayments.filter(p => p.status === 'active');
  const overduePayments = allPayments.filter(p => p.status === 'overdue');
  const completedPayments = allPayments.filter(p => p.status === 'completed');

  // Total pendiente por pagar (solo pagos no completados)
  const totalPending = allPayments
    .filter(p => p.status !== 'completed')
    .reduce((acc, p) => {
      const remaining = (p.total_installments - p.paid_installments) * p.installment_amount;
      return acc + remaining;
    }, 0);

  const value = {
    payments,       // Filtrados (para la lista visual)
    allPayments,    // Todos (para cálculos)
    loading,
    filter,
    setFilter,
    createPayment,
    payInstallment,
    updatePayment,
    deletePayment,
    fetchPayments: refreshAll,
    activePayments,
    overduePayments,
    completedPayments,
    totalPending
  };

  return (
    <PendingContext.Provider value={value}>
      {children}
    </PendingContext.Provider>
  );
};
