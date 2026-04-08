import { AlertTriangle } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface FailureModesCardProps {
  modes: string[];
}

export function FailureModesCard({ modes }: FailureModesCardProps) {
  return (
    <AnalysisCard icon={AlertTriangle} title="Failure Modes" subtitle="(When the strategy breaks down)" iconClassName="text-error">
      <ul className="space-y-2">
        {modes.map((mode, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-error mt-0.5 font-bold">✕</span>
            {mode}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
