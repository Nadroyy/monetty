import { Trash2, Edit2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatDate } from '../utils/format';

const TransactionList = ({ onEdit }) => {
  const { transactions, deleteTransaction } = useTransactions();

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert('Error al eliminar la transacción');
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500 text-lg">No hay movimientos registrados.</p>
        <p className="text-gray-400 text-sm mt-1">Agrega tu primer ingreso o gasto</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Monto</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {t.type === 'income' ? (
                    <ArrowUpCircle className="text-green-500" size={20} />
                  ) : (
                    <ArrowDownCircle className="text-red-500" size={20} />
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{t.description}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(t.date)}</td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
                      aria-label={`Editar transacción: ${t.description}`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                      aria-label={`Eliminar transacción: ${t.description}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para móviles */}
      <div className="md:hidden divide-y divide-gray-100">
        {transactions.map((t) => (
          <div key={t.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {t.type === 'income' ? (
                <ArrowUpCircle className="text-green-500 shrink-0" size={24} />
              ) : (
                <ArrowDownCircle className="text-red-500 shrink-0" size={24} />
              )}
              <div>
                <p className="text-sm font-medium text-gray-800">{t.description}</p>
                <p className="text-xs text-gray-400">{t.category} · {formatDate(t.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${
                t.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <button
                onClick={() => onEdit(t)}
                className="p-1 text-gray-400 hover:text-blue-500"
                aria-label={`Editar transacción: ${t.description}`}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1 text-gray-400 hover:text-red-500"
                aria-label={`Eliminar transacción: ${t.description}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
