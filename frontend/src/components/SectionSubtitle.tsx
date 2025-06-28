import React from 'react';

interface SectionSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionSubtitle: React.FC<SectionSubtitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-sm text-gray-600 mb-4 ${className}`}>
      {children}
    </p>
  );
};

export default SectionSubtitle; 