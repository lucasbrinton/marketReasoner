import { PauseCircle } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface InactionRulesCardProps {
  rules: string[];
}

export function InactionRulesCard({ rules }: InactionRulesCardProps) {
  return (
    <AnalysisCard icon={PauseCircle} title="When NOT to Act" subtitle="(Rules for Inaction)">
      <ul className="space-y-2">
        {rules.map((rule, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 mt-0.5 font-bold">⏸</span>
            {rule}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
