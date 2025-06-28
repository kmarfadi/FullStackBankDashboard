# Frontend — React App

## Overview

This is the frontend for the Fullstack Financial Transactions App. It is built with React, Vite, and TypeScript, and provides a modern UI for sending transactions, viewing the bank balance, and tracking transaction history in real time.

---

## Features

- Select multiple persons and amounts for transactions
- Send batch transactions to the backend
- Real-time polling for bank balance
- Transaction log with status (success/failure)
- Form validation and user feedback
- Responsive, modern UI (Tailwind CSS)
- TypeScript strict mode enabled

---

## File Structure

```
frontend/
├── Dockerfile                # Docker build for frontend service
├── package.json              # Frontend dependencies and scripts
├── tsconfig.json             # TypeScript config (strict mode)
├── vite.config.ts            # Vite config
├── src/
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   ├── components/           # UI components (BankBalance, PersonSelector, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── pages/                # Main pages (Home, etc.)
│   ├── services/             # API service
│   ├── types/                # TypeScript types
│   └── ui/                   # Shared UI components (InfoCard, etc.)
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind CSS config
└── ...
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js v18+
- Backend API running (see backend/README.md)

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start the Frontend
```bash
npm run dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```

---

## Main UI Features

- **Bank Balance:** Real-time updates via polling
- **Person Selector:** Choose multiple persons for transactions
- **Transaction Form:** Enter amounts and send batch transactions
- **Transaction History:** View recent transactions and their statuses
- **Processing Time:** See how long batch processing takes (optional)

---

## API Usage Example

- The frontend communicates with the backend at `/transactions`:
  - **POST /transactions**
    - Request:
      ```json
      [
        { "personId": 1, "amount": 100 },
        { "personId": 2, "amount": 200 }
      ]
      ```
    - Response:
      ```json
      [
        { "success": true, "txId": 1 },
        { "success": false, "error": "Insufficient funds" }
      ]
      ```

---

## Troubleshooting

- **Backend not running:** Ensure the backend API is started and accessible.
- **API errors:** Check the browser console and network tab for error messages.
- **Port conflicts:** Change the frontend port in `vite.config.ts` if needed.
- **TypeScript errors:** Ensure you are using Node.js v18+ and have installed all dependencies.

---

## License

MIT
