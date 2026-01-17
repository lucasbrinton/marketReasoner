/**
 * Second Order Effects Card
 */

import { GitBranch } from 'lucide-react';

interface SecondOrderEffectsCardProps {
  effects: string[];
}

export function SecondOrderEffectsCard({ effects }: SecondOrderEffectsCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Second-Order Effects</h3>
        <span className="text-xs text-text-muted">(Indirect / Cascading)</span>
      </div>
      
      <ul className="space-y-2">
        {effects.map((effect, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-accent mt-0.5">{idx + 1}.</span>
            {effect}
          </li>
        ))}
      </ul>
    </div>
  );
}
