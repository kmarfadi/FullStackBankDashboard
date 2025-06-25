/**
 * Main transaction form component with performance metrics
 */

import React, { useState } from 'react';
import { Person, TransactionRequest, BatchTransactionResponse } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Send, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import PersonSelector from './PersonSelector';

interface TransactionFormProps {
  persons: Person[];
  onSubmit: (transactions: TransactionRequest[]) => Promise<BatchTransactionResponse>;
  loading: boolean;
}

/**
 * Transaction form with batch processing and performance metrics
 */
export default function TransactionForm({ persons, onSubmit, loading }: TransactionFormProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<TransactionRequest[]>([]);
  const [result, setResult] = useState<BatchTransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTransactions.length === 0) {
      setError('Please select at least one person');
      return;
    }

    const validTransactions = selectedTransactions.filter(t => t.amount > 0);
    if (validTransactions.length === 0) {
      setError('Please enter valid amounts greater than 0');
      return;
    }

    try {
      setError(null);
      const response = await onSubmit(validTransactions);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setResult(null);
    }
  };

  /**
   * Calculate total amount
   */
  const getTotalAmount = () => {
    return selectedTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setSelectedTransactions([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <PersonSelector
        persons={persons}
        selectedTransactions={selectedTransactions}
        onTransactionChange={setSelectedTransactions}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Transaction Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Selected Persons</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedTransactions.length}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalAmount())}
                </p>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  <span>{error}</span>
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-700">
                  <span className="space-y-2">
                    <span className="font-medium">Transaction Completed!</span>
                    <span className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <Zap className="h-3 w-3 mr-1" />
                        {result.processedCount} processed
                      </Badge>
                      {result.failedCount > 0 && (
                        <Badge variant="destructive">
                          {result.failedCount} failed
                        </Badge>
                      )}
                      {/* <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {result.summary.processingTime}ms
                      </Badge> */}
                    </span>
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading || selectedTransactions.length === 0}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Transactions
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
