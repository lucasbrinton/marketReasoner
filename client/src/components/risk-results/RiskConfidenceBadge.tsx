/**
 * Risk Confidence Badge
 */

import { Gauge } from 'lucide-react';
import { RiskProfile } from '../../types';

interface RiskConfidenceBadgeProps {
  level: RiskProfile['confidence_level'];
}

const confidenceConfig = {
  high: { 
    label: 'High Confidence', 
    className: 'badge-success',
    description: 'Framework based on clear risk parameters'
  },
  medium: { 
    label: 'Medium Confidence', 
    className: 'badge-warning',
    description: 'Some profile factors require clarification'
  },
  low: { 
    label: 'Low Confidence', 
    className: 'badge-error',
    description: 'Consider providing more details'
  }
};

export function RiskConfidenceBadge({ level }: RiskConfidenceBadgeProps) {
  const config = confidenceConfig[level];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Framework Confidence</h3>
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
