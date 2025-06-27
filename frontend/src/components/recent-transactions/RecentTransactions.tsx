import { TrendingUp } from 'lucide-react';
import TransactionItem from '@/components/recent-transactions/TransactionItem';
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  data: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  const transactions = Array.isArray(data) ? data : [];
  return (
    <div className="bg-slate-50 rounded-md p-5 h-full shadow-lg transition-all hover:shadow-xl duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        </div>
      </div>
      
      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-4">
        Live transaction status and history
      </p>
      
      {/* Transaction List */}
      <div className="space-y-1 overflow-y-auto max-h-80">
        {transactions.length > 0 ? (
          transactions.slice(0, 10).map((transaction, index) => (
            <TransactionItem
              key={index}
              name={transaction.person.name}
              amount={Number(transaction.amount)}
              date={transaction.createdAt}
              status={transaction.status as 'completed' | 'failed' | 'pending'}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-4">No transactions available</div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
