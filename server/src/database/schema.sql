-- ================================================
-- MONETTY - Script de Base de Datos
-- Gestor de Gastos Personales
-- PostgreSQL con Sequelize
-- ================================================

-- Crear base de datos (ejecutar por separado si es necesario)
-- CREATE DATABASE monetty;

-- ================================================
-- TABLA: users
-- Almacena la información de los usuarios registrados
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  monthly_income DECIMAL(12, 2) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: transactions
-- Almacena los movimientos financieros (ingresos y egresos)
-- Relación: N:1 con users (user_id → users.id)
-- ================================================

-- Tipos ENUM
DO $$ BEGIN
  CREATE TYPE enum_transactions_type AS ENUM ('income', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enum_transactions_category AS ENUM ('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type enum_transactions_type NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  category enum_transactions_category NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices B-tree para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- ================================================
-- TABLA: pending_payments
-- Almacena pagos pendientes, deudas y cuotas
-- Relación: N:1 con users (user_id → users.id)
-- ================================================

DO $$ BEGIN
  CREATE TYPE enum_pending_payments_category AS ENUM ('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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
  category enum_pending_payments_category NOT NULL DEFAULT 'Otros',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_due_date ON pending_payments(due_date);

-- ================================================
-- RELACIONES
-- ================================================
-- users (1) → transactions (N) : Un usuario tiene muchas transacciones
-- users (1) → pending_payments (N) : Un usuario tiene muchos pagos pendientes
-- Ambas relaciones con ON DELETE CASCADE (si se elimina el usuario, se eliminan sus registros)

-- ================================================
-- COMENTARIOS
-- ================================================
COMMENT ON TABLE users IS 'Almacena la información de los usuarios registrados';
COMMENT ON TABLE transactions IS 'Almacena los movimientos financieros (ingresos y egresos) de cada usuario';
COMMENT ON TABLE pending_payments IS 'Almacena pagos pendientes, deudas y cuotas de cada usuario';
COMMENT ON COLUMN transactions.type IS 'Tipo de transacción: income (ingreso) o expense (egreso)';
COMMENT ON COLUMN transactions.category IS 'Categoría del movimiento';
COMMENT ON COLUMN pending_payments.frequency IS 'Frecuencia de pago: once (único), monthly (mensual), custom (cuotas personalizadas)';
COMMENT ON COLUMN pending_payments.paid_installments IS 'Número de cuotas ya pagadas';
