import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { TransactionStatusProps } from '@/types';


interface TransactionStatusPropsWithErrors extends TransactionStatusProps {
  errors?: Array<{ index: number; error: string }>;
  generalError?: string | null;
}

const TransactionStatus: React.FC<TransactionStatusPropsWithErrors> = ({
  successful,
  failed,
  time,
  errors = [],
  generalError,
}) => {
  // Determine color and icon
  let color = 'text-green-600';
  let Icon = CheckCircle;
  let statusText = 'Processing Complete!';
  if (failed > 0) {
    color = 'text-red-600';
    Icon = XCircle;
    statusText = 'Some Transactions Failed';
  } else if (generalError) {
    color = 'text-yellow-600';
    Icon = AlertTriangle;
    statusText = 'Error Processing Transactions';
  }

  return (
    <div className="mb-4">
      <div className={`flex items-center ${color} mb-1`}>
        <Icon size={18} className="mr-1.5" />
        <span className="font-medium">{statusText}</span>
      </div>
      <div className="text-sm text-gray-600 ml-6 mb-0.5">
        successful: {successful}, failed: {failed}
      </div>
      <div className="text-sm text-gray-600 ml-6">
        Processing time: {time} ms
      </div>
      {generalError && (
        <div className="text-sm text-yellow-700 ml-6 mt-2">
          <AlertTriangle size={14} className="inline mr-1" />
          {generalError}
        </div>
      )}
      {failed > 0 && errors.length > 0 && (
        <div className="text-sm text-red-600 ml-6 mt-2">
          <div className="flex items-center mb-1">
            <XCircle size={16} className="mr-1" />
            Failed Transactions:
          </div>
          <ul className="list-disc ml-6">
            {errors.map(({ index, error }) => (
              <li key={index}>
                Transaction #{index + 1}: {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
