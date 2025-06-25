/**
 * Type definitions for the financial transaction application
 */

export interface Person {
  email: string;
  id: number;
  name: string;
  balance: number | string; // Allow string from API
  createdAt: string;
}

export interface Bank {
  id: number;
  name: string;
  balance: number | string; // Allow string from API
  updatedAt: string;
}

export interface Transaction {
  personName: string;
  id: number;
  amount: number | string; // Allow string from API
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  person: Person;
  bank: Bank;
  timestamp: string; 
}

export interface TransactionDto {
  personId: number;
  amount: number;
}

export interface TransactionResult {
  transactionIndex: number;
  personId: number;
  amount: number;
  status: 'completed' | 'failed';
  error: string | null;
}

export interface ProcessingSummary {
  total: number;
  successful: number;
  failed: number;
  processingTime: string;
  finalBankBalance: number;
}

export interface ProcessingResponse {
  summary: ProcessingSummary;
  results: TransactionResult[];
}

export interface BatchTransactionResponse {
  processedCount: number;
  failedCount: number;
  summary: {
    //decimal number in milliseconds
    processingTime: number;  
  };
}
export interface TransactionRequest {
  personId: number;
  amount: number;
}

// Types
export interface Person {
  id: number;
  name: string;
  balance: number | string;
  createdAt: string;
}

export interface Bank {
  id: number;
  name: string;
  balance: number | string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  amount: number | string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  person: Person;
  bank: Bank;
}

export interface TransactionDto {
  personId: number;
  amount: number;
}

export interface TransactionResult {
  transactionIndex: number;
  personId: number;
  amount: number;
  status: 'completed' | 'failed';
  error: string | null;
}

export interface ProcessingSummary {
  total: number;
  successful: number;
  failed: number;
  processingTime: string;
  finalBankBalance: number;
}

export interface ProcessingResponse {
  summary: ProcessingSummary;
  results: TransactionResult[];
}

export interface TransactionBuilderItem {
  personId: number;
  personName: string;
  amount: number;
  maxBalance: number;
}
