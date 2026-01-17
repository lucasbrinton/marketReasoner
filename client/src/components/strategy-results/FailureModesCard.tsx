/**
 * Failure Modes Card
 */

import { AlertTriangle } from 'lucide-react';

interface FailureModesCardProps {
  modes: string[];
}

export function FailureModesCard({ modes }: FailureModesCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-error" />
        <h3 className="font-semibold text-text-primary">Failure Modes</h3>
        <span className="text-xs text-text-muted">(When the strategy breaks down)</span>
      </div>
      
      <ul className="space-y-2">
        {modes.map((mode, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-error mt-0.5 font-bold">✕</span>
            {mode}
          </li>
        ))}
      </ul>
    </div>
  );
}
