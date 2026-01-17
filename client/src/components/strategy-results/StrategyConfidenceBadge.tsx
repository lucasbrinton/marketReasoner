/**
 * Strategy Confidence Badge
 */

import { Gauge } from 'lucide-react';
import { StrategySimulation } from '../../types';

interface StrategyConfidenceBadgeProps {
  level: StrategySimulation['confidence_level'];
}

const confidenceConfig = {
  high: { 
    label: 'High Confidence', 
    className: 'badge-success',
    description: 'Well-understood strategy dynamics'
  },
  medium: { 
    label: 'Medium Confidence', 
    className: 'badge-warning',
    description: 'Some aspects require more analysis'
  },
  low: { 
    label: 'Low Confidence', 
    className: 'badge-error',
    description: 'Significant uncertainties present'
  }
};

export function StrategyConfidenceBadge({ level }: StrategyConfidenceBadgeProps) {
  const config = confidenceConfig[level];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Simulation Confidence</h3>
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
