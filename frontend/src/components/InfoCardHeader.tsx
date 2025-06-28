import React from 'react';
import CardHeader from './CardHeader';

interface InfoCardHeaderProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  className?: string;
}

const InfoCardHeader: React.FC<InfoCardHeaderProps> = ({
  title,
  icon,
  iconColor,
  className = '',
}) => {
  return (
    <CardHeader align="between" className={`mb-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className={iconColor}>{icon}</div>
    </CardHeader>
  );
};

export default InfoCardHeader; 