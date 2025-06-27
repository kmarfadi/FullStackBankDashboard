import { InfoCardProps } from '@/types';

const InfoCard: React.FC<InfoCardProps> = ({ 
    title,
    icon, 
    iconColor, 
    mainValue,
    mainValueColor,
    subtitle, 
    footer,
    className = "", 
  }) => {
    return (
      <div className={`bg-slate-50 rounded-md p-5 h-full shadow-lg transition-all hover:shadow-xl duration-300   ${className}`}>
        {/* Header with title and icon */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
  
        {/* Main Content */}
        <div className="space-y-1">
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
        </div>
      </div>
    );
  };

  export default InfoCard;