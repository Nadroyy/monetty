const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

// Crear directorio data si no existe (para SQLite)
if (config.storage) {
  const dataDir = path.dirname(config.storage);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Crear instancia de Sequelize
let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, {
    dialect: config.dialect,
    logging: config.logging,
    define: config.define,
    dialectOptions: config.dialectOptions || {}
  });
} else {
  sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: config.logging,
    define: config.define
  });
}

// Importar modelos
const User = require('./User')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const PendingPayment = require('./PendingPayment')(sequelize);

// Definir relaciones
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(PendingPayment, { foreignKey: 'user_id', as: 'pendingPayments', onDelete: 'CASCADE' });
PendingPayment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const db = {
  sequelize,
  Sequelize,
  User,
  Transaction,
  PendingPayment
};

module.exports = db;
