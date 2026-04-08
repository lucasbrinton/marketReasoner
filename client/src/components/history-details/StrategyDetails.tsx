import type { StrategyHistoryItem } from '../../utils/storage';

interface StrategyDetailsProps {
  item: StrategyHistoryItem;
}

export function StrategyDetails({ item }: StrategyDetailsProps) {
  const { data } = item.output;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Behavior in Market Regimes</h4>
        <p className="text-sm text-text-secondary"><strong>Trend:</strong> {data.behavior_in_regimes.trend}</p>
        <p className="text-sm text-text-secondary mt-1"><strong>Range:</strong> {data.behavior_in_regimes.range}</p>
        <p className="text-sm text-text-secondary mt-1"><strong>Volatility:</strong> {data.behavior_in_regimes.high_volatility}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Failure Modes</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.failure_modes.slice(0, 3).map((mode, i) => (
            <li key={i}>{mode}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Emotional Traps</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.emotional_traps.slice(0, 3).map((trap, i) => (
            <li key={i}>{trap}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Risk Profile</h4>
        <p className="text-sm text-text-secondary">{data.risk_profile}</p>
      </div>
    </div>
  );
}
