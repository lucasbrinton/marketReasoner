import type { StockHistoryItem } from '../../utils/storage';

interface StockDetailsProps {
  item: StockHistoryItem;
}

export function StockDetails({ item }: StockDetailsProps) {
  const { data } = item.output;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Business Model</h4>
        <p className="text-sm text-text-secondary">{data.business_model}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Financial Health</h4>
        <p className="text-sm text-text-secondary">{data.financial_health.summary}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">
          Competitive Edge ({data.competitive_edge.moat} moat)
        </h4>
        <p className="text-sm text-text-secondary">{data.competitive_edge.explanation}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Key Risks</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.risks.short_term.slice(0, 2).map((risk, i) => (
            <li key={i}>{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
