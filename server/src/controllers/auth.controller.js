const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ============ MODO DEMO (sin base de datos) ============
const demoUsers = [];
let demoIdCounter = 1;

const isDemoMode = () => {
  return !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('usuario:password');
};
// =======================================================

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'demo_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // --- MODO DEMO ---
    if (isDemoMode()) {
      const exists = demoUsers.find(u => u.email === email);
      if (exists) {
        return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = { id: demoIdCounter++, name, email, password: hashedPassword, created_at: new Date() };
      demoUsers.push(newUser);

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: { user: { id: newUser.id, name: newUser.name, email: newUser.email }, token }
      });
    }
    // --- FIN MODO DEMO ---

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado.'
      });
    }

    // Hash del password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: {
        user: { id: user.id, name: user.name, email: user.email },
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

    // --- MODO DEMO ---
    if (isDemoMode()) {
      const user = demoUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        data: { user: { id: user.id, name: user.name, email: user.email }, token }
      });
    }
    // --- FIN MODO DEMO ---

    // Buscar usuario
    const result = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    const user = result.rows[0];

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
        user: { id: user.id, name: user.name, email: user.email },
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
    // --- MODO DEMO ---
    if (isDemoMode()) {
      const user = demoUsers.find(u => u.id === req.user.id);
      // Si el servidor se reinició y se perdió la memoria, usar datos del token
      if (!user) {
        return res.json({
          success: true,
          data: { user: { id: req.user.id, name: 'Usuario Demo', email: req.user.email, created_at: new Date() } }
        });
      }
      return res.json({
        success: true,
        data: { user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } }
      });
    }
    // --- FIN MODO DEMO ---

    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario.'
    });
  }
};

module.exports = { register, login, getMe };
