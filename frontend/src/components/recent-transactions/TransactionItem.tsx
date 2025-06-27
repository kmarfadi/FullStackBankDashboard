import ItemCard from '@/ui/ItemCard';
import { TransactionItemProps } from '@/types';

const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  amount,
  date,
  status
}) => {
  
  const statusColor = 
    status === 'completed' ? 'text-green-600' : 
    status === 'failed' ? 'text-red-600' : 
    'text-yellow-600';

  // Format date as string
  const formattedDate = new Date(date).toLocaleString();
  
  return (
    <ItemCard
      name={name}
      value={amount}
      subtitle={formattedDate}
      statusText={status}
      statusColor={statusColor}
    />
  );
};

export default TransactionItem;
