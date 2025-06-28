import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/index';
import StatusRow from './StatusRow';
import ProcessingTimeRow from './ProcessingTimeRow';
import TransactionStatusHeader from './TransactionStatusHeader';

interface TransactionStatusProps {
  successful: number;
  failed: number;
  time: number;
  previousTime?: number;
  showTrend?: boolean;
  status?: 'idle' | 'processing' | 'completed' | 'error';
  className?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ 
  successful, 
  failed, 
  time,
  previousTime,
  showTrend = false,
  status = 'completed',
  className = ''
}) => {
  const total = successful + failed;
  const isProcessing = status === 'processing';

  return (
    <Card background="white" shadow="lg" hover className={className}>
      <TransactionStatusHeader 
        icon={<Clock className="text-blue-600" size={20} />}
        title="Transaction Status"
        subtitle={isProcessing ? "Processing transactions..." : "Transaction processing complete"}
        status={status}
      />
      
      <CardContent spacing="md">
        <StatusRow
          icon={<CheckCircle className="text-green-500" size={16} />}
          label="Successful"
          value={successful}
          valueColor="text-green-600"
          showPercentage={total > 0}
          total={total}
        />
        
        <StatusRow
          icon={<XCircle className="text-red-500" size={16} />}
          label="Failed"
          value={failed}
          valueColor="text-red-600"
          showPercentage={total > 0}
          total={total}
        />
        
        <ProcessingTimeRow 
          time={time} 
          previousTime={previousTime}
          showTrend={showTrend}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionStatus; 