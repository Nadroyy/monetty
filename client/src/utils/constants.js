/**
 * Categorías disponibles para transacciones y pagos
 */
export const CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'];

/**
 * Categorías solo para gastos (sin Sueldo)
 */
export const EXPENSE_CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Servicios', 'Salud', 'Educación', 'Otros'];

/**
 * Colores de Tailwind por categoría
 */
export const CATEGORY_COLORS = {
  Comida: 'bg-orange-400',
  Transporte: 'bg-blue-400',
  Ocio: 'bg-purple-400',
  Sueldo: 'bg-green-400',
  Servicios: 'bg-yellow-400',
  Salud: 'bg-pink-400',
  Educación: 'bg-indigo-400',
  Otros: 'bg-gray-400'
};

/**
 * Configuración visual por estado de pago pendiente
 */
export const PAYMENT_STATUS_CONFIG = {
  active: { label: 'Activo', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  overdue: { label: 'Vencido', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  completed: { label: 'Completado', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
};

/**
 * Etiquetas de frecuencia de pago
 */
export const FREQUENCY_LABELS = {
  once: 'Pago único',
  monthly: 'Mensual',
  custom: 'Cuotas'
};

/**
 * Filtros de estado para pagos pendientes
 */
export const PAYMENT_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'overdue', label: 'Vencidos' },
  { value: 'completed', label: 'Completados' }
];
