import { Scale } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface RebalancingCardProps {
  logic: string;
}

export function RebalancingCard({ logic }: RebalancingCardProps) {
  return (
    <AnalysisCard icon={Scale} title="Rebalancing Logic">
      <p className="text-sm text-text-secondary">{logic}</p>
    </AnalysisCard>
  );
}
