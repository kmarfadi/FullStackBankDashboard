import { TransactionAccountItemProps } from '@/types';
import { CurrencyInput } from '@/components/index';

const TransactionAccountItem: React.FC<TransactionAccountItemProps> = ({
  id,
  name,
  amount,
  balance,
  invalid,
  onAmountChange
}) => {
  return (
    <div className="flex items-center justify-between p-4 w-5/6 bg-white rounded border border-gray-100">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500">ID: {id}</p>
        <p className="text-xs text-gray-400">Available: ${balance.toFixed(2)}</p>
      </div>
      <div className="w-32 ml-4">
        <CurrencyInput
          value={amount}
          onChange={onAmountChange}
          max={balance}
          invalid={invalid}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TransactionAccountItem;
