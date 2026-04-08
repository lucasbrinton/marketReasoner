import type { RiskHistoryItem } from '../../utils/storage';

interface RiskDetailsProps {
  item: RiskHistoryItem;
}

export function RiskDetails({ item }: RiskDetailsProps) {
  const { data } = item.output;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Exposure Bands</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
          <span>Equities: {data.exposure_bands.equities}</span>
          <span>Fixed Income: {data.exposure_bands.fixed_income}</span>
          <span>Alternatives: {data.exposure_bands.alternatives}</span>
          <span>Cash: {data.exposure_bands.cash}</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Risk Limits</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.risk_limits.slice(0, 3).map((limit, i) => (
            <li key={i}>{limit}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Rebalancing Logic</h4>
        <p className="text-sm text-text-secondary">{data.rebalancing_logic}</p>
      </div>
    </div>
  );
}
