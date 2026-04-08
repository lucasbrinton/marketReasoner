import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface AnalysisCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconClassName?: string;
  headerRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function AnalysisCard({
  icon: Icon,
  title,
  subtitle,
  iconClassName = 'text-accent',
  headerRight,
  className = '',
  children,
}: AnalysisCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className={`flex items-center ${headerRight ? 'justify-between' : 'gap-2'} mb-4`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconClassName}`} />
          <h3 className="font-semibold text-text-primary">{title}</h3>
          {subtitle && <span className="text-xs text-text-muted">{subtitle}</span>}
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  );
}
