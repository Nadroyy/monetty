const { Router } = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

const transactionValidation = [
  body('type')
    .notEmpty().withMessage('El tipo es obligatorio.')
    .isIn(['income', 'expense']).withMessage('El tipo debe ser "income" o "expense".'),
  body('amount')
    .notEmpty().withMessage('El monto es obligatorio.')
    .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0.'),
  body('category')
    .trim()
    .notEmpty().withMessage('La categoría es obligatoria.')
    .isIn(['Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'])
    .withMessage('La categoría no es válida.'),
  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria.')
    .isLength({ min: 2, max: 255 }).withMessage('La descripción debe tener entre 2 y 255 caracteres.'),
  body('date')
    .notEmpty().withMessage('La fecha es obligatoria.')
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD).')
];

// GET /api/transactions
router.get('/', getTransactions);

// POST /api/transactions
router.post('/', transactionValidation, validate, createTransaction);

// PUT /api/transactions/:id
router.put('/:id', transactionValidation, validate, updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

module.exports = router;
