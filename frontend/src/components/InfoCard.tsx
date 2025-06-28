import { SectionCard, InfoCardHeader, InfoCardContent } from '@/components/index';

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  mainValue: string | number;
  mainValueColor: string;
  subtitle: React.ReactNode;
  footer?: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  iconColor,
  mainValue,
  mainValueColor,
  subtitle,
  footer,
  className = "",
}) => (
  <SectionCard background="slate-50" shadow="lg" hover className={`h-full ${className}`}>
    <InfoCardHeader title={title} icon={icon} iconColor={iconColor} />
    <InfoCardContent
      mainValue={mainValue}
      mainValueColor={mainValueColor}
      subtitle={subtitle}
      footer={footer}
    />
  </SectionCard>
);

export default InfoCard;