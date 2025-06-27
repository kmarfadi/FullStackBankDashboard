import { FileText } from 'lucide-react';
import InfoCard from '@/ui/InfoCard';
import { SelectedTransactionsCardProps } from '@/types';

const SelectedTransactionsCard: React.FC<SelectedTransactionsCardProps> = ({ 
    count = 0, 
    total = 0, 
  }) => {
    return (
      <InfoCard
        title="Selected Transactions"
        icon={<FileText size={20} />}
        iconColor="text-blue-600"
        mainValue={count.toString()}
        mainValueColor="text-blue-600"
        subtitle={`Total: $${total.toFixed(2)}`}
      />
    );
  };
export default SelectedTransactionsCard;