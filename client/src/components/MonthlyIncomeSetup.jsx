import { useState } from 'react';
import { DollarSign, Check, X, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';

const MonthlyIncomeSetup = () => {
  const { user, updateMonthlyIncome } = useAuth();
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(user?.monthly_income || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasMonthlyIncome = user?.monthly_income !== null && user?.monthly_income !== undefined;

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateMonthlyIncome(parseFloat(amount));
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setError('');

    try {
      await updateMonthlyIncome(null);
      setAmount('');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setAmount(user?.monthly_income || '');
    setError('');
  };

  // Sin ingreso fijo configurado
  if (!hasMonthlyIncome && !editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gray-100">
              <DollarSign className="text-gray-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ingreso Mensual Fijo</p>
              <p className="text-sm text-gray-400 mt-0.5">Opcional — establece tu sueldo o ingreso recurrente</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="text-sm bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg font-medium transition"
          >
            Configurar
          </button>
        </div>
      </div>
    );
  }

  // Editando
  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-green-100">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Ingreso Mensual Fijo</p>
            <p className="text-xs text-gray-400">Este monto se usa como referencia para tu presupuesto mensual</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="Ej: 3000000"
              min="0"
              step="1000"
              autoFocus
            />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            aria-label="Guardar ingreso mensual"
          >
            <Check size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition"
            aria-label="Cancelar"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Mostrando el ingreso configurado
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-emerald-100">
            <DollarSign className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ingreso Mensual Fijo</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">
              {formatCurrency(user.monthly_income)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setEditing(true); setAmount(user.monthly_income); }}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
            aria-label="Editar ingreso mensual"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            aria-label="Eliminar ingreso mensual"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeSetup;
