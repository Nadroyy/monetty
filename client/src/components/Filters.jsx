import { Filter, X } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { CATEGORIES } from '../utils/constants';

const Filters = () => {
  const { filters, setFilters } = useTransactions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', type: '', startDate: '', endDate: '' });
  };

  const hasActiveFilters = filters.category || filters.type || filters.startDate || filters.endDate;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <h3 className="text-lg font-bold text-gray-800">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition"
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categoría */}
        <div>
          <label htmlFor="filter-category" className="block text-xs font-medium text-gray-500 mb-1">
            Categoría
          </label>
          <select
            id="filter-category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="">Todas</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label htmlFor="filter-type" className="block text-xs font-medium text-gray-500 mb-1">
            Tipo
          </label>
          <select
            id="filter-type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
        </div>

        {/* Fecha desde */}
        <div>
          <label htmlFor="filter-start" className="block text-xs font-medium text-gray-500 mb-1">
            Desde
          </label>
          <input
            id="filter-start"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label htmlFor="filter-end" className="block text-xs font-medium text-gray-500 mb-1">
            Hasta
          </label>
          <input
            id="filter-end"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
