/**
 * Daily Confidence Badge
 */

import { Gauge, Clock } from 'lucide-react';
import { DailyRoutineResult } from '../../types';

interface DailyConfidenceBadgeProps {
  level: DailyRoutineResult['confidence_level'];
  timeAllocation: string;
}

const confidenceConfig = {
  high: { 
    label: 'High Confidence', 
    className: 'badge-success',
    description: 'Well-tested routine structure'
  },
  medium: { 
    label: 'Medium Confidence', 
    className: 'badge-warning',
    description: 'Solid routine with some customization needed'
  },
  low: { 
    label: 'Low Confidence', 
    className: 'badge-error',
    description: 'Experimental routine - iterate as needed'
  }
};

export function DailyConfidenceBadge({ level, timeAllocation }: DailyConfidenceBadgeProps) {
  const config = confidenceConfig[level];

  return (
    <div className="card">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Routine Overview</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-text-secondary">{timeAllocation}</span>
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
