import AccountItem from '@/components/availible-accounts/AccountItem';
import { Users } from 'lucide-react';
import { AvailableAccountsProps } from '@/types';

const AvailableAccounts: React.FC<AvailableAccountsProps> = ({
  accounts,
  onAddTransaction = () => {},
}) => {
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Users className="text-blue-600" size={20} />
        <h3 className="font-semibold text-gray-900">Available Accounts</h3>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mb-4">
        Click to add Accounts to your transaction list
      </p>

      {/* Accounts List - Scrollable */}
      <div className="space-y-2 overflow-y-auto max-h-80 mt-2">
        {Array.isArray(accounts) && accounts.length > 0 ? (
          accounts.map(person => (
            <AccountItem
              key={person.id}
              id={person.id}
              name={person.name}
              joinDate={person.createdAt ?? ''}
              balance={Number(person.balance)}
              onAddTransaction={() => onAddTransaction(person)}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-4">No accounts available</div>
        )}
      </div>
    </div>
  );
};

export default AvailableAccounts;
