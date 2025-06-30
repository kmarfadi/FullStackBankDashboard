import { Wallet, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import InfoCard from '@/components/InfoCard';
import { useDashboard } from '../../../../context/DashboardContext';

const BankBalanceCard: React.FC = () => {
  const { bankBalance, errors, wsStatus, realTime } = useDashboard();

  if (errors.bankBalance) {
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
        footer={`Error: ${errors.bankBalance}`}
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

  const getStatusIcon = () => {
    if (wsStatus.isConnected && realTime.bankBalance) {
      return <Wifi size={16} className="text-green-500" />;
    }
    if (wsStatus.isConnected) {
      return <Wifi size={16} className="text-yellow-500" />;
    }
    return <WifiOff size={16} className="text-gray-400" />;
  };

  const getStatusText = () => {
    if (wsStatus.isConnected && realTime.bankBalance) {
      return 'Live updates';
    }
    if (wsStatus.isConnected) {
      return 'Connected (polling)';
    }
    return 'Offline';
  };

  const getStatusColor = () => {
    if (wsStatus.isConnected && realTime.bankBalance) {
      return 'bg-green-500';
    }
    if (wsStatus.isConnected) {
      return 'bg-yellow-500';
    }
    return 'bg-gray-400';
  };

  return (
    <InfoCard
      title="Bank Balance"
      icon={<Wallet size={20} />}
      iconColor="text-green-600"
      mainValue={
        bankBalance && typeof bankBalance.balance === 'number'
          ? `$${bankBalance.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          : '--'
      }
      mainValueColor="text-green-600"
      subtitle={
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${realTime.bankBalance ? 'animate-pulse' : ''}`}></div>
          <span>{getStatusText()}</span>
          {getStatusIcon()}
        </div>
      }
      footer={`Marfadi Bank - Updated: ${bankBalance?.timestamp ? formatTime(bankBalance.timestamp) : 'Never'}`}
    />
  );
};

export default BankBalanceCard;