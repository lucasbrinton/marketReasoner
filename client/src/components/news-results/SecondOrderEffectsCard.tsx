import { GitBranch } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface SecondOrderEffectsCardProps {
  effects: string[];
}

export function SecondOrderEffectsCard({ effects }: SecondOrderEffectsCardProps) {
  return (
    <AnalysisCard icon={GitBranch} title="Second-Order Effects" subtitle="(Indirect / Cascading)">
      <ul className="space-y-2">
        {effects.map((effect, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-accent mt-0.5">{idx + 1}.</span>
            {effect}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
