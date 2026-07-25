const { Router } = require('express');
const { body } = require('express-validator');
const {
  getPendingPayments,
  createPendingPayment,
  payInstallment,
  updatePendingPayment,
  deletePendingPayment
} = require('../controllers/pending.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

const paymentValidation = [
  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria.')
    .isLength({ min: 2, max: 255 }).withMessage('La descripción debe tener entre 2 y 255 caracteres.'),
  body('total_amount')
    .notEmpty().withMessage('El monto total es obligatorio.')
    .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0.'),
  body('total_installments')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 cuota.'),
  body('frequency')
    .notEmpty().withMessage('La frecuencia es obligatoria.')
    .isIn(['once', 'monthly', 'custom']).withMessage('La frecuencia debe ser "once", "monthly" o "custom".'),
  body('due_date')
    .notEmpty().withMessage('La fecha límite es obligatoria.')
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD).'),
  body('category')
    .optional()
    .trim()
    .isIn(['Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'])
    .withMessage('La categoría no es válida.')
];

// GET /api/pending-payments
router.get('/', getPendingPayments);

// POST /api/pending-payments
router.post('/', paymentValidation, validate, createPendingPayment);

// PUT /api/pending-payments/:id/pay — Registrar cuota pagada
router.put('/:id/pay', payInstallment);

// PUT /api/pending-payments/:id — Editar pago
router.put('/:id', paymentValidation, validate, updatePendingPayment);

// DELETE /api/pending-payments/:id
router.delete('/:id', deletePendingPayment);

module.exports = router;
