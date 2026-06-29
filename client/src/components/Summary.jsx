import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

const Summary = () => {
  const { balance, totalIncome, totalExpense } = useTransactions();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Balance Total</p>
            <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <Wallet className={balance >= 0 ? 'text-green-600' : 'text-red-600'} size={24} />
          </div>
        </div>
      </div>

      {/* Ingresos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ingresos</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="p-3 rounded-full bg-green-100">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Gastos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Gastos</p>
            <p className="text-2xl font-bold mt-1 text-red-600">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="p-3 rounded-full bg-red-100">
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
