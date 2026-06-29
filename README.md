# 💰 Monetty - Gestor de Gastos Personales

Aplicación web Full Stack para el control de ingresos y gastos personales en tiempo real.

## 📋 Descripción

Monetty es una aplicación personal que permite llevar el control total de ingresos y gastos de manera visual y en tiempo real. Responde preguntas clave como:
- ¿En qué me gasto más?
- ¿Cuánto me queda a fin de mes?
- ¿He gastado mucho en comidas esta semana?

## 🏗️ Arquitectura

```
monetty/
├── client/          # Frontend - React + Vite + Tailwind CSS
├── server/          # Backend - Node.js + Express + PostgreSQL
└── README.md
```

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (iconos)

### Backend
- Node.js
- Express
- PostgreSQL
- JSON Web Tokens (JWT)
- bcryptjs
- cors, dotenv

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### Backend

```bash
cd server
npm install
# Configurar variables de entorno (ver .env.example)
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

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registro de usuario |
| POST | /api/auth/login | Inicio de sesión |
| GET | /api/auth/me | Obtener usuario actual |
| GET | /api/transactions | Listar transacciones |
| POST | /api/transactions | Crear transacción |
| PUT | /api/transactions/:id | Actualizar transacción |
| DELETE | /api/transactions/:id | Eliminar transacción |

## 👥 Autores

- Equipo Monetty

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
