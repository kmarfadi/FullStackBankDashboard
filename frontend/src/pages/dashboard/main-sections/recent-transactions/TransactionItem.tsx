interface TransactionItemProps {
  name: string;
  amount: number;
  date: string;
  status: 'completed' | 'failed' | 'pending';
}

const TransactionItem: React.FC<TransactionItemProps> = ({ name, amount, date, status }) => {
  const statusColors = {
    completed: 'text-green-600',
    failed: 'text-red-600',
    pending: 'text-yellow-600'
  };

  const statusIcons = {
    completed: '✓',
    failed: '✗',
    pending: '⏳'
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 m-7 last:border-b-0">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</div>
      </div>
      <div className="text-right">
        <div className={`font-semibold ${statusColors[status]}`}>
          ${amount.toFixed(2)}
        </div>
        <div className={`text-sm ${statusColors[status]}`}>
          {statusIcons[status]} {status}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem; 