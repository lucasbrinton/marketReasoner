import { Shield } from 'lucide-react';
import { MarketAnalysis } from '../../types';
import { AnalysisCard } from '../shared';

interface CompetitiveEdgeCardProps {
  data: MarketAnalysis['competitive_edge'];
}

const moatConfig = {
  strong: {
    label: 'Strong Moat',
    className: 'badge-success',
  },
  moderate: {
    label: 'Moderate Moat',
    className: 'badge-warning',
  },
  weak: {
    label: 'Weak Moat',
    className: 'badge-error',
  },
};

export function CompetitiveEdgeCard({ data }: CompetitiveEdgeCardProps) {
  const config = moatConfig[data.moat];

  return (
    <AnalysisCard
      icon={Shield}
      title="Competitive Edge"
      headerRight={
        <span className={`badge ${config.className}`}>
          {config.label}
        </span>
      }
    >
      <p className="text-text-secondary leading-relaxed">{data.explanation}</p>
    </AnalysisCard>
  );
}
