import React from 'react';
import CardContent from './CardContent';

interface InfoCardContentProps {
  mainValue: string | number;
  mainValueColor: string;
  subtitle: React.ReactNode;
  footer?: string;
  className?: string;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  mainValue,
  mainValueColor,
  subtitle,
  footer,
  className = '',
}) => {
  return (
    <CardContent spacing="sm" className={className}>
      <div className={`text-2xl font-bold ${mainValueColor}`}>
        {mainValue}
      </div>
      <div className="text-sm text-gray-600">
        {subtitle}
      </div>
      {footer && (
        <div className="text-xs text-gray-500 mt-2">
          {footer}
        </div>
      )}
    </CardContent>
  );
};

export default InfoCardContent; 