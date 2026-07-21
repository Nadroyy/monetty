# 💰 Monetty - Gestor de Gastos Personales

Aplicación web Full Stack para el control de ingresos y gastos personales en tiempo real.

## 📋 Descripción

Monetty es una aplicación personal que permite llevar el control total de ingresos y gastos de manera visual y en tiempo real. Responde preguntas clave como:
- ¿En qué me gasto más?
- ¿Cuánto me queda a fin de mes?
- ¿He gastado mucho en comidas esta semana?

## 🏗️ Arquitectura del Sistema

```
monetty/
├── client/                    # Frontend - React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/             # Páginas principales (Landing, Login, Register, Dashboard)
│   │   ├── components/        # Componentes reutilizables (Header, Summary, Forms, etc.)
│   │   ├── context/           # Contextos de estado (Auth, Transactions, Pending)
│   │   ├── services/          # Capa de comunicación con la API (Axios)
│   │   └── utils/             # Utilidades y constantes
│   └── ...
├── server/                    # Backend - Node.js + Express + PostgreSQL + Sequelize
│   ├── src/
│   │   ├── config/            # Configuración de base de datos (Sequelize)
│   │   ├── controllers/       # Lógica de negocio por entidad
│   │   ├── middleware/        # Autenticación JWT y validación
│   │   ├── models/            # Modelos Sequelize (User, Transaction, PendingPayment)
│   │   ├── migrations/        # Migraciones de Sequelize
│   │   ├── seeders/           # Datos iniciales de prueba
│   │   ├── routes/            # Definición de endpoints REST
│   │   └── database/          # Script SQL de referencia
│   └── ...
└── README.md
```

### Frontend
Aplicación SPA desarrollada en **React 18** con **Vite** como bundler y **Tailwind CSS** para estilos. Utiliza **React Router DOM** para navegación y **Axios** para la comunicación con la API REST. El estado se gestiona mediante Context API con tres proveedores: autenticación, transacciones y pagos pendientes.

### Backend
API REST construida con **Express 4** sobre **Node.js**. Implementa arquitectura por capas (rutas → controladores → modelos). Utiliza **Sequelize** como ORM para interactuar con **PostgreSQL**. Autenticación basada en **JSON Web Tokens (JWT)** y validación de inputs con **express-validator**.

### Base de Datos
**PostgreSQL** con **Sequelize** como ORM. 3 tablas con relaciones 1:N, restricciones CHECK, índices B-tree optimizados y tipos ENUM para integridad de datos.

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- Axios (con interceptors)
- Lucide React (iconos)

### Backend
- Node.js
- Express 4
- PostgreSQL
- Sequelize (ORM)
- JSON Web Tokens (JWT)
- bcryptjs
- express-validator
- cors, dotenv

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm

### Base de Datos

```bash
# Crear la base de datos en PostgreSQL
createdb monetty

# Ejecutar migraciones
cd server
npm run db:migrate

# (Opcional) Ejecutar seeders con datos de prueba
npm run db:seed
```

### Backend

```bash
cd server
npm install

# Configurar variables de entorno (copiar .env.example a .env)
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Ejecutar migraciones
npm run db:migrate

# Iniciar servidor
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 🔐 Variables de Entorno

### Server (.env)
```
PORT=5000
DATABASE_URL=postgresql://usuario:password@localhost:5432/monetty
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=7d
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | /api/auth/register | Registro de usuario | No |
| POST | /api/auth/login | Inicio de sesión | No |
| GET | /api/auth/me | Obtener usuario actual | Sí (JWT) |
| PUT | /api/auth/monthly-income | Actualizar ingreso mensual | Sí (JWT) |
| GET | /api/transactions | Listar transacciones (con filtros) | Sí (JWT) |
| POST | /api/transactions | Crear transacción | Sí (JWT) |
| PUT | /api/transactions/:id | Actualizar transacción | Sí (JWT) |
| DELETE | /api/transactions/:id | Eliminar transacción | Sí (JWT) |
| GET | /api/pending-payments | Listar pagos pendientes | Sí (JWT) |
| POST | /api/pending-payments | Crear pago pendiente | Sí (JWT) |
| PUT | /api/pending-payments/:id | Actualizar pago pendiente | Sí (JWT) |
| PUT | /api/pending-payments/:id/pay | Registrar cuota pagada | Sí (JWT) |
| DELETE | /api/pending-payments/:id | Eliminar pago pendiente | Sí (JWT) |

## 📦 Scripts Disponibles (Backend)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Inicia servidor con hot-reload |
| `start` | `npm start` | Inicia servidor en producción |
| `db:migrate` | `npm run db:migrate` | Ejecuta migraciones pendientes |
| `db:migrate:undo` | `npm run db:migrate:undo` | Revierte todas las migraciones |
| `db:seed` | `npm run db:seed` | Ejecuta seeders |
| `db:seed:undo` | `npm run db:seed:undo` | Revierte seeders |

## 👥 Autores

- Equipo Monetty - FESC

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
