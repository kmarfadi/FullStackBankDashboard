# 🚀 Fullstack Financial Transactions Dashboard

> **⚠️ NOTE: This README is for the `websocket` branch only.**
>
> Features, setup, and instructions here apply to the WebSocket-enabled version of the app. The main branch may differ (e.g., uses polling instead of WebSockets, different architecture, etc.).
>
> If you want the standard/polling version, check out the `main` branch and its README.

A modern fullstack application for simulating and processing financial transactions, built with NestJS (backend), React (frontend), and PostgreSQL.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-green.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

**Built by [kmarfadi](https://github.com/kmarfadi)**

---

## ✨ Features

- 🔄 **Live Bank Balance**: Real-time polling and display of the bank's current balance
- 👥 **Account Management**: View, select, and manage multiple user accounts
- 💰 **Transaction Builder**: Build and process batch transactions with validation and feedback
- 📈 **Recent Transactions**: Live-updating transaction history with status indicators
- 🔒 **Type Safety**: Full TypeScript support on both frontend and backend
- 🎨 **Modern UI**: Responsive, clean, and accessible interface using Tailwind CSS
- 🐳 **Docker-Ready**: Easy local development with Docker Compose for PostgreSQL

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  NestJS Backend │    │  PostgreSQL DB  │
│   (TypeScript)  │◄──►│   (TypeScript)  │◄──►│   (Docker)      │
│   Port: 5173    │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📁 Repository Structure

```
FullstackBankDashboard/
├── backend/                 # NestJS API with PostgreSQL
│   ├── src/
│   │   ├── bank/           # Bank operations
│   │   ├── person/         # Person management
│   │   ├── transaction/    # Transaction processing
│   │   └── common/         # Shared utilities
│   ├── package.json
│   └── Dockerfile
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Dashboard pages
│   │   ├── types/         # TypeScript definitions
│   │   └── lib/           # Utilities & constants
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
└── docker-compose.yml      # Multi-service orchestration
```

---

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- [Docker](https://www.docker.com/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0+)
- [Node.js](https://nodejs.org/) (v18+ for development)

### 🐳 One-Command Setup

```bash
# 1. Clone the repository
git clone https://github.com/kmarfadi/FullStackBankDashboard
cd FullStackBankDashboard

# 2. Start everything with Docker Compose
docker-compose up -d

# 3. That's it! 🎉
```

### 🟢 If you want to be sure you're running the latest code (no cache)
If you've changed any code, Dockerfile, or dependencies, or if you suspect Docker is running an old version, use:
```bash
docker-compose build --no-cache && docker-compose up -d
```
This will force Docker to rebuild everything from scratch and ensure you're running the latest version.

### 🌐 Access the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5433 (postgres/1234)

### 🗄️ Database Information

The Docker setup will automatically:
- Create PostgreSQL database named `test_bank`
- Create user `postgres` with password `1234`
- Run database migrations and seed initial data
- Set up all required tables (person, bank, transaction)

### 🔍 Quick Verification (Optional)

If you want to verify everything is working:

```bash
# Check if all containers are running
docker-compose ps

# Test the API
curl http://localhost:3000/persons

# Open in browser: http://localhost:5173
```

### 🔧 Troubleshooting (If Something Goes Wrong)

#### Port Already in Use?
```bash
# Stop local PostgreSQL (if running)
sudo service postgresql stop

# Restart Docker setup
docker-compose down
docker-compose up -d
```

#### Containers Not Starting?
```bash
# Check logs
docker-compose logs

# Clean restart
docker-compose down -v
docker-compose up -d
```

#### Database Issues?
```bash
# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

#### Frontend/Backend Issues?
```bash
# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Check service logs
docker-compose logs backend
docker-compose logs frontend
```

### 🛑 Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove everything (including database data)
docker-compose down -v
```

#### Code changes not showing up?
Always use the no-cache build command after code or dependency changes:
```bash
docker-compose build --no-cache && docker-compose up -d
```

---

## 🔧 Manual Setup (Development)

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (local or Docker)
- npm or yarn

### 1. Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Or use your local PostgreSQL instance
# Create database: test_bank
# User: postgres, Password: mysecretpassword
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment (if not using Docker)
cp .env.example .env
# Edit .env with your database connection

# Start development server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📊 API Documentation

### Core Endpoints

#### `GET /persons`
Get all available persons/accounts
```json
{
  "id": 1,
  "name": "John Doe",
  "balance": "1000.00",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /transactions`
Process batch transactions
```json
// Request
[
  { "personId": 1, "amount": 100 },
  { "personId": 2, "amount": 200 }
]

// Response
{
  "summary": {
    "completed": 2,
    "failed": 0,
    "processingTime": 150
  },
  "transactions": [
    { "success": true, "txId": 1 },
    { "success": true, "txId": 2 }
  ]
}
```

#### `GET /transactions`
Get recent transaction history
```json
{
  "id": 1,
  "person": { "name": "John Doe" },
  "amount": "100.00",
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /bank/balance`
Get current bank balance
```json
{
  "balance": "50000.00",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎨 Frontend Features

### Dashboard Components

- 📊 **Bank Balance Card** - Real-time balance display
- 👥 **Available Accounts** - Select accounts for transactions
- 💰 **Transaction Builder** - Create and process transactions
- 📈 **Recent Transactions** - Live transaction history
- ⏱️ **Processing Time** - Performance metrics
- ✅ **Selected Transactions** - Current selection summary

### UI/UX Highlights

- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Real-time Updates** - Live data without page refresh
- **Optimistic UI** - Instant feedback for better UX
- **Error Handling** - Graceful error states and recovery
- **Loading States** - Smooth loading animations
- **Type Safety** - Full TypeScript coverage

---

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

#### Backend
```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
```
### Environment Variables

#### Backend (.env)
```env
DB_STRING=postgres://postgres:mysecretpassword@localhost:5432/test_bank
PORT=3000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## 🐳 Docker Configuration

### Docker Compose Services

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: test_bank
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DB_STRING: postgres://postgres:mysecretpassword@postgres:5432/test_bank

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test         # Unit tests
npm run test:ui      # UI tests
```

---

## 🚀 Deployment

### Production Build
```bash
# Build both services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production
```env
NODE_ENV=production
DB_STRING=your_production_db_url
VITE_API_URL=your_production_api_url
```

---

## 📈 Performance

### Optimizations Implemented

- **Database Indexing** - Optimized queries with proper indexes
- **Connection Pooling** - Efficient database connections
- **Caching** - Redis-ready architecture (can be added)
- **Code Splitting** - Lazy-loaded components
- **Bundle Optimization** - Tree shaking and minification
- **Image Optimization** - Compressed assets

### Monitoring

- **Health Checks** - `/health` endpoints
- **Error Logging** - Structured error handling
- **Performance Metrics** - Processing time tracking
- **Database Monitoring** - Query performance tracking

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS** - For the robust backend framework
- **React** - For the powerful frontend library
- **TypeScript** - For type safety and developer experience
- **Tailwind CSS** - For the beautiful styling system
- **PostgreSQL** - For the reliable database

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting-if-something-goes-wrong) section above
2. Review the [API Documentation](https://github.com/kmarfadi/FullStackBankDashboard/blob/main/backend/README.md)
3. Open an issue on GitHub
4. **Contact me directly**: [khalifahmarfadi@gmail.com](mailto:khalifahmarfadi@gmail.com)


---

**Made with ❤️ by [kmarfadi](https://github.com/kmarfadi)**

