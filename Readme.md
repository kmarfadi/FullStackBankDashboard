# 💸 Fullstack Financial Transactions Dashboard

A modern fullstack application for simulating and processing financial transactions, built with **NestJS** (backend), **React** (frontend), and **PostgreSQL**.

---

## 🚀 Features

- **Live Bank Balance:** Real-time polling and display of the bank's current balance.
- **Account Management:** View, select, and manage multiple user accounts.
- **Transaction Builder:** Build and process batch transactions with validation and feedback.
- **Recent Transactions:** Live-updating transaction history with status indicators.
- **Processing Analytics:** See processing times and transaction outcomes.
- **Robust API:** RESTful backend with validation, error handling, and e2e tests.
- **Type Safety:** Full TypeScript support on both frontend and backend.
- **Modern UI:** Responsive, clean, and accessible interface using Tailwind CSS.
- **Docker-Ready:** Easy local development with Docker Compose for PostgreSQL.

---

## 🗂️ Repository Structure

```
./
├── backend/      # NestJS API with PostgreSQL
└── frontend/     # React + Vite + TypeScript
```

---

## ⚡ Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (local or Docker)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 2. Clone the Repository

```bash
git clone https://github.com/kmarfadi/FullStackBankDashboard.git
cd FullStackBankDashboard
```

---

### 3. Setup the Database

#### Option A: Use Docker (Recommended)

```bash
docker-compose up -d
```
- This will start a local PostgreSQL instance with the correct credentials.

#### Option B: Manual PostgreSQL

1. Create a database (e.g., `test_bank`).
2. Note your username and password.

---

### 4. Configure Environment Variables

#### Backend

- Copy `.env.example` to `.env` in the `backend/` folder and set your database connection string:
  ```
  DATABASE_URL=postgresql://postgres:1234@localhost:5432/test_bank
  ```

#### Frontend

- Copy `.env.example` to `.env` in the `frontend/` folder and set:
  ```
  BASE_API_URL=http://localhost:3000
  ```

---

### 5. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 6. Run the App

#### Start Backend

```bash
cd backend
npm run start:dev
```

#### Start Frontend

```bash
cd ../frontend
npm run dev
```

---

### 7. Open in Browser

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

---

## 📋 Detailed Installation Guide

### Prerequisites

1. **Node.js Installation**
   - Install Node.js v18+ from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **PostgreSQL Setup**
   - **Option A - Docker (Recommended)**:
     - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
     - Verify installation: `docker --version`
   
   - **Option B - Native Installation**:
     - Install [PostgreSQL](https://www.postgresql.org/download/)
     - Create a user and database:
       ```sql
       CREATE USER myuser WITH PASSWORD 'mypassword';
       CREATE DATABASE test_bank;
       GRANT ALL PRIVILEGES ON DATABASE test_bank TO myuser;
       ```

### Step-by-Step Setup

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/kmarfadi/FullStackBankDashboard.git
   cd FullStackBankDashboard
   ```

2. **Database Setup**
   ```bash
   # From the root directory
   docker-compose up -d
   ```

3. **Backend Setup**
   ```bash
   # From the root directory
   cd backend
   cp .env.example .env
   npm install
   npm run start:dev
   ```

4. **Frontend Setup**
   ```bash
   # Open new terminal
   # From the root directory
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

### Verification Steps

1. **Check Backend Health**
   ```bash
   curl http://localhost:3000/bank/balance
   # Should return: {"balance":1000000+,"timestamp":lastupdateddate}
   ```

2. **Frontend Verification**
   - Open http://localhost:5173
   - You should see:
     - Bank balance card with live updates
     - List of available accounts
     - Transaction builder interface

### Common Issues & Solutions

1. **Database Connection Fails**
   ```bash
   # Check PostgreSQL is running
   docker ps | grep postgres
   
   # Check logs
   docker logs <container_id>
   ```

2. **CORS Issues**
   - Verify CORS settings in `.env`:
     ```
     CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
     ```

3. **TypeScript Errors**
   ```bash
   # Rebuild TypeScript
   npm run build
   
   # Clear TypeScript cache
   rm -rf node_modules/.tmp
   ```

### Development Workflow

1. **Running Tests**
   ```bash
   # Backend unit tests
   cd backend && npm test
   
   # Backend e2e tests
   npm run test:e2e
   
   ```

2. **Database Management**
   ```bash
   # Reset database
   docker-compose down -v
   docker-compose up -d
   
   # View logs
   docker-compose logs -f postgres
   ```

3. **API Development**
   - Backend swagger docs: http://localhost:3000/api
   - Available endpoints:
     ```
     GET    /bank/balance
     GET    /persons
     POST   /transactions/process
     ```

### Production Considerations

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use secure database credentials
   - Configure proper CORS origins

2. **Security Checklist**
   - [ ] Update all dependencies
   - [ ] Set proper CORS origins
   - [ ] Enable rate limiting
   - [ ] Set up proper logging

3. **Performance Monitoring**
   - Backend logs location: `backend/logs/`
   - Monitor transaction processing times
   - Check database query performance

---

## 🧪 Testing

### Backend End-to-End Tests

```bash
cd backend
npm run test:e2e
```

---

## 🛠️ Development Notes

- **TypeScript strict mode** is enabled everywhere.
- **Path aliases** are configured for clean imports (`@/components`, `@/hooks`, etc.).
- **Live polling** is used for real-time updates.
- **Error handling** is robust, with global exception filters in the backend.
- **Database seeding**: On first run, mock users and a bank are seeded automatically.

---

## 📝 API Endpoints

- `GET /bank` — Get bank info
- `GET /bank/balance` — Get current bank balance
- `GET /persons` — List all persons/accounts
- `GET /persons/:id` — Get person by ID
- `GET /transactions` — List recent transactions
- `POST /transactions/process` — Process batch transactions

---

## 🧩 Tech Stack

- **Backend:** NestJS, TypeORM, PostgreSQL, class-validator, Jest
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Axios, Lucide Icons
- **DevOps:** Docker Compose

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

---

## 📄 License

MIT

---

## 👤 Author

- [kmarfadi](https://github.com/kmarfadi)

---

## 💡 Tips

- If you change environment variables, restart both backend and frontend.
- For production, set proper CORS and database credentials.
- For troubleshooting, check backend logs and ensure the database is running.

---