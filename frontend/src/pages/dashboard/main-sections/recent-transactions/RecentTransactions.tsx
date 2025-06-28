import { TrendingUp } from 'lucide-react';
import TransactionItem from './TransactionItem';
import { Transaction } from '@/types';
import { SectionCard, SectionHeader, SectionSubtitle, EmptyState } from '@/components/index';
import { TRANSACTION_CONFIG } from '../../../../lib/constants';

interface RecentTransactionsProps {
  data: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  const transactions = Array.isArray(data) ? data : [];
  
  return (
    <SectionCard background="slate-50" shadow="lg" hover>
      <SectionHeader icon={TrendingUp} title="Recent Transactions" iconColor="text-green-600" />
      <SectionSubtitle>Live transaction status and history</SectionSubtitle>
      
      <div className="space-y-1 overflow-y-auto max-h-80">
        {transactions.length > 0 ? (
          transactions.slice(0, TRANSACTION_CONFIG.MAX_RECENT_TRANSACTIONS).map((transaction, index) => (
            <TransactionItem
              key={index}
              name={transaction.person.name}
              amount={Number(transaction.amount)}
              date={transaction.createdAt}
              status={transaction.status as 'completed' | 'failed' | 'pending'}
            />
          ))
        ) : (
          <EmptyState title="No transactions available" />
        )}
      </div>
    </SectionCard>
  );
};

export default RecentTransactions;
