const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El tipo es obligatorio.' },
        isIn: { args: [['income', 'expense']], msg: 'El tipo debe ser "income" o "expense".' }
      }
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El monto es obligatorio.' },
        min: { args: [0.01], msg: 'El monto debe ser mayor a 0.' }
      }
    },
    category: {
      type: DataTypes.ENUM('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La categoría es obligatoria.' },
        isIn: {
          args: [['Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros']],
          msg: 'La categoría no es válida.'
        }
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La descripción es obligatoria.' },
        len: { args: [2, 255], msg: 'La descripción debe tener entre 2 y 255 caracteres.' }
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        notEmpty: { msg: 'La fecha es obligatoria.' },
        isDate: { msg: 'La fecha debe tener un formato válido.' }
      }
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['date'] },
      { fields: ['category'] },
      { fields: ['type'] }
    ]
  });

  return Transaction;
};
