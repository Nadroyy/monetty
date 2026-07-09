import { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Trash2, Edit2, CreditCard, Plus } from 'lucide-react';
import { usePending } from '../context/PendingContext';
import { formatCurrency, formatDate, daysUntilDate } from '../utils/format';
import { PAYMENT_STATUS_CONFIG, FREQUENCY_LABELS, PAYMENT_FILTER_OPTIONS } from '../utils/constants';
import PendingPaymentForm from './PendingPaymentForm';

const STATUS_ICONS = {
  active: Clock,
  overdue: AlertTriangle,
  completed: CheckCircle2
};

const getProgressBarColor = (status) => {
  if (status === 'completed') return 'bg-green-500';
  if (status === 'overdue') return 'bg-red-400';
  return 'bg-orange-400';
};

const getDaysLabel = (days) => {
  if (days < 0) return `Venció hace ${Math.abs(days)} días`;
  if (days === 0) return 'Vence hoy';
  return `Vence en ${days} días`;
};

const getDaysColor = (days) => {
  if (days < 0) return 'text-red-500';
  if (days <= 7) return 'text-orange-500';
  return 'text-gray-500';
};

const PendingPaymentList = () => {
  const { payments, loading, filter, setFilter, payInstallment, deletePayment, totalPending } = usePending();
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handlePay = async (id) => {
    setActionLoading(id);
    try {
      await payInstallment(id);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar cuota');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este pago pendiente?')) {
      try {
        await deletePayment(id);
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  return (
    <div className="mt-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pagos Pendientes</h2>
          {totalPending > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              Total por pagar: <span className="font-semibold text-orange-600">{formatCurrency(totalPending)}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Pago
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {PAYMENT_FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === opt.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-400 mt-3">Cargando pagos...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <CreditCard className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 text-lg mt-4">No hay pagos pendientes.</p>
          <p className="text-gray-400 text-sm mt-1">Registra deudas, cuotas o pagos recurrentes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map(payment => {
            const config = PAYMENT_STATUS_CONFIG[payment.status] || PAYMENT_STATUS_CONFIG.active;
            const StatusIcon = STATUS_ICONS[payment.status] || Clock;
            const progress = (payment.paid_installments / payment.total_installments) * 100;
            const remaining = (payment.total_installments - payment.paid_installments) * payment.installment_amount;
            const days = daysUntilDate(payment.due_date);

            return (
              <div
                key={payment.id}
                className={`bg-white rounded-xl shadow-sm border ${config.border} p-5 transition hover:shadow-md`}
              >
                {/* Info principal */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${config.bg} shrink-0`}>
                      <StatusIcon className={config.color} size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-800 truncate">{payment.description}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}>
                          {config.label}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                          {FREQUENCY_LABELS[payment.frequency]}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                          {payment.category}
                        </span>
                        {days !== null && payment.status !== 'completed' && (
                          <span className={`font-medium ${getDaysColor(days)}`}>
                            {getDaysLabel(days)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(payment.total_amount)}</p>
                    {payment.total_installments > 1 && (
                      <p className="text-xs text-gray-400">
                        {payment.paid_installments}/{payment.total_installments} cuotas · {formatCurrency(payment.installment_amount)}/c.u.
                      </p>
                    )}
                  </div>
                </div>

                {/* Barra de progreso */}
                {payment.total_installments > 1 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(payment.status)}`}
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress.toFixed(0)}% pagado`}
                      ></div>
                    </div>
                    {payment.status !== 'completed' && (
                      <p className="text-xs text-gray-400 mt-1">
                        Restante: {formatCurrency(remaining)}
                      </p>
                    )}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Fecha límite: {formatDate(payment.due_date)}
                  </p>
                  <div className="flex items-center gap-1">
                    {payment.status !== 'completed' && (
                      <button
                        onClick={() => handlePay(payment.id)}
                        disabled={actionLoading === payment.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition disabled:opacity-50"
                        aria-label={`Registrar cuota para ${payment.description}`}
                      >
                        <CheckCircle2 size={14} />
                        {payment.total_installments === 1 ? 'Marcar pagado' : 'Pagar cuota'}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(payment)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition"
                      aria-label={`Editar ${payment.description}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                      aria-label={`Eliminar ${payment.description}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <PendingPaymentForm
          payment={editingPayment}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default PendingPaymentList;
