const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/sqlite');

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'monetty_dev_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado.'
      });
    }

    // Hash del password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const result = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run(name, email, hashedPassword);

    const user = db.prepare('SELECT id, name, email, monthly_income, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: {
        user: { id: user.id, name: user.name, email: user.email, monthly_income: user.monthly_income },
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario.'
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = db.prepare('SELECT id, name, email, password, monthly_income FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: {
        user: { id: user.id, name: user.name, email: user.email, monthly_income: user.monthly_income },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.'
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, monthly_income, created_at FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario.'
    });
  }
};

// PUT /api/auth/monthly-income
const updateMonthlyIncome = async (req, res) => {
  try {
    const { monthly_income } = req.body;
    const userId = req.user.id;

    if (monthly_income !== null && (isNaN(monthly_income) || monthly_income < 0)) {
      return res.status(400).json({
        success: false,
        message: 'El ingreso mensual debe ser un número positivo o null para desactivarlo.'
      });
    }

    const incomeValue = monthly_income === null ? null : parseFloat(monthly_income);

    const result = db.prepare('UPDATE users SET monthly_income = ? WHERE id = ?').run(incomeValue, userId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    res.json({
      success: true,
      message: 'Ingreso mensual actualizado.',
      data: { monthly_income: incomeValue }
    });
  } catch (error) {
    console.error('Error al actualizar ingreso mensual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el ingreso mensual.'
    });
  }
};

module.exports = { register, login, getMe, updateMonthlyIncome };
