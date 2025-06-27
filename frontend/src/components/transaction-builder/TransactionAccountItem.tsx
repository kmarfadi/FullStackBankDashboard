import { TransactionAccountProps } from '@/types';

interface TransactionAccountPropsExtended extends TransactionAccountProps {
  balance: number;
  invalid: boolean;
}

const TransactionAccount: React.FC<TransactionAccountPropsExtended> = ({
  id,
  name,
  amount,
  balance,
  invalid,
  onAmountChange
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-100">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500">ID: {id}</p>
        <p className="text-xs text-gray-400">Available: ${balance.toFixed(2)}</p>
      </div>
      <div className="w-52">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className={`w-52 pl-6 pr-2 py-1 border rounded text-center transition-colors duration-200 ${
              invalid ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min={0}
            max={balance}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionAccount;
