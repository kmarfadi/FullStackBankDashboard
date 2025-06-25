/**
 * API service for handling financial transactions and data fetching
 * Uses the same connection approach as the original UI code
 */

import { Person, Bank, Transaction, TransactionDto, ProcessingResponse } from '../types';
import { safeToNumber } from '../lib/utils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

/**
 * API service object with all endpoint functions
 */
export const api = {
  /**
   * Fetch all persons from the backend
   */
  async fetchPersons(): Promise<Person[]> {
    const response = await fetch(`${API_BASE_URL}/persons`);
    if (!response.ok) throw new Error('Failed to fetch persons');
    const data = await response.json();
    
    // Ensure balance is a number
    return data.map((person: any) => ({
      ...person,
      balance: safeToNumber(person.balance)
    }));
  },

  /**
   * Fetch bank information and balance
   */
  async fetchBank(): Promise<Bank> {
    const response = await fetch(`${API_BASE_URL}/bank`);
    if (!response.ok) throw new Error('Failed to fetch bank');
    const data = await response.json();
    
    // Ensure balance is a number
    return {
      ...data,
      balance: safeToNumber(data.balance)
    };
  },

  /**
   * Fetch transaction history
   */
  async fetchTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const data = await response.json();
    
    // Ensure amounts are numbers
    return data.map((transaction: any) => ({
      ...transaction,
      amount: safeToNumber(transaction.amount),
      person: {
        ...transaction.person,
        balance: safeToNumber(transaction.person?.balance)
      },
      bank: {
        ...transaction.bank,
        balance: safeToNumber(transaction.bank?.balance)
      }
    }));
  },

  /**
   * Process multiple transactions
   */
  async processTransactions(transactions: TransactionDto[]): Promise<ProcessingResponse> {
    const response = await fetch(`${API_BASE_URL}/transactions/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactions }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process transactions');
    }
    
    return response.json();
  },

  
};