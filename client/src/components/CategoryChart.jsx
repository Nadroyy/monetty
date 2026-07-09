import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/format';
import { CATEGORY_COLORS } from '../utils/constants';

const CategoryChart = () => {
  const { expenseByCategory, totalExpense } = useTransactions();

  const categories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Categoría</h3>
        <p className="text-gray-400 text-sm text-center py-8">No hay gastos registrados</p>
      </div>
    );
  }

  const maxAmount = Math.max(...categories.map(([, amount]) => amount));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Categoría</h3>

      <div className="space-y-3">
        {categories.map(([category, amount]) => {
          const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
          const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

          return (
            <div key={category}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-500">{formatCurrency(amount)} ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${CATEGORY_COLORS[category] || 'bg-gray-400'}`}
                  style={{ width: `${barWidth}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${category}: ${percentage.toFixed(0)}%`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
