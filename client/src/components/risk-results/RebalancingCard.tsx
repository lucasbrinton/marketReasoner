/**
 * Rebalancing Logic Card
 */

import { Scale } from 'lucide-react';

interface RebalancingCardProps {
  logic: string;
}

export function RebalancingCard({ logic }: RebalancingCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Rebalancing Logic</h3>
      </div>
      
      <p className="text-sm text-text-secondary">{logic}</p>
    </div>
  );
}
