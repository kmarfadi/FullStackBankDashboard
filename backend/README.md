# Backend API Documentation

A robust NestJS backend API for financial transaction processing with PostgreSQL database integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database connection

# Start development server
npm run start:dev
```

## 📊 API Endpoints

### Base URL
```
http://localhost:3000
```

---

## 🏠 Root Endpoint

### `GET /`
**Description**: Health check and API status

**Response**:
```json
"Hello World!"
```

**Usage**:
```bash
curl http://localhost:3000/
```

---

## 👥 Person Management

### `GET /persons`
**Description**: Retrieve all available persons/accounts

**Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "balance": "1000.00",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "balance": "2500.00",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Usage**:
```bash
curl http://localhost:3000/persons
```

### `GET /persons/:id`
**Description**: Retrieve a specific person by ID

**Parameters**:
- `id` (number): Person ID

**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "balance": "1000.00",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Usage**:
```bash
curl http://localhost:3000/persons/1
```

**Error Response** (404):
```json
{
  "statusCode": 404,
  "message": "Person not found"
}
```

---

## 🏦 Bank Operations

### `GET /bank`
**Description**: Retrieve bank information

**Response**:
```json
{
  "id": 1,
  "name": "Main Bank",
  "balance": "50000.00",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Usage**:
```bash
curl http://localhost:3000/bank
```

### `GET /bank/balance`
**Description**: Get current bank balance with timestamp

**Response**:
```json
{
  "balance": 50000.00,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage**:
```bash
curl http://localhost:3000/bank/balance
```

---

## 💰 Transaction Processing

### `POST /transactions/process`
**Description**: Process multiple transactions in batch

**Request Body**:
```json
{
  "transactions": [
    {
      "personId": 1,
      "amount": 100.00
    },
    {
      "personId": 2,
      "amount": 250.00
    }
  ]
}
```

**Validation Rules**:
- `personId`: Must be a positive integer (≥ 1)
- `amount`: Must be a positive number (> 0)
- `transactions`: Must be an array with at least one transaction

**Response**:
```json
{
  "summary": {
    "completed": 2,
    "failed": 0,
    "processingTime": 150
  },
  "transactions": [
    {
      "success": true,
      "txId": 1,
      "personId": 1,
      "amount": 100.00,
      "status": "completed"
    },
    {
      "success": true,
      "txId": 2,
      "personId": 2,
      "amount": 250.00,
      "status": "completed"
    }
  ]
}
```

**Error Response** (400 - Validation Error):
```json
{
  "statusCode": 400,
  "message": [
    "personId must be a positive number",
    "amount must be a positive number"
  ]
}
```

**Error Response** (400 - Insufficient Funds):
```json
{
  "statusCode": 400,
  "message": "Insufficient funds for person ID 1"
}
```

**Usage**:
```bash
curl -X POST http://localhost:3000/transactions/process \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [
      {"personId": 1, "amount": 100.00},
      {"personId": 2, "amount": 250.00}
    ]
  }'
```

### `GET /transactions`
**Description**: Retrieve all transactions with related data

**Response**:
```json
[
  {
    "id": 1,
    "personId": 1,
    "bankId": 1,
    "amount": "100.00",
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": "2024-01-01T00:00:00.000Z",
    "person": {
      "id": 1,
      "name": "John Doe",
      "balance": "900.00",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "bank": {
      "id": 1,
      "name": "Main Bank",
      "balance": "49900.00",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

**Usage**:
```bash
curl http://localhost:3000/transactions
```

---

## 🔧 Business Logic

### Transaction Processing Rules

1. **Validation**:
   - Person ID must exist
   - Amount must be positive
   - Person must have sufficient balance

2. **Processing**:
   - Transactions are processed sequentially
   - Each transaction updates both person and bank balances
   - Failed transactions don't affect balances
   - Processing time is measured and returned

3. **Balance Updates**:
   - Person balance: `newBalance = currentBalance - amount`
   - Bank balance: `newBalance = currentBalance + amount`

4. **Transaction Status**:
   - `completed`: Transaction processed successfully
   - `failed`: Transaction failed (insufficient funds, invalid data)

### Error Handling

- **400 Bad Request**: Validation errors, insufficient funds
- **404 Not Found**: Person not found
- **500 Internal Server Error**: Database errors, system failures

---

## 🗄️ Database Schema

### Person Entity
```typescript
{
  id: number;           // Primary key
  name: string;         // Person name (max 100 chars)
  balance: number;      // Current balance (decimal 10,2)
  createdAt: Date;      // Account creation timestamp
}
```

### Bank Entity
```typescript
{
  id: number;           // Primary key
  name: string;         // Bank name (max 100 chars)
  balance: number;      // Current balance (decimal 15,2)
  updatedAt: Date;      // Last update timestamp
}
```

### Transaction Entity
```typescript
{
  id: number;           // Primary key
  personId: number;     // Foreign key to Person
  bankId: number;       // Foreign key to Bank
  amount: number;       // Transaction amount (decimal 10,2)
  status: string;       // 'completed' | 'failed'
  createdAt: Date;      // Transaction creation timestamp
  completedAt: Date;    // Transaction completion timestamp
}
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

---

## 🔧 Development

### Available Scripts

```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
```

### Environment Variables

```env
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/fullstack_olimp
PORT=3000
NODE_ENV=development
```

---

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker
```bash
docker build -t backend .
docker run -p 3000:3000 backend
```

---

## 📊 Performance

### Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **Validation**: Input validation with class-validator
- **Error Handling**: Structured error responses
- **Logging**: Comprehensive logging for debugging

### Monitoring
- **Health Checks**: Root endpoint for service health
- **Error Logging**: Structured error handling
- **Performance Metrics**: Processing time tracking
- **Database Monitoring**: Query performance tracking

---

## 🔒 Security

### Input Validation
- All inputs are validated using class-validator
- SQL injection protection through TypeORM
- Type safety with TypeScript

### Error Handling
- No sensitive information in error responses
- Structured error messages
- Global exception filter

---

## 📞 Support

For issues or questions:
1. Check the logs for detailed error information
2. Verify database connectivity
3. Ensure all environment variables are set
4. Open an issue on GitHub

---

**Built with NestJS, TypeScript, and PostgreSQL** 