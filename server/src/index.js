const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const pendingRoutes = require('./routes/pending.routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const requestLogger = require('./middleware/requestLogger.middleware');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Log de cada petición HTTP

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/pending-payments', pendingRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Monetty API funcionando correctamente' });
});

// Middleware centralizado de manejo de errores (SIEMPRE al final)
app.use(errorHandler);

// Conectar a PostgreSQL con Sequelize y luego iniciar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conectado a PostgreSQL con Sequelize');

    // Sincronizar modelos (crea tablas si no existen)
    await sequelize.sync({ alter: false });
    logger.info('Modelos sincronizados');

    app.listen(PORT, () => {
      logger.info(`Servidor Monetty corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    logger.error({ message: 'Error al conectar con la base de datos', error: error.message });
    process.exit(1);
  }
};

startServer();

module.exports = app;
