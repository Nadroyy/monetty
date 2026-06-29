-- ================================================
-- MONETTY - Script de Base de Datos
-- Gestor de Gastos Personales
-- PostgreSQL con tipos ENUM para integridad de datos
-- ================================================

-- Crear base de datos (ejecutar por separado si es necesario)
-- CREATE DATABASE monetty;

-- Tipos ENUM personalizados
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE category_type AS ENUM ('Comida', 'Transporte', 'Ocio', 'Sueldo', 'Servicios', 'Salud', 'Educación', 'Otros');

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de transacciones (relación 1:N con users)
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

-- Índices B-tree para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Comentarios sobre la estructura
COMMENT ON TABLE users IS 'Almacena la información de los usuarios registrados';
COMMENT ON TABLE transactions IS 'Almacena los movimientos financieros (ingresos y egresos) de cada usuario';
COMMENT ON COLUMN transactions.type IS 'Tipo de transacción: income (ingreso) o expense (egreso)';
COMMENT ON COLUMN transactions.category IS 'Categoría del movimiento según ENUM category_type';
