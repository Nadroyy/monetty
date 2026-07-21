const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PendingPayment = sequelize.define('PendingPayment', {
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
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La descripción es obligatoria.' },
        len: { args: [2, 255], msg: 'La descripción debe tener entre 2 y 255 caracteres.' }
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El monto total es obligatorio.' },
        min: { args: [0.01], msg: 'El monto debe ser mayor a 0.' }
      }
    },
    installment_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: 'El monto de cuota debe ser mayor a 0.' }
      }
    },
    total_installments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: { args: [1], msg: 'Debe haber al menos 1 cuota.' }
      }
    },
    paid_installments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Las cuotas pagadas no pueden ser negativas.' }
      }
    },
    frequency: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'once',
      validate: {
        isIn: { args: [['once', 'monthly', 'custom']], msg: 'La frecuencia debe ser "once", "monthly" o "custom".' }
      }
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La fecha límite es obligatoria.' },
        isDate: { msg: 'La fecha debe tener formato válido.' }
      }
    },
    category: {
      type: DataTypes.ENUM('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'),
      allowNull: false,
      defaultValue: 'Otros'
    }
  }, {
    tableName: 'pending_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['due_date'] }
    ]
  });

  return PendingPayment;
};
