const pool = require('../config/db');

const initDB = async () => {
  try {
    // Crear tipos ENUM
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('income', 'expense');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE category_type AS ENUM ('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Crear tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        monthly_income DECIMAL(12, 2) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla de transacciones con ENUMs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type transaction_type NOT NULL,
        amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
        category category_type NOT NULL,
        description VARCHAR(255) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear índices B-tree para mejorar rendimiento
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    `);

    // Crear tabla de pagos pendientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pending_payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount > 0),
        installment_amount DECIMAL(12, 2) NOT NULL CHECK (installment_amount > 0),
        total_installments INTEGER NOT NULL DEFAULT 1 CHECK (total_installments >= 1),
        paid_installments INTEGER NOT NULL DEFAULT 0 CHECK (paid_installments >= 0),
        frequency VARCHAR(20) NOT NULL DEFAULT 'once' CHECK (frequency IN ('once', 'monthly', 'custom')),
        due_date DATE NOT NULL,
        category category_type NOT NULL DEFAULT 'Otros',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_pending_payments_due_date ON pending_payments(due_date);
    `);

    console.log('✅ Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

initDB();
