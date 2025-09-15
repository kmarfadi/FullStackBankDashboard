import { Wallet, AlertCircle } from 'lucide-react';
import InfoCard from '@/components/InfoCard';
import { useBankBalance } from '@/hooks/useApi';
import { useSSE } from '@/hooks/useSSE';

const BankBalanceCard: React.FC = () => {
  const { data, error } = useBankBalance();
  const { isConnected } = useSSE();

  if (error) {
    return (
      <InfoCard
        title="Bank Balance"
        icon={<AlertCircle size={20} />}
        iconColor="text-red-600"
        mainValue="Error"
        mainValueColor="text-red-600"
        subtitle={
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Connection failed</span>
          </div>
        }
        footer={`Error: ${error}`}
      />
    );
  }

  // Success state with real data
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <InfoCard
      title="Bank Balance"
      icon={<Wallet size={20} />}
      iconColor="text-green-600"
      mainValue={
        data && typeof data.balance === 'number'
          ? `$${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          : '--'
      }
      mainValueColor="text-green-600"
      subtitle={
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'SSE Connected' : 'SSE Disconnected'}</span>
        </div>
      }
      footer={`Marfadi Bank - Updated: ${data?.timestamp ? formatTime(data.timestamp) : 'Never'}`}
    />
  );
};

export default BankBalanceCard;