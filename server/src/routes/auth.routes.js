const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio.')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'),
    body('email')
      .trim()
      .notEmpty().withMessage('El correo electrónico es obligatorio.')
      .isEmail().withMessage('Debe ser un correo electrónico válido.')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria.')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('El correo electrónico es obligatorio.')
      .isEmail().withMessage('Debe ser un correo electrónico válido.')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria.')
  ],
  validate,
  login
);

// GET /api/auth/me
router.get('/me', authMiddleware, getMe);

module.exports = router;
