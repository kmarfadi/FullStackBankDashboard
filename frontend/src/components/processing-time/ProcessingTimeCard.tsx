import { Clock } from 'lucide-react';
import InfoCard from '@/ui/InfoCard';

const ProcessingTimeCard: React.FC<{ lastResult: any }> = ({ lastResult }) => {
  // Format processing time safely
  const formatTime = (timeMs: number | undefined): { value: string; unit: string } => {
    if (!timeMs && timeMs !== 0) return { value: '--', unit: 'ms' };
    
    if (timeMs < 1000) {
      return { value: timeMs.toString(), unit: 'ms' };
    } else if (timeMs < 60000) {
      return { value: (timeMs / 1000).toFixed(1), unit: 's' };
    } else {
      return { value: (timeMs / 60000).toFixed(1), unit: 'min' };
    }
  };

  const { value, unit } = formatTime(lastResult?.summary.processingTime);

  return (
    <InfoCard
      title="Processing Time"
      icon={<Clock size={20} />}
      iconColor="text-purple-600"
      mainValue={`${value} ${unit}`}
      mainValueColor="text-purple-600"
      subtitle={
        lastResult 
          ? `Last batch: ${lastResult.summary.completed} completed`
          : "No recent processing"
      }
    />
  );
};

export default ProcessingTimeCard;