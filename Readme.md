# Fullstack Financial Transactions App

A full stack application for simulating and processing financial transactions, built with NestJS (backend) and React (frontend).

## Monorepo Structure

- `backend/` — NestJS API with PostgreSQL and TypeORM
- `frontend/` — React app (Vite + TypeScript)

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/kmarfadi/FullStackBankDashboard.git
cd FullstackBankDashboard
```

#### 2. Setup the backend

```bash
cd backend
npm install
# Configure your PostgreSQL connection in src/app.module.ts or .env
npm run start:dev
```
#### 3. Setup the frontend

```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Open the app

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

## Details

- See `backend/README.md` and `frontend/README.md` for more info.