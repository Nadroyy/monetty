import { TrendingUp, TrendingDown, Wallet, Target, AlertCircle, CalendarClock, Plus } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { usePending } from '../context/PendingContext';
import { formatCurrency, calcPercent } from '../utils/format';

const Summary = ({ onAddExpense }) => {
  const { totalIncome: transactionIncome, totalExpense: transactionExpense } = useTransactions();
  const { user } = useAuth();
  const { totalPending, allPayments } = usePending();

  const monthlyIncome = user?.monthly_income ? parseFloat(user.monthly_income) : 0;

  // --- BALANCE ACTUAL ---
  // Ingresos = transacciones income + ingreso fijo mensual
  const totalIncome = transactionIncome + monthlyIncome;
  // Gastos = transacciones expense + pagos pendientes por pagar
  const totalExpense = transactionExpense + totalPending;
  // Balance actual
  const balance = totalIncome - totalExpense;

  // --- BALANCE ESTIMADO A FUTURO ---
  // Proyecta el balance una vez que se liquiden todas las deudas con cuotas (custom)
  // Los pagos mensuales recurrentes no se "liquidan", solo se consideran como gasto fijo
  const pendingWithInstallments = allPayments
    .filter(p => p.status !== 'completed' && p.frequency === 'custom' && p.total_installments > 1);

  const totalPendingInstallments = pendingWithInstallments.reduce((sum, p) => {
    const remaining = (p.total_installments - p.paid_installments) * p.installment_amount;
    return sum + remaining;
  }, 0);

  const pendingMonths = pendingWithInstallments.reduce((max, p) => {
    const remainingInstallments = p.total_installments - p.paid_installments;
    return Math.max(max, remainingInstallments);
  }, 0);

  // Ingreso proyectado en ese periodo
  const projectedIncome = monthlyIncome > 0 && pendingMonths > 0
    ? monthlyIncome * pendingMonths
    : totalIncome;
  // Balance estimado al liquidar deudas con cuotas
  const estimatedBalance = projectedIncome - totalPendingInstallments - transactionExpense;

  // Presupuesto mensual
  const hasMonthlyIncome = monthlyIncome > 0;
  const monthlyRemaining = hasMonthlyIncome ? monthlyIncome - totalExpense : null;
  const monthlyUsedPercent = calcPercent(totalExpense, monthlyIncome);

  const getProgressColor = (percent) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-4">
      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Actual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Balance Actual</p>
              <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Ingresos − Gastos − Deudas</p>
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
              {monthlyIncome > 0 && transactionIncome > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Fijo: {formatCurrency(monthlyIncome)} + Otros: {formatCurrency(transactionIncome)}
                </p>
              )}
              {monthlyIncome > 0 && transactionIncome === 0 && (
                <p className="text-xs text-gray-400 mt-1">Ingreso fijo mensual</p>
              )}
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Gastos - Clickeable para agregar gasto rápido */}
        <button
          onClick={onAddExpense}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left w-full hover:border-red-200 hover:shadow-md transition-all group"
          aria-label="Agregar nuevo gasto"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Gastos</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {formatCurrency(totalExpense)}
              </p>
              {totalPending > 0 && transactionExpense > 0 ? (
                <p className="text-xs text-gray-400 mt-1">
                  Gastos: {formatCurrency(transactionExpense)} + Deudas: {formatCurrency(totalPending)}
                </p>
              ) : totalPending > 0 ? (
                <p className="text-xs text-gray-400 mt-1">Pagos pendientes</p>
              ) : transactionExpense > 0 ? (
                <p className="text-xs text-gray-400 mt-1">Movimientos registrados</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Toca para agregar gasto</p>
              )}
            </div>
            <div className="relative">
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown className="text-red-600" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="text-white" size={12} />
              </div>
            </div>
          </div>
        </button>

        {/* Balance Estimado a Futuro */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Estimado a Futuro</p>
              <p className={`text-2xl font-bold mt-1 ${estimatedBalance >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {formatCurrency(estimatedBalance)}
              </p>
              {pendingMonths > 1 && monthlyIncome > 0 ? (
                <p className="text-xs text-gray-400 mt-1">
                  En ~{pendingMonths} meses al liquidar cuotas
                </p>
              ) : totalPendingInstallments > 0 ? (
                <p className="text-xs text-gray-400 mt-1">
                  Al liquidar todas las cuotas
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Sin deudas con cuotas</p>
              )}
            </div>
            <div className={`p-3 rounded-full ${estimatedBalance >= 0 ? 'bg-purple-100' : 'bg-red-100'}`}>
              <CalendarClock className={estimatedBalance >= 0 ? 'text-purple-600' : 'text-red-600'} size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alerta si balance negativo */}
      {balance < 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-sm text-red-700">
            Tus gastos y deudas superan tus ingresos por <span className="font-bold">{formatCurrency(Math.abs(balance))}</span>
          </p>
        </div>
      )}

      {/* Barra de presupuesto mensual */}
      {hasMonthlyIncome && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-emerald-600" />
              <p className="text-sm font-medium text-gray-700">Presupuesto Mensual</p>
            </div>
            <p className={`text-sm font-bold ${monthlyRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {monthlyRemaining >= 0 ? 'Disponible: ' : 'Excedido: '}
              {formatCurrency(Math.abs(monthlyRemaining))}
            </p>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${getProgressColor(monthlyUsedPercent)}`}
              style={{ width: `${monthlyUsedPercent}%` }}
              role="progressbar"
              aria-valuenow={monthlyUsedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${monthlyUsedPercent.toFixed(0)}% del presupuesto usado`}
            ></div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Comprometido: {formatCurrency(totalExpense)}</span>
            <span>Ingreso fijo: {formatCurrency(monthlyIncome)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
