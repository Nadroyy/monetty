const logger = require('../utils/logger');

/**
 * Middleware de logging de peticiones HTTP.
 * Registra cada petición entrante con método, URL, status y duración.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Cuando la respuesta termine, loguear
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req, res, duration);
  });

  next();
};

module.exports = requestLogger;
