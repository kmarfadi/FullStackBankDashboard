export interface SSEMessage {
  type: 'bank_balance' | 'transaction' | 'account_update';
  data: any;
  timestamp: string;
}

export interface BankBalanceSSEData {
  balance: number;
  timestamp: string;
}

export interface TransactionSSEData {
  id: number;
  personId: number;
  bankId: number;
  amount: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

export interface AccountSSEData {
  id: number;
  name: string;
  balance: number;
  updatedAt: string;
}
