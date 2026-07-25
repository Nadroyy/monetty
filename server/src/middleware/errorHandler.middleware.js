const logger = require('../utils/logger');

/**
 * Middleware centralizado de manejo de errores.
 * Captura todos los errores no manejados en los controladores.
 * Responde con el formato estándar del proyecto.
 */
const errorHandler = (err, req, res, next) => {
  // Log del error con contexto
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id || null
  });

  // Errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Error de restricción única (email duplicado, etc.)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe.',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Error de FK (registro referenciado no existe)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida. El recurso relacionado no existe.'
    });
  }

  // Error de conexión a la BD
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return res.status(503).json({
      success: false,
      message: 'Servicio no disponible. Error de conexión con la base de datos.'
    });
  }

  // Error de sintaxis en JSON del body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición.'
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Error interno del servidor'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
  });
};

module.exports = errorHandler;
