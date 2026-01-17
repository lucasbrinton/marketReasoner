/**
 * Competitive Edge Card
 */

import { Shield } from 'lucide-react';
import { MarketAnalysis } from '../../types';

interface CompetitiveEdgeCardProps {
  data: MarketAnalysis['competitive_edge'];
}

const moatConfig = {
  strong: { 
    label: 'Strong Moat', 
    className: 'badge-success',
    description: 'Durable competitive advantages'
  },
  moderate: { 
    label: 'Moderate Moat', 
    className: 'badge-warning',
    description: 'Some competitive advantages'
  },
  weak: { 
    label: 'Weak Moat', 
    className: 'badge-error',
    description: 'Limited competitive protection'
  }
};

export function CompetitiveEdgeCard({ data }: CompetitiveEdgeCardProps) {
  const config = moatConfig[data.moat];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Competitive Edge</h3>
        </div>
        <span className={`badge ${config.className}`}>
          {config.label}
        </span>
      </div>
      
      <p className="text-text-secondary leading-relaxed">{data.explanation}</p>
    </div>
  );
}
