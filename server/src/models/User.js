const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio.' },
        len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres.' }
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: 'El correo electrónico ya está registrado.' },
      validate: {
        notEmpty: { msg: 'El correo electrónico es obligatorio.' },
        isEmail: { msg: 'Debe ser un correo electrónico válido.' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La contraseña es obligatoria.' }
      }
    },
    monthly_income: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: { args: [0], msg: 'El ingreso mensual debe ser un número positivo.' }
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return User;
};
