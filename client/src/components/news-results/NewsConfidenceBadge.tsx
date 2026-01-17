/**
 * News Confidence Badge
 */

import { Gauge } from 'lucide-react';
import { NewsAnalysis } from '../../types';

interface NewsConfidenceBadgeProps {
  level: NewsAnalysis['confidence_level'];
}

const confidenceConfig = {
  high: { 
    label: 'High Confidence', 
    className: 'badge-success',
    description: 'Analysis based on clear, verifiable information'
  },
  medium: { 
    label: 'Medium Confidence', 
    className: 'badge-warning',
    description: 'Some ambiguity in the news source'
  },
  low: { 
    label: 'Low Confidence', 
    className: 'badge-error',
    description: 'Significant uncertainties present'
  }
};

export function NewsConfidenceBadge({ level }: NewsConfidenceBadgeProps) {
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
