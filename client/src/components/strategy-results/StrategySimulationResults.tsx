import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { StrategySimulationResponse } from '../../types';
import { ConfidenceBadge } from '../shared';
import { CONFIDENCE_CONFIGS } from '../../constants/theme';
import { BehaviorInRegimesCard } from './BehaviorInRegimesCard';
import { FailureModesCard } from './FailureModesCard';
import { EmotionalTrapsCard } from './EmotionalTrapsCard';
import { StrategyRiskProfileCard } from './StrategyRiskProfileCard';
import { UnknownsCard } from './UnknownsCard';
import { ExportButton } from '../ExportButton';

interface StrategySimulationResultsProps {
  response: StrategySimulationResponse;
  onNewSimulation: () => void;
}

const STRATEGY_LABELS = {
  swing: 'Swing Trading',
  intraday: 'Intraday Trading',
  position: 'Position Trading'
};

const RISK_LABELS = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk'
};

export function StrategySimulationResults({ response, onNewSimulation }: StrategySimulationResultsProps) {
  const { data, meta } = response;
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Strategy Simulation
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {STRATEGY_LABELS[meta.strategyType]} • {RISK_LABELS[meta.riskLevel]} • {new Date(meta.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton 
            targetRef={exportRef} 
            filename={`strategy-${meta.strategyType}-${meta.riskLevel}-${new Date().toISOString().slice(0, 10)}`} 
          />
          <button
            onClick={onNewSimulation}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Simulation
          </button>
        </div>
      </div>

      {/* Exportable Content */}
      <div ref={exportRef} className="space-y-4">
        <ConfidenceBadge level={data.confidence_level} {...CONFIDENCE_CONFIGS.strategy} />
        <BehaviorInRegimesCard data={data.behavior_in_regimes} />
        <FailureModesCard modes={data.failure_modes} />
        <EmotionalTrapsCard traps={data.emotional_traps} />
        <StrategyRiskProfileCard profile={data.risk_profile} />
        <UnknownsCard unknowns={data.unknowns} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>⚠️ Important:</strong> This simulation is for educational purposes only. 
          It does not provide trade signals, backtesting results, or predictions.
          Past strategy behavior may not predict future results.
        </p>
      </div>
    </div>
  );
}
