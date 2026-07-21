'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tipo ENUM para category de pending_payments
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_pending_payments_category" AS ENUM ('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.createTable('pending_payments', {
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
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      installment_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      total_installments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      paid_installments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      frequency: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'once'
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros'),
        allowNull: false,
        defaultValue: 'Otros'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Crear índices
    await queryInterface.addIndex('pending_payments', ['user_id'], { name: 'idx_pending_payments_user_id' });
    await queryInterface.addIndex('pending_payments', ['due_date'], { name: 'idx_pending_payments_due_date' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pending_payments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_pending_payments_category";');
  }
};
