/**
 * Component for displaying transaction history with status indicators
 */
import { Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { History, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

/**
 * Transaction history component with status indicators
 */
export default function TransactionHistory({ transactions, loading, error }: TransactionHistoryProps) {
  
  /**
   * Format currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Format timestamp
   */
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  /**
   * Get status badge for transaction
   */
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load transactions</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {transaction.personName || `Person ${transaction.person}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimestamp(transaction.timestamp)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">
                        {formatCurrency(Number(transaction.amount))}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
