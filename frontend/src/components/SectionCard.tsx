import React from 'react';
import Card from './Card';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'slate-50' | 'slate-100';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'lg' | 'xl';
  hover?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = (props) => {
  return <Card {...props} />;
};

export default SectionCard; 