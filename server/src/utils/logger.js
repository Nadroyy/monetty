const fs = require('fs');
const path = require('path');

/**
 * Logger centralizado para la aplicación.
 * Registra logs en consola y en archivo (server/logs/).
 * Niveles: info, warn, error
 */

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');

// Crear directorio de logs si no existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Formatear fecha para los logs
const getTimestamp = () => {
  return new Date().toISOString();
};

// Formatear mensaje de log
const formatLog = (level, data) => {
  const timestamp = getTimestamp();
  if (typeof data === 'object') {
    return `[${timestamp}] [${level.toUpperCase()}] ${JSON.stringify(data)}`;
  }
  return `[${timestamp}] [${level.toUpperCase()}] ${data}`;
};

// Escribir en archivo
const writeToFile = (filename, message) => {
  const filePath = path.join(LOG_DIR, filename);
  fs.appendFileSync(filePath, message + '\n', 'utf8');
};

// Obtener nombre de archivo por fecha
const getLogFilename = () => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${date}.log`;
};

const logger = {
  info: (data) => {
    const message = formatLog('info', data);
    console.log(`ℹ️  ${message}`);
    writeToFile(getLogFilename(), message);
  },

  warn: (data) => {
    const message = formatLog('warn', data);
    console.warn(`⚠️  ${message}`);
    writeToFile(getLogFilename(), message);
  },

  error: (data) => {
    const message = formatLog('error', data);
    console.error(`❌ ${message}`);
    writeToFile(getLogFilename(), message);
    writeToFile('errors.log', message); // También en archivo de errores dedicado
  },

  request: (req, res, duration) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id || null
    };
    const message = formatLog('info', logData);
    console.log(`📝 ${message}`);
    writeToFile(getLogFilename(), message);
  }
};

module.exports = logger;
