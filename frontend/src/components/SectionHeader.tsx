import React from 'react';
import { LucideIcon } from 'lucide-react';
import CardHeader from './CardHeader';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  iconColor?: string;
  titleColor?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  iconColor = 'text-gray-600',
  titleColor = 'text-gray-900',
  className = '',
}) => {
  return (
    <CardHeader className={className}>
      <Icon className={iconColor} size={20} />
      <h3 className={`font-semibold ml-2 ${titleColor}`}>{title}</h3>
    </CardHeader>
  );
};

export default SectionHeader; 