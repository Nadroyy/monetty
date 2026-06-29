import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions debe usarse dentro de TransactionProvider');
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', endDate: '' });

  // Cargar transacciones
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.get('/transactions', { params });
      setTransactions(response.data.data.transactions);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Crear transacción
  const createTransaction = async (data) => {
    const response = await api.post('/transactions', data);
    setTransactions(prev => [response.data.data.transaction, ...prev]);
    return response.data;
  };

  // Actualizar transacción
  const updateTransaction = async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    setTransactions(prev =>
      prev.map(t => (t.id === id ? response.data.data.transaction : t))
    );
    return response.data;
  };

  // Eliminar transacción
  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // --- ESTADO DERIVADO (calculado, NO almacenado) ---
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Gasto por categoría
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const value = {
    transactions,
    loading,
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
