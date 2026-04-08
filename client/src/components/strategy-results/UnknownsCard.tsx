import { HelpCircle } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface UnknownsCardProps {
  unknowns: string[];
}

export function UnknownsCard({ unknowns }: UnknownsCardProps) {
  return (
    <AnalysisCard icon={HelpCircle} title="Unknowns & Uncertainties" subtitle="(Factors that cannot be predicted)" iconClassName="text-amber-500">
      <ul className="space-y-2">
        {unknowns.map((unknown, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">?</span>
            {unknown}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
