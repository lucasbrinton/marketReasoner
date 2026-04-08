import type { NewsHistoryItem } from '../../utils/storage';

interface NewsDetailsProps {
  item: NewsHistoryItem;
}

export function NewsDetails({ item }: NewsDetailsProps) {
  const { data } = item.output;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Short-Term Impact</h4>
        <p className="text-sm text-text-secondary"><strong>Emotional:</strong> {data.short_term_impact.emotional}</p>
        <p className="text-sm text-text-secondary mt-1"><strong>Business:</strong> {data.short_term_impact.business_relevance}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Long-Term Impact</h4>
        <p className="text-sm text-text-secondary">{data.long_term_impact.signal_vs_noise}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Second-Order Effects</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.second_order_effects.slice(0, 3).map((effect, i) => (
            <li key={i}>{effect}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
