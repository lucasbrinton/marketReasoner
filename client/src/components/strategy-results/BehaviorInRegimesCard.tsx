/**
 * Behavior in Regimes Card
 */

import { TrendingUp, Minus, Activity } from 'lucide-react';
import { StrategySimulation } from '../../types';

interface BehaviorInRegimesCardProps {
  data: StrategySimulation['behavior_in_regimes'];
}

export function BehaviorInRegimesCard({ data }: BehaviorInRegimesCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Behavior in Market Regimes</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trending Markets */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-text-primary">Trending Markets</span>
          </div>
          <p className="text-sm text-text-secondary">{data.trend}</p>
        </div>
        
        {/* Range-Bound Markets */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Minus className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-text-primary">Range-Bound Markets</span>
          </div>
          <p className="text-sm text-text-secondary">{data.range}</p>
        </div>
        
        {/* High Volatility */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-text-primary">High Volatility</span>
          </div>
          <p className="text-sm text-text-secondary">{data.high_volatility}</p>
        </div>
      </div>
    </div>
  );
}
