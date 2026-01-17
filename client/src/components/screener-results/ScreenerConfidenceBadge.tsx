/**
 * Screener Confidence Badge
 */

import { Gauge, CheckCircle2 } from 'lucide-react';
import { StockScreenResult } from '../../types';

interface ScreenerConfidenceBadgeProps {
  level: StockScreenResult['confidence_level'];
  passCount: number;
}

const confidenceConfig = {
  high: { 
    label: 'High Confidence', 
    className: 'badge-success',
    description: 'Sufficient data for thorough analysis'
  },
  medium: { 
    label: 'Medium Confidence', 
    className: 'badge-warning',
    description: 'Some data limitations exist'
  },
  low: { 
    label: 'Low Confidence', 
    className: 'badge-error',
    description: 'Limited data available'
  }
};

export function ScreenerConfidenceBadge({ level, passCount }: ScreenerConfidenceBadgeProps) {
  const config = confidenceConfig[level];

  return (
    <div className="card">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Screening Confidence</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-text-secondary">{passCount}/5 criteria passed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">{config.description}</span>
            <span className={`badge ${config.className}`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
