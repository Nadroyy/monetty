import { useState } from 'react';
import { X } from 'lucide-react';
import { usePending } from '../context/PendingContext';
import { EXPENSE_CATEGORIES } from '../utils/constants';

const PendingPaymentForm = ({ payment, onClose }) => {
  const { createPayment, updatePayment } = usePending();
  const isEditing = !!payment;

  const [formData, setFormData] = useState({
    description: payment?.description || '',
    total_amount: payment?.total_amount || '',
    total_installments: payment?.total_installments || 1,
    frequency: payment?.frequency || 'once',
    due_date: payment?.due_date?.split('T')[0] || '',
    category: payment?.category || 'Otros'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFrequencyChange = (freq) => {
    setFormData(prev => ({
      ...prev,
      frequency: freq,
      total_installments: freq === 'once' ? 1 : prev.total_installments
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
        total_installments: parseInt(formData.total_installments)
      };

      if (isEditing) {
        await updatePayment(payment.id, data);
      } else {
        await createPayment(data);
      }
      onClose();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(errors.map(e => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Error al guardar el pago');
      }
    } finally {
      setLoading(false);
    }
  };

  const installmentAmount = formData.total_amount && formData.total_installments
    ? (parseFloat(formData.total_amount) / parseInt(formData.total_installments)).toFixed(0)
    : 0;

  const frequencyOptions = [
    { value: 'once', label: 'Único' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'custom', label: 'Cuotas' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditing ? 'Editar Pago Pendiente' : 'Nuevo Pago Pendiente'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Descripción */}
          <div>
            <label htmlFor="pp-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              id="pp-description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="Ej: Cuotas del televisor, Alquiler..."
              required
              minLength={2}
              maxLength={255}
            />
          </div>

          {/* Frecuencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pago</label>
            <div className="grid grid-cols-3 gap-2">
              {frequencyOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFrequencyChange(opt.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    formData.frequency === opt.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monto total */}
          <div>
            <label htmlFor="pp-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto total ($)
            </label>
            <input
              id="pp-amount"
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="0"
              min="1"
              step="1"
              required
            />
          </div>

          {/* Número de cuotas */}
          {formData.frequency !== 'once' && (
            <div>
              <label htmlFor="pp-installments" className="block text-sm font-medium text-gray-700 mb-1">
                Número de cuotas
              </label>
              <input
                id="pp-installments"
                type="number"
                name="total_installments"
                value={formData.total_installments}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                min="2"
                max="120"
                required
              />
              {installmentAmount > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Cada cuota: ${parseInt(installmentAmount).toLocaleString('es-CO')}
                </p>
              )}
            </div>
          )}

          {/* Fecha límite */}
          <div>
            <label htmlFor="pp-due-date" className="block text-sm font-medium text-gray-700 mb-1">
              {formData.frequency === 'once' ? 'Fecha límite de pago' : 'Fecha límite final'}
            </label>
            <input
              id="pp-due-date"
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="pp-category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="pp-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Pago Pendiente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PendingPaymentForm;
