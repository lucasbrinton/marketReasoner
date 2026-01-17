/**
 * Confidence Badge
 */

import { Gauge } from 'lucide-react';
import { MarketAnalysis } from '../../types';

interface ConfidenceBadgeProps {
  level: MarketAnalysis['confidence_level'];
}

const confidenceConfig = {
  high: { 
    label: 'High Confidence', 
    className: 'badge-success',
    description: 'Analysis based on comprehensive data'
  },
  medium: { 
    label: 'Medium Confidence', 
    className: 'badge-warning',
    description: 'Some data limitations noted'
  },
  low: { 
    label: 'Low Confidence', 
    className: 'badge-error',
    description: 'Significant data gaps present'
  }
};

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const config = confidenceConfig[level];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Analysis Confidence</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">{config.description}</span>
          <span className={`badge ${config.className}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
