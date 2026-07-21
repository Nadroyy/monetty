'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tipo ENUM para transaction_type
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_transactions_type" AS ENUM ('income', 'expense');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Crear tipo ENUM para category
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_transactions_category" AS ENUM ('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Crear índices
    await queryInterface.addIndex('transactions', ['user_id'], { name: 'idx_transactions_user_id' });
    await queryInterface.addIndex('transactions', ['date'], { name: 'idx_transactions_date' });
    await queryInterface.addIndex('transactions', ['category'], { name: 'idx_transactions_category' });
    await queryInterface.addIndex('transactions', ['type'], { name: 'idx_transactions_type' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('transactions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_transactions_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_transactions_category";');
  }
};
