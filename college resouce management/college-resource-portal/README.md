# EduVault — College Resource Digital Portal

A full-stack production-style portal for colleges to centralise academic resources.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### 1. Clone & install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
copy .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret
```

### 3. Set up the database

```bash
# Create the database first in PostgreSQL:
# CREATE DATABASE college_portal;

cd backend
npm run migrate   # runs all SQL migration files
npm run seed      # inserts demo data
```

### 4. Start the servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### 5. Login with demo accounts

| Role    | Email                      | Password      |
|---------|----------------------------|---------------|
| Admin   | admin@eduvault.edu         | Password@123  |
| Faculty | faculty.cs@eduvault.edu    | Password@123  |
| Student | student1@eduvault.edu      | Password@123  |

---

## Project Structure

```
college-resource-portal/
├── backend/
│   └── src/
│       ├── config/         # DB, storage, env, migrate, seed runners
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Auth, upload, rate limit, error handler
│       ├── models/         # (query helpers)
│       ├── routes/         # Express routers
│       ├── services/       # Business logic
│       ├── utils/          # Logger, response helpers, file helpers
│       └── validators/     # express-validator rule sets
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # AuthContext, ToastContext
│       ├── hooks/          # useDebounce, useApi
│       ├── layouts/        # PublicLayout, DashboardLayout
│       ├── pages/          # public / student / faculty / admin
│       ├── router/         # Route definitions + guards
│       ├── services/       # Axios API service layer
│       └── utils/          # Constants, formatters
├── database/
│   ├── migrations/         # Ordered SQL migration files
│   └── seed/               # Demo data seed scripts
└── docs/
    ├── ARCHITECTURE.md
    ├── DATABASE_SCHEMA.md
    └── API_SPEC.md
```

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS        |
| Routing   | React Router v6                     |
| Charts    | Recharts                            |
| Backend   | Node.js, Express.js                 |
| Auth      | JWT + bcrypt                        |
| Uploads   | Multer (memory storage)             |
| Database  | PostgreSQL 15                       |
| Logging   | Winston + Morgan                    |

## API Base URL

`http://localhost:5000/api`

All responses follow: `{ success, data, message, pagination? }`

## File Storage

Default: **local** (`backend/uploads/`).  
Switch to Supabase or Cloudinary by setting `STORAGE_PROVIDER` in `.env`.
