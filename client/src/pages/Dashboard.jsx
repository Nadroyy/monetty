import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import Header from '../components/Header';
import Summary from '../components/Summary';
import MonthlyIncomeSetup from '../components/MonthlyIncomeSetup';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionSkeleton from '../components/SkeletonRow';
import CategoryChart from '../components/CategoryChart';
import Filters from '../components/Filters';
import PendingPaymentList from '../components/PendingPaymentList';

const Dashboard = () => {
  const { user } = useAuth();
  const { loading } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ingreso mensual fijo */}
        <div className="mb-6">
          <MonthlyIncomeSetup />
        </div>

        {/* Resumen superior */}
        <Summary />

        {/* Gráfico y filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1">
            <CategoryChart />
          </div>
          <div className="lg:col-span-2">
            <Filters />
          </div>
        </div>

        {/* Pagos pendientes */}
        <PendingPaymentList />

        {/* Botón agregar y lista de movimientos */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Movimientos</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              + Agregar Movimiento
            </button>
          </div>

          {loading ? (
            <TransactionSkeleton />
          ) : (
            <TransactionList onEdit={handleEdit} />
          )}
        </div>
      </main>

      {/* Modal formulario */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Dashboard;
