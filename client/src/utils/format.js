/**
 * Formatea un número como moneda colombiana (COP)
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado como moneda
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato legible en español
 * @param {string} dateStr - Fecha en formato ISO
 * @returns {string} Fecha formateada (ej: "08 jul 2026")
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Calcula los días restantes hasta una fecha
 * @param {string} dateStr - Fecha límite en formato ISO (YYYY-MM-DD)
 * @returns {number|null} Días restantes (negativo si ya pasó), null si no hay fecha
 */
export const daysUntilDate = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

/**
 * Calcula el porcentaje usado, limitado a 100%
 * @param {number} used - Valor usado
 * @param {number} total - Valor total
 * @returns {number} Porcentaje entre 0 y 100
 */
export const calcPercent = (used, total) => {
  if (!total || total <= 0) return 0;
  return Math.min((used / total) * 100, 100);
};

/**
 * Devuelve la fecha de hoy en formato ISO (YYYY-MM-DD)
 * @returns {string}
 */
export const todayISO = () => new Date().toISOString().split('T')[0];
