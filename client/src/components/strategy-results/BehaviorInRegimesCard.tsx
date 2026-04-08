import { TrendingUp, Minus, Activity } from 'lucide-react';
import { StrategySimulation } from '../../types';
import { AnalysisCard } from '../shared';

interface BehaviorInRegimesCardProps {
  data: StrategySimulation['behavior_in_regimes'];
}

export function BehaviorInRegimesCard({ data }: BehaviorInRegimesCardProps) {
  return (
    <AnalysisCard icon={Activity} title="Behavior in Market Regimes">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-text-primary">Trending Markets</span>
          </div>
          <p className="text-sm text-text-secondary">{data.trend}</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Minus className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-text-primary">Range-Bound Markets</span>
          </div>
          <p className="text-sm text-text-secondary">{data.range}</p>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-text-primary">High Volatility</span>
          </div>
          <p className="text-sm text-text-secondary">{data.high_volatility}</p>
        </div>
      </div>
    </AnalysisCard>
  );
}
