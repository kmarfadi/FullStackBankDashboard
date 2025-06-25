# Backend — NestJS API

## Overview

- Handles persons, bank, and transactions.
- Seeds mock data on first run.
- Processes batch transactions atomically and concurrently.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure PostgreSQL connection in `src/app.module.ts` or via `.env`.
3. Start the server:
   ```bash
   npm run start:dev
   ```

## API

### POST /transactions

- Accepts an array of transactions:
  ```json
  [
    { "personId": 1, "amount": 100 },
    { "personId": 2, "amount": 200 }
  ]
  ```
- Returns per-transaction status:
  ```json
  [
    { "success": true, "txId": 1 },
    { "success": false, "error": "Insufficient funds" }
  ]
  ```

## Design Choices

- Uses TypeORM transactions and pessimistic locking for concurrency.
- Seeds data idempotently on startup.