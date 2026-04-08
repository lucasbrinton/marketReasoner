import type { DailyHistoryItem } from '../../utils/storage';

interface DailyDetailsProps {
  item: DailyHistoryItem;
}

export function DailyDetails({ item }: DailyDetailsProps) {
  const { data } = item.output;

  const steps = Object.entries(data.routine_steps)
    .filter(([, v]) => v)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      number: parseInt(key.replace('step', '')),
      description: value as string,
    }));

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-2">Routine Steps ({data.time_allocation})</h4>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-2 text-sm">
              <span className="text-accent font-bold">{step.number}.</span>
              <span className="text-text-secondary">{step.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Tips for Consistency</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.tips_for_consistency.slice(0, 3).map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Potential Pitfalls</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.potential_pitfalls.slice(0, 3).map((pitfall, i) => (
            <li key={i}>{pitfall}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
