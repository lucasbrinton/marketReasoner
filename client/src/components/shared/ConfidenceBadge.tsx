import { Gauge } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ConfidenceLevel } from '../../constants/theme';

const BADGE_CLASSES: Record<ConfidenceLevel, string> = {
  high: 'badge-success',
  medium: 'badge-warning',
  low: 'badge-error',
};

const BADGE_LABELS: Record<ConfidenceLevel, string> = {
  high: 'High Confidence',
  medium: 'Medium Confidence',
  low: 'Low Confidence',
};

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  title: string;
  descriptions: Record<ConfidenceLevel, string>;
  extra?: ReactNode;
}

export function ConfidenceBadge({ level, title, descriptions, extra }: ConfidenceBadgeProps) {
  return (
    <div className="card">
      <div className={`flex items-center justify-between ${extra ? 'flex-wrap gap-4' : ''}`}>
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">{title}</h3>
        </div>
        <div className={`flex items-center ${extra ? 'gap-4' : 'gap-3'}`}>
          {extra}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">{descriptions[level]}</span>
            <span className={`badge ${BADGE_CLASSES[level]}`}>
              {BADGE_LABELS[level]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
