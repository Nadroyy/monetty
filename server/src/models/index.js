const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

// Crear instancia de Sequelize
const sequelize = new Sequelize(config.url, {
  dialect: config.dialect,
  logging: config.logging,
  define: config.define,
  dialectOptions: config.dialectOptions || {}
});

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
